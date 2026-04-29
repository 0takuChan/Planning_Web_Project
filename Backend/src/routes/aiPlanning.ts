import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import {
  BatchAutoPlanResult,
  BatchJobPlanningInput,
  BatchPlanningPair,
  generateAutoPlan,
  generateBatchAutoPlan,
  JobStepWithRemaining,
  PlanningPair,
} from "../services/geminiPlanning";

const router = Router();
const prisma = new PrismaClient();

const debugLog = (..._args: unknown[]): void => {};

function formatLocalDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseDateOnlyUtc(dateString: string): Date {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

function endOfDateOnlyUtc(dateString: string): Date {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999));
}

function getNextDateString(dateString: string): string {
  const current = parseDateOnlyUtc(dateString);
  current.setUTCDate(current.getUTCDate() + 1);
  return current.toISOString().slice(0, 10);
}

async function getUsedMinutesForStepOnDate(
  stepId: number,
  plannedDate: string
): Promise<number> {
  const plannings = await prisma.planning.findMany({
    where: {
      planned_date: {
        gte: parseDateOnlyUtc(plannedDate),
        lte: endOfDateOnlyUtc(plannedDate),
      },
      jobStep: {
        step_id: stepId,
      },
    },
    select: {
      planned_quantity: true,
      jobStep: {
        select: {
          minutes_per_unit: true,
        },
      },
    },
  });

  return plannings.reduce((sum, planning) => {
    const minutesPerUnit = planning.jobStep.minutes_per_unit || 0;
    return sum + planning.planned_quantity * minutesPerUnit;
  }, 0);
}

async function getExistingStepMinutesByDate(
  stepIds: number[],
  startDate: string,
  endDate?: string,
  excludeJobIds: number[] = []
): Promise<Record<string, number>> {
  if (!stepIds.length) {
    return {};
  }

  const plannings = await prisma.planning.findMany({
    where: {
      planned_date: {
        gte: parseDateOnlyUtc(startDate),
        ...(endDate ? { lte: endOfDateOnlyUtc(endDate) } : {}),
      },
      ...(excludeJobIds.length
        ? {
            job_id: {
              notIn: excludeJobIds,
            },
          }
        : {}),
      jobStep: {
        step_id: { in: stepIds },
      },
    },
    select: {
      planned_date: true,
      planned_quantity: true,
      jobStep: {
        select: {
          step_id: true,
          minutes_per_unit: true,
        },
      },
    },
  });

  return plannings.reduce<Record<string, number>>((usageMap, planning) => {
    if (!planning.jobStep.minutes_per_unit || planning.jobStep.minutes_per_unit <= 0) {
      return usageMap;
    }

    const dateKey = formatLocalDate(planning.planned_date);
    const usageKey = `${planning.jobStep.step_id}:${dateKey}`;
    usageMap[usageKey] =
      (usageMap[usageKey] || 0) +
      planning.planned_quantity * planning.jobStep.minutes_per_unit;
    return usageMap;
  }, {});
}

