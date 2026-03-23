export interface JobStepWithCapacity {
  job_step_id: number;
  step_id: number;
  step_name: string;
  minutes_per_unit: number | null;
  standard_time: number; // minutes available per day
}

export interface PlanningPair {
  date: string; // YYYY-MM-DD format
  job_step_id: number;
  quantity: number;
}

export interface JobStepWithRemaining extends JobStepWithCapacity {
  remaining_quantity: number;
}

export interface BatchJobPlanningInput {
  job_id: number;
  job_number: string;
  total_quantity: number;
  due_date: string;
  job_steps: JobStepWithRemaining[];
}

export interface BatchPlanningPair extends PlanningPair {
  job_id: number;
}

function formatLocalDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Helper function: Sleep for milliseconds
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Helper function: Retry API call with exponential backoff
async function retryFetch(
  url: string,
  options: RequestInit,
  maxRetries: number = 3
): Promise<Response> {
  let lastError: any = null;
  let retryCount = 0;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);

      // Handle 429 specifically - wait and retry
      if (response.status === 429) {
        const errorData = await response.json();
        const retryAfter = errorData.error?.details?.[2]?.retryDelay;
        
        // Extract seconds from "31.787433223s" format
        let waitSeconds = 32; // default
        if (retryAfter && typeof retryAfter === 'string') {
          const match = retryAfter.match(/(\d+)/);
          if (match) {
            waitSeconds = parseInt(match[1], 10) + 2; // Add 2s buffer
          }
        }

        console.log(`[Attempt ${attempt + 1}/${maxRetries + 1}] Rate limited. Waiting ${waitSeconds}s before retry...`);
        
        if (attempt < maxRetries) {
          await sleep(waitSeconds * 1000);
          continue; // Retry
        } else {
          throw new Error(`Gemini API Rate Limited: ${JSON.stringify(errorData)}`);
        }
      }

      // For other errors, retry with exponential backoff
      if (!response.ok) {
        const errorData = await response.json();
        lastError = new Error(`Gemini API Error: ${response.status} ${JSON.stringify(errorData)}`);
        
        console.log(`[Attempt ${attempt + 1}/${maxRetries + 1}] API returned ${response.status}. ${attempt < maxRetries ? 'Retrying...' : 'Max retries reached.'}`);
        
        if (attempt < maxRetries) {
          const waitMs = Math.pow(2, attempt) * 1000; // 1s, 2s, 4s, 8s...
          await sleep(waitMs);
          continue; // Retry
        } else {
          throw lastError;
        }
      }

      // Success
      return response;
    } catch (error) {
      lastError = error;
      
      if (attempt < maxRetries) {
        const waitMs = Math.pow(2, attempt) * 1000;
        console.log(`[Attempt ${attempt + 1}/${maxRetries + 1}] Error occurred. Waiting ${waitMs}ms before retry...`);
        await sleep(waitMs);
        continue;
      } else {
        throw error;
      }
    }
  }

  throw lastError || new Error("Unknown error in retryFetch");
}