function buildGeminiErrorResponse(error: any) {
  const message = error?.message || "An error occurred while generating the plan";

  if (message.includes("GEMINI_API_KEY") || message.includes("GROQ_API_KEY")) {
    return {
      status: 500,
      body: {
        success: false,
        message: "AI provider API key not configured",
      },
    };
  }

  if (message.includes("AI_PROVIDER")) {
    return {
      status: 500,
      body: {
        success: false,
        message: "AI provider configuration is invalid. Use AI_PROVIDER=gemini or AI_PROVIDER=groq.",
      },
    };
  }

  if (message.includes("reported as leaked")) {
    return {
      status: 500,
      body: {
        success: false,
        message: "Gemini API key was reported as leaked. Please create a new API key and update the backend environment.",
      },
    };
  }

  if (message.includes("API_KEY_INVALID") || message.includes("API key expired")) {
    return {
      status: 500,
      body: {
        success: false,
        message: "Gemini API key expired or invalid. Please create a new API key and update Backend/.env.",
      },
    };
  }

  if (message.includes("Groq API Error: 401") || message.toLowerCase().includes("invalid_api_key")) {
    return {
      status: 500,
      body: {
        success: false,
        message: "Groq API key is invalid. Please create a new API key and update Backend/.env.",
      },
    };
  }

  if (
    message.includes("Gemini API quota exhausted") ||
    message.includes("Groq API quota exhausted") ||
    message.includes("GenerateRequestsPerDayPerProjectPerModel-FreeTier") ||
    message.includes("limit: 0") ||
    message.toLowerCase().includes("insufficient_quota")
  ) {
    return {
      status: 429,
      body: {
        success: false,
        message: "AI provider quota is exhausted for this project. Add billing, switch to another project/key with quota, or wait for quota reset before trying again.",
      },
    };
  }

  if (
    message.includes("Gemini API Rate Limited") ||
    message.includes("Groq API Rate Limited") ||
    message.includes("RESOURCE_EXHAUSTED") ||
    message.toLowerCase().includes("rate_limit_exceeded")
  ) {
    return {
      status: 429,
      body: {
        success: false,
        message: "AI provider is temporarily rate limited. Please try again later.",
      },
    };
  }

  if (message.includes("PERMISSION_DENIED") || message.includes("Gemini API Error: 403")) {
    return {
      status: 500,
      body: {
        success: false,
        message: "Gemini API permission denied. Please verify the API key and project settings.",
      },
    };
  }

  if (message.includes("Failed to parse Gemini response") || message.includes("Failed to parse AI response")) {
    return {
      status: 500,
      body: {
        success: false,
        message: "AI response parsing error - please check step configuration",
      },
    };
  }

  if (message.includes("Unable to create a complete plan")) {
    return {
      status: 400,
      body: {
        success: false,
        message,
      },
    };
  }

  if (message.includes("Invalid Groq API response structure") || message.includes("Invalid Gemini API response structure")) {
    return {
      status: 500,
      body: {
        success: false,
        message: "AI provider returned an invalid response structure.",
      },
    };
  }

  return {
    status: 500,
    body: {
      success: false,
      message,
    },
  };
}

type PlanningCreateItem = {
  job_id: number;
  job_step_id: number;
  date: string;
  quantity: number;
};

type JobStepForAutoPlanCreate = {
  job_step_id: number;
  job_id: number;
  step_id: number;
  minutes_per_unit: number | null;
  step: {
    step_name: string;
    standard_time: number;
  };
};

async function createPlanningRecords(planningPairs: PlanningCreateItem[]) {
  const createdPlannings = [];
  let successCount = 0;
  let skippedCount = 0;
  const jobStepCache = new Map<number, JobStepForAutoPlanCreate | null>();

  for (const pair of planningPairs) {
    try {
      let jobStep = jobStepCache.get(pair.job_step_id);
      if (!jobStep) {
        jobStep = await prisma.jobStep.findUnique({
          where: { job_step_id: pair.job_step_id },
          include: {
            step: {
              select: {
                step_name: true,
                standard_time: true,
              },
            },
          },
        });
        jobStepCache.set(pair.job_step_id, jobStep);
      }

      if (!jobStep) {
        throw new Error(`Job step ${pair.job_step_id} not found while creating auto-plan records`);
      }

      let remainingQuantity = pair.quantity;
      let targetDate = pair.date;

      while (remainingQuantity > 0) {
        const plannedDate = parseDateOnlyUtc(targetDate);
        debugLog(
          `  [AUTO-PLAN API] Materializing Planning: job_id=${pair.job_id}, step_id=${pair.job_step_id}, date=${targetDate}, remaining_qty=${remainingQuantity}`
        );

        if (jobStep.minutes_per_unit && jobStep.minutes_per_unit > 0) {
          const usedMinutes = await getUsedMinutesForStepOnDate(jobStep.step_id, targetDate);
          const remainingMinutes = Math.max(0, jobStep.step.standard_time - usedMinutes);
          const availableUnits = Math.floor(remainingMinutes / jobStep.minutes_per_unit);

          if (availableUnits <= 0) {
            debugLog(
              `  [AUTO-PLAN API] Day ${targetDate} for step ${jobStep.step.step_name} is full (${usedMinutes}/${jobStep.step.standard_time} min). Moving to next available day.`
            );
            targetDate = getNextDateString(targetDate);
            continue;
          }

          const quantityForDate = Math.min(remainingQuantity, availableUnits);
          const existingSameDay = await prisma.planning.findFirst({
            where: {
              job_id: pair.job_id,
              job_step_id: pair.job_step_id,
              planned_date: plannedDate,
            },
          });

          let planning;
          if (existingSameDay) {
            planning = await prisma.planning.update({
              where: { planning_id: existingSameDay.planning_id },
              data: {
                planned_quantity: existingSameDay.planned_quantity + quantityForDate,
              },
            });
          } else {
            planning = await prisma.planning.create({
              data: {
                job_id: pair.job_id,
                job_step_id: pair.job_step_id,
                planned_date: plannedDate,
                planned_quantity: quantityForDate,
              },
            });
          }

          createdPlannings.push(planning);
          successCount++;
          remainingQuantity -= quantityForDate;
          debugLog(
            `  [AUTO-PLAN API] ✓ Saved ${quantityForDate} units on ${targetDate} (${remainingMinutes} free min before save, max ${availableUnits} units)`
          );

          if (remainingQuantity > 0) {
            targetDate = getNextDateString(targetDate);
          }
          continue;
        }

        const existingSameDay = await prisma.planning.findFirst({
          where: {
            job_id: pair.job_id,
            job_step_id: pair.job_step_id,
            planned_date: plannedDate,
          },
        });

        let planning;
        if (existingSameDay) {
          planning = await prisma.planning.update({
            where: { planning_id: existingSameDay.planning_id },
            data: {
              planned_quantity: existingSameDay.planned_quantity + remainingQuantity,
            },
          });
        } else {
          planning = await prisma.planning.create({
            data: {
              job_id: pair.job_id,
              job_step_id: pair.job_step_id,
              planned_date: plannedDate,
              planned_quantity: remainingQuantity,
            },
          });
        }

        createdPlannings.push(planning);
        successCount++;
        debugLog(`  [AUTO-PLAN API] ✓ Created planning_id=${planning.planning_id}`);
        remainingQuantity = 0;
      }
    } catch (error: any) {
      if (error.code === "P2002") {
        debugLog(
          `  [AUTO-PLAN API] ⚠ Skipping duplicate planning: job_id=${pair.job_id}, job_step_id=${pair.job_step_id}, date=${pair.date}`
        );
        skippedCount++;
      } else {
        console.error("  [AUTO-PLAN API] ✗ Error creating planning record:", error);
        throw error;
      }
    }
  }

  return {
    createdPlannings,
    successCount,
    skippedCount,
  };
}

/**
 * POST /api/plannings/auto-plan
 * Generates an automatic production plan using Gemini AI
 * 
 * Request Body:
 * {
 *   job_id: number
 * }
 * 
 * Response:
 * {
 *   success: boolean,
 *   message: string,
 *   count: number,
 *   plannings: Planning[]
 * }
 */