export async function generateAutoPlan(
  jobNumber: string,
  totalQuantity: number,
  dueDate: string,
  jobSteps: JobStepWithCapacity[]
): Promise<PlanningPair[]> {
  // Validate API key
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not set");
  }

  const todayString = formatLocalDate(new Date());

  console.log("\n========== GEMINI AUTO PLAN REQUEST ==========");
  console.log(`Job Number: ${jobNumber}`);
  console.log(`Total Quantity: ${totalQuantity}`);
  console.log(`Due Date: ${dueDate}`);
  console.log(`Current Date: ${todayString}`);
  console.log(`Job Steps Count: ${jobSteps.length}`);
  console.log("Job Steps Data:");
  jobSteps.forEach(s => {
    console.log(`  - Step ID ${s.job_step_id}: ${s.step_name} (${s.minutes_per_unit} min/unit, ${s.standard_time} min/day)`);
  });

  // Calculate capacity for each step
  const stepCapacities = jobSteps
    .filter((s) => s.minutes_per_unit && s.minutes_per_unit > 0)
    .map((s) => ({
      job_step_id: s.job_step_id,
      step_name: s.step_name,
      minutes_per_unit: s.minutes_per_unit,
      standard_time: s.standard_time,
      units_per_day: Math.floor(s.standard_time / (s.minutes_per_unit || 1)),
    }));

  if (stepCapacities.length === 0) {
    throw new Error(
      "No job steps with minutes_per_unit configured found"
    );
  }

  // Build detailed prompt for Gemini
  const stepDetails = stepCapacities
    .map(
      (s) =>
        `- Job Step ID ${s.job_step_id} (${s.step_name}): Can produce max ${s.units_per_day} units/day (${s.standard_time} min available ÷ ${s.minutes_per_unit} min/unit)`
    )
    .join("\n");

  const prompt = `You are a production planning AI. Calculate an optimal production schedule for a manufacturing job.

Job Details:
- Job Number: ${jobNumber}
- Total Quantity to Produce: ${totalQuantity} units
- Current Date: ${todayString}
- Due Date: ${dueDate}
- Production Steps with Daily Capacities:
${stepDetails}

Requirements:
1. Schedule production only on weekdays (Monday-Friday)
2. Do not schedule any work before the current date (${todayString})
3. Do not exceed the daily capacity for each step
4. All steps must complete by the due date
5. Distribute work evenly across steps where possible
6. Return a JSON array with objects containing: date (YYYY-MM-DD), job_step_id, quantity

Production Start: Start on or after ${todayString}. Never use dates before ${todayString}.

Return ONLY valid JSON array format like:
[
  {"date": "2026-03-24", "job_step_id": 1, "quantity": 100},
  {"date": "2026-03-25", "job_step_id": 1, "quantity": 100}
]

Do not include any markdown formatting, code blocks, or explanations. Just the JSON array.`;

  console.log("\nPrompt being sent to Gemini:");
  console.log("---");
  console.log(prompt);
  console.log("---\n");

  try {
    // Call Gemini 2.0 Flash via REST API with retry logic
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
    
    console.log(`Calling Gemini API at: ${apiUrl.replace(apiKey, 'REDACTED')}`);
    
    const response = await retryFetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      }),
    });

    const result = await response.json();
    
    console.log("\nGemini API Response Status: SUCCESS");
    console.log("Full Response:");
    console.log(JSON.stringify(result, null, 2));
    
    // Extract text from REST API response format
    if (!result.candidates || !result.candidates[0] || !result.candidates[0].content || !result.candidates[0].content.parts || !result.candidates[0].content.parts[0]) {
      console.log("ERROR: Invalid response structure");
      throw new Error("Invalid Gemini API response structure");
    }

    const responseText = result.candidates[0].content.parts[0].text;
    console.log("\nExtracted Response Text:");
    console.log(responseText);

    // Extract JSON from response (handle markdown code blocks if any)
    let jsonString = responseText;
    const jsonMatch = responseText.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      jsonString = jsonMatch[0];
      console.log("\nExtracted JSON array from response");
    } else {
      console.log("\nNo JSON array found in response, using full text as JSON");
    }

    console.log("JSON String length:", jsonString.length);
  console.log("JSON String Content:");
  console.log(jsonString);

    // Parse JSON response
    const plannedSchedule = JSON.parse(jsonString);
    console.log(`Parsed JSON successfully. Array length: ${plannedSchedule.length}`);
  console.log("Parsed Schedule Data:");
  console.log(JSON.stringify(plannedSchedule, null, 2));

    if (!Array.isArray(plannedSchedule)) {
      throw new Error("Response is not an array");
    }

    // Validate and transform response
    const validPlans: PlanningPair[] = [];
    const quantityTracker: { [jobStepId: number]: number } = {};

    for (const plan of plannedSchedule) {
      const { date, job_step_id, quantity } = plan;

      // Validate date format
      if (!date || typeof date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        console.warn(`Invalid date format: ${date}, skipping`);
        continue;
      }

      if (date < todayString) {
        console.warn(`Plan date ${date} is before current date ${todayString}, skipping`);
        continue;
      }

      // Validate job_step_id
      if (!Number.isInteger(job_step_id)) {
        console.warn(`Invalid job_step_id: ${job_step_id}, skipping`);
        continue;
      }

      // Validate quantity
      if (!Number.isInteger(quantity) || quantity <= 0) {
        console.warn(`Invalid quantity: ${quantity} for step ${job_step_id}, skipping`);
        continue;
      }

      // Check if step exists and get its capacity
      const stepCapacity = stepCapacities.find((s) => s.job_step_id === job_step_id);
      if (!stepCapacity) {
        console.warn(`Step ${job_step_id} not found in job steps, skipping`);
        continue;
      }

      // Validate daily quantity doesn't exceed capacity
      if (quantity > stepCapacity.units_per_day) {
        console.warn(
          `Quantity ${quantity} exceeds capacity ${stepCapacity.units_per_day} for step ${job_step_id} on ${date}, adjusting to capacity`
        );
        validPlans.push({
          date,
          job_step_id,
          quantity: stepCapacity.units_per_day,
        });
      } else {
        validPlans.push({ date, job_step_id, quantity });
      }

      // Track total per step
      quantityTracker[job_step_id] = (quantityTracker[job_step_id] || 0) + quantity;
    }

    // Log summary
    const totalPlanned = Object.values(quantityTracker).reduce((a, b) => a + b, 0);
    console.log(
      `Gemini planning: Total ${totalPlanned}/${totalQuantity} units planned across ${validPlans.length} planning records`
    );
    
    console.log("\nFinal Planning Pairs:");
    validPlans.slice(0, 5).forEach((p, i) => {
      console.log(`  ${i + 1}. Date: ${p.date}, Step ID: ${p.job_step_id}, Quantity: ${p.quantity}`);
    });
    if (validPlans.length > 5) {
      console.log(`  ... and ${validPlans.length - 5} more`);
    }
    
    console.log("========== GEMINI REQUEST COMPLETE ==========\n");

    return validPlans;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error(`Failed to parse Gemini response as JSON: ${error.message}`);
    }
    throw error;
  }
}