router.post("/auto-plan", async (req: Request, res: Response) => {
  try {
    const { job_id } = req.body;

    // Validate input
    if (!job_id || !Number.isInteger(job_id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid or missing job_id in request body",
      });
    }

    // Fetch job with customer details
    const job = await prisma.job.findUnique({
      where: { job_id },
      include: { customer: true },
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: `Job with ID ${job_id} not found`,
      });
    }

    // Fetch all JobSteps for this job with Step details (including standard_time)
    const jobSteps = await prisma.jobStep.findMany({
      where: { job_id },
      include: {
        step: true,
      },
    });

    if (jobSteps.length === 0) {
      return res.status(400).json({
        success: false,
        message: `Job ${job.job_number} has no steps configured`,
      });
    }

    // Validate that all steps have minutes_per_unit configured
    const stepsWithoutMinutes = jobSteps.filter(
      (js) => js.minutes_per_unit === null || js.minutes_per_unit === undefined
    );

    if (stepsWithoutMinutes.length > 0) {
      const stepNames = stepsWithoutMinutes
        .map((js) => js.step.step_name)
        .join(", ");
      return res.status(400).json({
        success: false,
        message: `Steps missing minutes_per_unit configuration: ${stepNames}`,
      });
    }

    const dueDateString = formatLocalDate(job.end_date);
    const todayString = formatLocalDate(new Date());
    const stepIds = [...new Set(jobSteps.map((jobStep) => jobStep.step_id))];

    const existingStepMinutesByDate = await getExistingStepMinutesByDate(stepIds, todayString, undefined, [job_id]);

    const jobStepsWithRemaining: JobStepWithRemaining[] = jobSteps
      .map((js) => ({
        job_step_id: js.job_step_id,
        step_id: js.step_id,
        step_name: js.step.step_name,
        minutes_per_unit: js.minutes_per_unit || 0,
        standard_time: js.step.standard_time,
        priority: js.step.priority,
        remaining_quantity: job.total_quantity,
      }))
      .filter((jobStep) => jobStep.remaining_quantity > 0);

    if (jobStepsWithRemaining.length === 0) {
      return res.status(400).json({
        success: false,
        message: `${job.job_number} is already fully planned`,
      });
    }

    // Call Gemini planning service
    debugLog("\n[AUTO-PLAN API] Calling generateAutoPlan service...");
    const planningPairs = await generateAutoPlan(
      job.job_number,
      dueDateString,
      jobStepsWithRemaining,
      existingStepMinutesByDate
    );
    debugLog(`[AUTO-PLAN API] Service returned ${planningPairs.length} planning pairs\n`);

    if (planningPairs.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Gemini AI could not generate a valid production plan",
      });
    }

    const clearedExistingPlans = await prisma.planning.deleteMany({
      where: { job_id },
    });
    debugLog(`[AUTO-PLAN API] Cleared ${clearedExistingPlans.count} existing planning records for job ${job.job_number} before saving the regenerated plan`);

    const { createdPlannings, successCount, skippedCount } = await createPlanningRecords(
      planningPairs.map((pair: PlanningPair) => ({
        job_id,
        job_step_id: pair.job_step_id,
        date: pair.date,
        quantity: pair.quantity,
      }))
    );

    debugLog(`[AUTO-PLAN API] SUCCESS: Created ${successCount} planning records for job ${job.job_number}\n`);
    
    return res.status(200).json({
      success: true,
      message: `Auto plan generated successfully for ${job.job_number}. Created ${successCount} planning records${
        skippedCount > 0 ? ` (${skippedCount} duplicates skipped)` : ""
      }.`,
      count: successCount,
      plannings: createdPlannings,
    });
  } catch (error: any) {
    console.error("[AUTO-PLAN API] ERROR:", error.message);
    console.error("\nFull Error Details:\n", error);
    const errorResponse = buildGeminiErrorResponse(error);
    return res.status(errorResponse.status).json(errorResponse.body);
  }
});

router.post("/auto-plan-batch", async (req: Request, res: Response) => {
  try {
    const { job_ids } = req.body as { job_ids?: number[] };

    if (!Array.isArray(job_ids) || job_ids.length === 0 || !job_ids.every(Number.isInteger)) {
      return res.status(400).json({
        success: false,
        message: "Invalid or missing job_ids in request body",
      });
    }

    const uniqueJobIds = [...new Set(job_ids)];
    const todayString = formatLocalDate(new Date());

    const [jobs, jobSteps] = await Promise.all([
      prisma.job.findMany({
        where: { job_id: { in: uniqueJobIds } },
        include: { customer: true },
      }),
      prisma.jobStep.findMany({
        where: { job_id: { in: uniqueJobIds } },
        include: { step: true },
      }),
    ]);

    const jobMap = new Map(jobs.map((job) => [job.job_id, job]));
    const missingJobIds = uniqueJobIds.filter((jobId) => !jobMap.has(jobId));
    if (missingJobIds.length > 0) {
      return res.status(404).json({
        success: false,
        message: `Jobs not found: ${missingJobIds.join(", ")}`,
      });
    }

    const stepIds = [...new Set(jobSteps.map((jobStep) => jobStep.step_id))];
    const maxDueDate = jobs.reduce((latest, job) => {
      const jobDate = formatLocalDate(job.end_date);
      return jobDate > latest ? jobDate : latest;
    }, todayString);
    const existingStepMinutesByDate = await getExistingStepMinutesByDate(stepIds, todayString, undefined, uniqueJobIds);

    const failedJobs: string[] = [];
    const batchJobs: BatchJobPlanningInput[] = [];

    for (const jobId of uniqueJobIds) {
      const job = jobMap.get(jobId)!;
      const stepsForJob = jobSteps.filter((jobStep) => jobStep.job_id === jobId);

      if (stepsForJob.length === 0) {
        failedJobs.push(`${job.job_number}: no steps configured`);
        continue;
      }

      const stepsWithoutMinutes = stepsForJob.filter(
        (jobStep) => jobStep.minutes_per_unit === null || jobStep.minutes_per_unit === undefined
      );
      if (stepsWithoutMinutes.length > 0) {
        failedJobs.push(
          `${job.job_number}: steps missing minutes_per_unit (${stepsWithoutMinutes
            .map((jobStep) => jobStep.step.step_name)
            .join(", ")})`
        );
        continue;
      }

      const stepsWithRemaining: JobStepWithRemaining[] = stepsForJob
        .map((jobStep) => {
          return {
            job_step_id: jobStep.job_step_id,
            step_id: jobStep.step_id,
            step_name: jobStep.step.step_name,
            minutes_per_unit: jobStep.minutes_per_unit || 0,
            standard_time: jobStep.step.standard_time,
            priority: jobStep.step.priority,
            remaining_quantity: job.total_quantity,
          };
        })
        .filter((jobStep) => jobStep.remaining_quantity > 0);

      if (stepsWithRemaining.length === 0) {
        failedJobs.push(`${job.job_number}: already fully planned`);
        continue;
      }

      batchJobs.push({
        job_id: job.job_id,
        job_number: job.job_number,
        total_quantity: job.total_quantity,
        due_date: job.end_date.toISOString().split("T")[0],
        job_steps: stepsWithRemaining,
      });
    }

    if (batchJobs.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No eligible jobs available for batch auto planning",
        failedJobs,
      });
    }

    batchJobs.sort((left, right) => {
      if (left.due_date !== right.due_date) {
        return left.due_date.localeCompare(right.due_date);
      }
      return left.job_number.localeCompare(right.job_number);
    });

    debugLog(`\n[AUTO-PLAN BATCH API] Calling generateBatchAutoPlan service for ${batchJobs.length} jobs...`);
    const batchPlanResult: BatchAutoPlanResult = await generateBatchAutoPlan(batchJobs, existingStepMinutesByDate);
    const planningPairs = batchPlanResult.planningPairs;
    debugLog(`[AUTO-PLAN BATCH API] Service returned ${planningPairs.length} planning pairs\n`);

    const jobsWithPlans = new Set(planningPairs.map((pair) => pair.job_id));
    for (const batchJob of batchJobs) {
      if (!jobsWithPlans.has(batchJob.job_id)) {
        failedJobs.push(`${batchJob.job_number}: AI did not return any plans`);
      }
    }

    if (planningPairs.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Gemini AI could not generate a valid production plan",
        failedJobs,
      });
    }

    const clearedExistingPlans = await prisma.planning.deleteMany({
      where: {
        job_id: {
          in: batchJobs.map((job) => job.job_id),
        },
      },
    });
    debugLog(`[AUTO-PLAN BATCH API] Cleared ${clearedExistingPlans.count} existing planning records before saving regenerated batch plans`);

    const { createdPlannings, successCount, skippedCount } = await createPlanningRecords(
      planningPairs.map((pair: BatchPlanningPair) => ({
        job_id: pair.job_id,
        job_step_id: pair.job_step_id,
        date: pair.date,
        quantity: pair.quantity,
      }))
    );

    debugLog(
      `[AUTO-PLAN BATCH API] SUCCESS: Created ${successCount} planning records for ${jobsWithPlans.size}/${uniqueJobIds.length} jobs\n`
    );

    return res.status(200).json({
      success: true,
      message: `Auto plan batch generated for ${jobsWithPlans.size}/${uniqueJobIds.length} jobs. Created ${successCount} planning records${
        skippedCount > 0 ? ` (${skippedCount} duplicates skipped)` : ""
      }.`,
      count: successCount,
      jobCount: jobsWithPlans.size,
      failedJobs,
      plannings: createdPlannings,
      priorityRecommendations: batchPlanResult.priorityRecommendations,
    });
  } catch (error: any) {
    console.error("[AUTO-PLAN BATCH API] ERROR:", error.message);
    console.error("\nFull Error Details:\n", error);
    const errorResponse = buildGeminiErrorResponse(error);
    return res.status(errorResponse.status).json(errorResponse.body);
  }
});

export default router;