export async function generateBatchAutoPlan(
  jobs: BatchJobPlanningInput[]
): Promise<BatchPlanningPair[]> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not set");
  }

  if (!jobs.length) {
    return [];
  }

  const todayString = formatLocalDate(new Date());

  console.log("\n========== GEMINI BATCH AUTO PLAN REQUEST ==========");
  console.log(`Jobs Count: ${jobs.length}`);
  console.log(`Current Date: ${todayString}`);

  const promptJobs = jobs.map((job) => ({
    job_id: job.job_id,
    job_number: job.job_number,
    due_date: job.due_date,
    total_quantity: job.total_quantity,
    job_steps: job.job_steps
      .filter((step) => step.minutes_per_unit && step.minutes_per_unit > 0 && step.remaining_quantity > 0)
      .map((step) => ({
        job_step_id: step.job_step_id,
        step_name: step.step_name,
        remaining_quantity: step.remaining_quantity,
        units_per_day: Math.floor(step.standard_time / (step.minutes_per_unit || 1)),
      })),
  }));

  const prompt = `You are a production planning AI. Calculate production schedules for multiple manufacturing jobs in one response.

Current Date: ${todayString}

Input Jobs JSON:
${JSON.stringify(promptJobs)}

Requirements:
1. Schedule production only on weekdays (Monday-Friday)
2. Do not schedule any work before ${todayString}
3. Do not schedule any work after each job's due_date
4. Do not exceed units_per_day for any job_step_id on any day
5. Do not exceed remaining_quantity for any job_step_id across all returned rows
6. Only use job_id and job_step_id values that exist in the input JSON
7. Return ONLY a valid JSON array of objects with fields: job_id, date, job_step_id, quantity

Return ONLY valid JSON array format like:
[
  {"job_id": 1, "date": "2026-03-24", "job_step_id": 37, "quantity": 13},
  {"job_id": 1, "date": "2026-03-24", "job_step_id": 38, "quantity": 30}
]

Do not include markdown formatting, code blocks, comments, or explanations.`;

  console.log("\nBatch prompt being sent to Gemini:");
  console.log("---");
  console.log(prompt);
  console.log("---\n");

  const jobMap = new Map(
    jobs.map((job) => {
      const stepMap = new Map(
        job.job_steps
          .filter((step) => step.minutes_per_unit && step.minutes_per_unit > 0)
          .map((step) => [
            step.job_step_id,
            {
              due_date: job.due_date,
              remaining_quantity: step.remaining_quantity,
              units_per_day: Math.floor(step.standard_time / (step.minutes_per_unit || 1)),
            },
          ])
      );

      return [job.job_id, { job_number: job.job_number, due_date: job.due_date, stepMap }];
    })
  );

  try {
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    console.log(`Calling Gemini Batch API at: ${apiUrl.replace(apiKey, "REDACTED")}`);

    const response = await retryFetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      }),
    });

    const result = await response.json();

    console.log("\nGemini Batch API Response Status: SUCCESS");
    console.log("Full Response:");
    console.log(JSON.stringify(result, null, 2));

    if (!result.candidates || !result.candidates[0] || !result.candidates[0].content || !result.candidates[0].content.parts || !result.candidates[0].content.parts[0]) {
      console.log("ERROR: Invalid batch response structure");
      throw new Error("Invalid Gemini API response structure");
    }

    const responseText = result.candidates[0].content.parts[0].text;
    console.log("\nExtracted Batch Response Text:");
    console.log(responseText);

    let jsonString = responseText;
    const jsonMatch = responseText.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      jsonString = jsonMatch[0];
      console.log("\nExtracted JSON array from batch response");
    } else {
      console.log("\nNo JSON array found in batch response, using full text as JSON");
    }

    console.log("Batch JSON String length:", jsonString.length);
    console.log("Batch JSON String Content:");
    console.log(jsonString);

    const plannedSchedule = JSON.parse(jsonString);
    console.log(`Parsed batch JSON successfully. Array length: ${plannedSchedule.length}`);
    console.log("Parsed Batch Schedule Data:");
    console.log(JSON.stringify(plannedSchedule, null, 2));

    if (!Array.isArray(plannedSchedule)) {
      throw new Error("Response is not an array");
    }

    const validPlans: BatchPlanningPair[] = [];
    const quantityTracker: Record<string, number> = {};

    for (const plan of plannedSchedule) {
      const { job_id, date, job_step_id, quantity } = plan;

      if (!Number.isInteger(job_id)) {
        console.warn(`Invalid job_id: ${job_id}, skipping`);
        continue;
      }

      const jobData = jobMap.get(job_id);
      if (!jobData) {
        console.warn(`Job ${job_id} not found in batch input, skipping`);
        continue;
      }

      if (!date || typeof date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        console.warn(`Invalid date format: ${date}, skipping`);
        continue;
      }

      if (date < todayString) {
        console.warn(`Plan date ${date} is before current date ${todayString}, skipping`);
        continue;
      }

      if (date > jobData.due_date) {
        console.warn(`Plan date ${date} is after due date ${jobData.due_date} for job ${jobData.job_number}, skipping`);
        continue;
      }

      if (!Number.isInteger(job_step_id)) {
        console.warn(`Invalid job_step_id: ${job_step_id}, skipping`);
        continue;
      }

      if (!Number.isInteger(quantity) || quantity <= 0) {
        console.warn(`Invalid quantity: ${quantity} for step ${job_step_id}, skipping`);
        continue;
      }

      const stepData = jobData.stepMap.get(job_step_id);
      if (!stepData) {
        console.warn(`Step ${job_step_id} not found for job ${job_id}, skipping`);
        continue;
      }

      const quantityKey = `${job_id}:${job_step_id}`;
      const currentAllocated = quantityTracker[quantityKey] || 0;
      const remainingAllowed = Math.max(0, stepData.remaining_quantity - currentAllocated);
      if (remainingAllowed <= 0) {
        console.warn(`No remaining quantity left for job ${job_id} step ${job_step_id}, skipping`);
        continue;
      }

      const adjustedQuantity = Math.min(quantity, stepData.units_per_day, remainingAllowed);
      if (adjustedQuantity !== quantity) {
        console.warn(
          `Adjusting quantity from ${quantity} to ${adjustedQuantity} for job ${job_id} step ${job_step_id} on ${date}`
        );
      }

      validPlans.push({
        job_id,
        date,
        job_step_id,
        quantity: adjustedQuantity,
      });
      quantityTracker[quantityKey] = currentAllocated + adjustedQuantity;
    }

    const totalPlanned = validPlans.reduce((sum, plan) => sum + plan.quantity, 0);
    console.log(
      `Gemini batch planning: Total ${totalPlanned} units planned across ${validPlans.length} planning records`
    );

    console.log("\nFinal Batch Planning Pairs:");
    validPlans.slice(0, 10).forEach((plan, index) => {
      console.log(
        `  ${index + 1}. Job ID: ${plan.job_id}, Date: ${plan.date}, Step ID: ${plan.job_step_id}, Quantity: ${plan.quantity}`
      );
    });
    if (validPlans.length > 10) {
      console.log(`  ... and ${validPlans.length - 10} more`);
    }

    console.log("========== GEMINI BATCH REQUEST COMPLETE ==========\n");

    return validPlans;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error(`Failed to parse Gemini response as JSON: ${error.message}`);
    }
    throw error;
  }
}
