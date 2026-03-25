export interface JobStepWithCapacity {
  job_step_id: number;
  step_id: number;
  step_name: string;
  minutes_per_unit: number | null;
  standard_time: number; // minutes available per day
}

type ExistingStepMinutesByDate = Record<string, number>;

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

type AiProvider = "gemini" | "groq";

function formatLocalDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseLocalDate(dateString: string): Date {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function isWeekday(dateString: string): boolean {
  const day = parseLocalDate(dateString).getDay();
  return day !== 0 && day !== 6;
}

function getWeekdayDateStrings(startDate: string, endDate: string): string[] {
  const dates: string[] = [];
  const current = parseLocalDate(startDate);
  const end = parseLocalDate(endDate);

  while (current <= end) {
    const currentString = formatLocalDate(current);
    if (isWeekday(currentString)) {
      dates.push(currentString);
    }

    current.setDate(current.getDate() + 1);
  }

  return dates;
}

// Helper function: Sleep for milliseconds
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function createNonRetryableError(message: string): Error {
  const error = new Error(message);
  error.name = "AiNonRetryableError";
  return error;
}

function isNonRetryableError(error: unknown): boolean {
  return error instanceof Error && error.name === "AiNonRetryableError";
}

function getAiProvider(): AiProvider {
  const configuredProvider = process.env.AI_PROVIDER?.trim().toLowerCase();

  if (configuredProvider === "gemini" || configuredProvider === "groq") {
    return configuredProvider;
  }

  if (configuredProvider) {
    throw new Error("AI_PROVIDER environment variable is invalid. Use 'gemini' or 'groq'.");
  }

  if (process.env.GROQ_API_KEY) {
    return "groq";
  }

  return "gemini";
}

function getProviderDisplayName(provider: AiProvider): string {
  return provider === "groq" ? "Groq" : "Gemini";
}

function getApiKeyForProvider(provider: AiProvider): string {
  if (provider === "groq") {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new Error("GROQ_API_KEY environment variable is not set");
    }
    return apiKey;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not set");
  }

  return apiKey;
}

function extractRetryDelaySeconds(errorData: any, provider: AiProvider): number {
  const retryAfter = provider === "gemini"
    ? (Array.isArray(errorData?.error?.details)
        ? errorData.error.details.find((detail: any) => detail?.retryDelay)?.retryDelay
        : undefined)
    : (errorData?.error?.retry_after || errorData?.error?.retryAfter || errorData?.retry_after);
  const message = String(errorData?.error?.message || errorData?.message || "");

  let waitSeconds = 32;
  if (typeof retryAfter === "string") {
    const match = retryAfter.match(/(\d+)/);
    if (match) {
      waitSeconds = parseInt(match[1], 10) + 2;
    }
  } else {
    const match = message.match(/(?:retry|try again)\D+(\d+)/i);
    if (match) {
      waitSeconds = parseInt(match[1], 10) + 2;
    }
  }

  return waitSeconds;
}

function isPermanentQuotaExhaustion(errorData: any, provider: AiProvider): boolean {
  const message = String(errorData?.error?.message || errorData?.message || "");

  if (provider === "groq") {
    return /limit:\s*0\b/i.test(message);
  }

  const violations = Array.isArray(errorData?.error?.details)
    ? errorData.error.details.flatMap((detail: any) =>
        Array.isArray(detail?.violations) ? detail.violations : []
      )
    : [];

  return (
    errorData?.error?.status === "RESOURCE_EXHAUSTED" &&
    (
      /limit:\s*0\b/i.test(message) ||
      violations.some((violation: any) =>
        String(violation?.quotaId || "").includes("PerDay")
      )
    )
  );
}

async function readErrorResponse(response: Response): Promise<any> {
  const responseText = await response.text();

  try {
    return JSON.parse(responseText);
  } catch {
    return { message: responseText };
  }
}

function sanitizeJsonCandidate(jsonText: string): string {
  return jsonText
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/,\s*([}\]])/g, "$1");
}

function extractJsonArrayCandidate(responseText: string): string {
  const normalized = sanitizeJsonCandidate(responseText);
  const arrayStart = normalized.indexOf("[");

  if (arrayStart === -1) {
    return normalized;
  }

  const arrayEnd = normalized.lastIndexOf("]");
  if (arrayEnd === -1 || arrayEnd < arrayStart) {
    return normalized.slice(arrayStart);
  }

  return normalized.slice(arrayStart, arrayEnd + 1);
}

function recoverParsableObjects<T>(jsonCandidate: string): T[] {
  const recovered: T[] = [];
  const normalized = sanitizeJsonCandidate(jsonCandidate);
  const arrayStart = normalized.indexOf("[");
  let inString = false;
  let isEscaped = false;
  let braceDepth = 0;
  let objectStart = -1;

  for (let index = arrayStart >= 0 ? arrayStart : 0; index < normalized.length; index += 1) {
    const char = normalized[index];

    if (isEscaped) {
      isEscaped = false;
      continue;
    }

    if (char === "\\" && inString) {
      isEscaped = true;
      continue;
    }

    if (char === '"') {
      inString = !inString;
      continue;
    }

    if (inString) {
      continue;
    }

    if (char === "{") {
      if (braceDepth === 0) {
        objectStart = index;
      }
      braceDepth += 1;
      continue;
    }

    if (char === "}" && braceDepth > 0) {
      braceDepth -= 1;
      if (braceDepth === 0 && objectStart >= 0) {
        const objectText = normalized.slice(objectStart, index + 1);
        try {
          recovered.push(JSON.parse(sanitizeJsonCandidate(objectText)) as T);
        } catch {
          // Ignore broken fragments and keep scanning for the next complete object.
        }
        objectStart = -1;
      }
    }
  }

  return recovered;
}

function parseAiJsonArray<T>(responseText: string, contextLabel: string): T[] {
  const jsonCandidate = extractJsonArrayCandidate(responseText);

  try {
    const parsed = JSON.parse(jsonCandidate) as T[];
    if (!Array.isArray(parsed)) {
      throw new Error("Response is not an array");
    }
    return parsed;
  } catch (error) {
    const recovered = recoverParsableObjects<T>(jsonCandidate);
    if (recovered.length > 0) {
      console.warn(
        `${contextLabel}: Recovered ${recovered.length} complete object(s) from malformed AI JSON response.`
      );
      return recovered;
    }

    throw error;
  }
}

// Helper function: Retry API call with exponential backoff
async function retryFetch(
  url: string,
  options: RequestInit,
  maxRetries: number = 3,
  provider: AiProvider = "gemini"
): Promise<Response> {
  let lastError: any = null;
  const providerName = getProviderDisplayName(provider);

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);

      // Handle 429 specifically - wait and retry
      if (response.status === 429) {
        const errorData = await readErrorResponse(response);
        if (isPermanentQuotaExhaustion(errorData, provider)) {
          throw createNonRetryableError(
            `${providerName} API quota exhausted: ${JSON.stringify(errorData)}`
          );
        }

        const waitSeconds = extractRetryDelaySeconds(errorData, provider);

        console.log(`[${providerName} Attempt ${attempt + 1}/${maxRetries + 1}] Rate limited. Waiting ${waitSeconds}s before retry...`);

        if (attempt < maxRetries) {
          await sleep(waitSeconds * 1000);
          continue; // Retry
        } else {
          throw new Error(`${providerName} API Rate Limited: ${JSON.stringify(errorData)}`);
        }
      }

      // For other errors, retry with exponential backoff
      if (!response.ok) {
        const errorData = await readErrorResponse(response);
        const errorMessage = `${providerName} API Error: ${response.status} ${JSON.stringify(errorData)}`;

        if (
          response.status === 401 ||
          response.status === 403 ||
          (response.status === 400 && (
            errorMessage.includes("API_KEY_INVALID") ||
            errorMessage.includes("API key expired")
          )) ||
          (provider === "groq" && errorMessage.toLowerCase().includes("invalid_api_key"))
        ) {
          throw createNonRetryableError(errorMessage);
        }

        if (provider === "groq" && errorMessage.toLowerCase().includes("insufficient_quota")) {
          throw createNonRetryableError(`${providerName} API quota exhausted: ${JSON.stringify(errorData)}`);
        }

        lastError = new Error(errorMessage);
        
        console.log(`[${providerName} Attempt ${attempt + 1}/${maxRetries + 1}] API returned ${response.status}. ${attempt < maxRetries ? 'Retrying...' : 'Max retries reached.'}`);
        
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

      if (isNonRetryableError(error)) {
        throw error;
      }
      
      if (attempt < maxRetries) {
        const waitMs = Math.pow(2, attempt) * 1000;
        console.log(`[${providerName} Attempt ${attempt + 1}/${maxRetries + 1}] Error occurred. Waiting ${waitMs}ms before retry...`);
        await sleep(waitMs);
        continue;
      } else {
        throw error;
      }
    }
  }

  throw lastError || new Error("Unknown error in retryFetch");
}

async function callAiTextResponse(
  provider: AiProvider,
  prompt: string,
  requestLabel: string
): Promise<string> {
  const providerName = getProviderDisplayName(provider);
  const apiKey = getApiKeyForProvider(provider);

  if (provider === "groq") {
    const apiUrl = "https://api.groq.com/openai/v1/chat/completions";
    console.log(`Calling ${providerName} API at: ${apiUrl}`);

    const response = await retryFetch(
      apiUrl,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: process.env.GROQ_MODEL || "llama-3.1-8b-instant",
          temperature: 0.2,
          messages: [
            {
              role: "system",
              content: "You are a production planning AI. Return only valid JSON. No markdown, no explanations, no commentary.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
        }),
      },
      3,
      provider
    );

    const result = await response.json();
    console.log(`\n${providerName} API Response Status: SUCCESS (${requestLabel})`);
    console.log("Full Response:");
    console.log(JSON.stringify(result, null, 2));

    const responseText = result?.choices?.[0]?.message?.content;
    if (!responseText || typeof responseText !== "string") {
      console.log(`ERROR: Invalid ${providerName} response structure`);
      throw new Error(`Invalid ${providerName} API response structure`);
    }

    return responseText;
  }

  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
  console.log(`Calling ${providerName} API at: ${apiUrl.replace(apiKey, "REDACTED")}`);

  const response = await retryFetch(
    apiUrl,
    {
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
    },
    3,
    provider
  );

  const result = await response.json();
  console.log(`\n${providerName} API Response Status: SUCCESS (${requestLabel})`);
  console.log("Full Response:");
  console.log(JSON.stringify(result, null, 2));

  const responseText = result?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!responseText || typeof responseText !== "string") {
    console.log(`ERROR: Invalid ${providerName} response structure`);
    throw new Error(`Invalid ${providerName} API response structure`);
  }

  return responseText;
}

function mergePlanningPairs(plans: PlanningPair[]): PlanningPair[] {
  const merged = new Map<string, PlanningPair>();

  for (const plan of plans) {
    const key = `${plan.job_step_id}:${plan.date}`;
    const existing = merged.get(key);

    if (existing) {
      existing.quantity += plan.quantity;
    } else {
      merged.set(key, { ...plan });
    }
  }

  return [...merged.values()].sort((a, b) => {
    if (a.date !== b.date) {
      return a.date.localeCompare(b.date);
    }
    return a.job_step_id - b.job_step_id;
  });
}

function mergeBatchPlanningPairs(plans: BatchPlanningPair[]): BatchPlanningPair[] {
  const merged = new Map<string, BatchPlanningPair>();

  for (const plan of plans) {
    const key = `${plan.job_id}:${plan.job_step_id}:${plan.date}`;
    const existing = merged.get(key);

    if (existing) {
      existing.quantity += plan.quantity;
    } else {
      merged.set(key, { ...plan });
    }
  }

  return [...merged.values()].sort((a, b) => {
    if (a.date !== b.date) {
      return a.date.localeCompare(b.date);
    }
    if (a.job_id !== b.job_id) {
      return a.job_id - b.job_id;
    }
    return a.job_step_id - b.job_step_id;
  });
}

function getUsedMinutesForStepOnDate(
  usageMap: Map<string, number>,
  stepId: number,
  date: string
): number {
  return usageMap.get(`${stepId}:${date}`) || 0;
}

function getAvailableUnitsForDate(
  step: {
    step_id: number;
    minutes_per_unit: number;
    standard_time: number;
  },
  date: string,
  usageMap: Map<string, number>
): number {
  const usedMinutes = getUsedMinutesForStepOnDate(usageMap, step.step_id, date);
  const remainingMinutes = Math.max(0, step.standard_time - usedMinutes);
  return Math.floor(remainingMinutes / step.minutes_per_unit);
}

function addStepMinutesUsage(
  usageMap: Map<string, number>,
  stepId: number,
  date: string,
  minutesToAdd: number
): void {
  const key = `${stepId}:${date}`;
  usageMap.set(key, (usageMap.get(key) || 0) + minutesToAdd);
}

function rebalanceSingleStepSingletonDays(
  allocationMap: Map<string, number>,
  usedMinutesMap: Map<string, number>,
  stepCapacities: Array<{
    job_step_id: number;
    step_id: number;
    step_name: string;
    minutes_per_unit: number;
    standard_time: number;
    remaining_quantity: number;
  }>,
  productionDates: string[]
): void {
  for (const step of stepCapacities) {
    for (const sourceDate of productionDates) {
      const sourceKey = `${step.job_step_id}:${sourceDate}`;
      const sourceQuantity = allocationMap.get(sourceKey) || 0;

      if (sourceQuantity !== 1) {
        continue;
      }

      const targetDates = productionDates
        .filter((date) => {
          if (date === sourceDate) {
            return false;
          }

          return (allocationMap.get(`${step.job_step_id}:${date}`) || 0) > 0;
        })
        .sort((left, right) => {
          const leftQuantity = allocationMap.get(`${step.job_step_id}:${left}`) || 0;
          const rightQuantity = allocationMap.get(`${step.job_step_id}:${right}`) || 0;

          if (leftQuantity !== rightQuantity) {
            return rightQuantity - leftQuantity;
          }

          return Math.abs(parseLocalDate(left).getTime() - parseLocalDate(sourceDate).getTime()) -
            Math.abs(parseLocalDate(right).getTime() - parseLocalDate(sourceDate).getTime());
        });

      for (const targetDate of targetDates) {
        const availableUnits = getAvailableUnitsForDate(step, targetDate, usedMinutesMap);
        if (availableUnits <= 0) {
          continue;
        }

        const targetKey = `${step.job_step_id}:${targetDate}`;
        allocationMap.delete(sourceKey);
        allocationMap.set(targetKey, (allocationMap.get(targetKey) || 0) + 1);
        addStepMinutesUsage(usedMinutesMap, step.step_id, sourceDate, -step.minutes_per_unit);
        addStepMinutesUsage(usedMinutesMap, step.step_id, targetDate, step.minutes_per_unit);

        console.log(
          `[AUTO-PLAN DEBUG] Step ${step.step_name}: moved 1 unit from ${sourceDate} to ${targetDate} to avoid a singleton production day`
        );
        break;
      }
    }
  }
}

function rebalanceBatchStepSingletonDays(
  allocationMap: Map<string, number>,
  usedMinutesMap: Map<string, number>,
  jobs: BatchJobPlanningInput[],
  todayString: string
): void {
  for (const job of jobs) {
    const productionDates = getWeekdayDateStrings(todayString, job.due_date);

    for (const step of job.job_steps.filter((item) => item.minutes_per_unit && item.minutes_per_unit > 0)) {
      const normalizedStep = {
        ...step,
        minutes_per_unit: step.minutes_per_unit as number,
      };

      for (const sourceDate of productionDates) {
        const sourceKey = `${job.job_id}:${step.job_step_id}:${sourceDate}`;
        const sourceQuantity = allocationMap.get(sourceKey) || 0;

        if (sourceQuantity !== 1) {
          continue;
        }

        const targetDates = productionDates
          .filter((date) => {
            if (date === sourceDate) {
              return false;
            }

            return (allocationMap.get(`${job.job_id}:${step.job_step_id}:${date}`) || 0) > 0;
          })
          .sort((left, right) => {
            const leftQuantity = allocationMap.get(`${job.job_id}:${step.job_step_id}:${left}`) || 0;
            const rightQuantity = allocationMap.get(`${job.job_id}:${step.job_step_id}:${right}`) || 0;

            if (leftQuantity !== rightQuantity) {
              return rightQuantity - leftQuantity;
            }

            return Math.abs(parseLocalDate(left).getTime() - parseLocalDate(sourceDate).getTime()) -
              Math.abs(parseLocalDate(right).getTime() - parseLocalDate(sourceDate).getTime());
          });

        for (const targetDate of targetDates) {
          const availableUnits = getAvailableUnitsForDate(normalizedStep, targetDate, usedMinutesMap);
          if (availableUnits <= 0) {
            continue;
          }

          const targetKey = `${job.job_id}:${step.job_step_id}:${targetDate}`;
          allocationMap.delete(sourceKey);
          allocationMap.set(targetKey, (allocationMap.get(targetKey) || 0) + 1);
          addStepMinutesUsage(usedMinutesMap, step.step_id, sourceDate, -normalizedStep.minutes_per_unit);
          addStepMinutesUsage(usedMinutesMap, step.step_id, targetDate, normalizedStep.minutes_per_unit);

          console.log(
            `[AUTO-PLAN BATCH DEBUG] Job ${job.job_number} step ${step.step_name}: moved 1 unit from ${sourceDate} to ${targetDate} to avoid a singleton production day`
          );
          break;
        }
      }
    }
  }
}

function ensureSingleStepCoverage(
  plans: PlanningPair[],
  stepCapacities: Array<{
    job_step_id: number;
    step_id: number;
    step_name: string;
    minutes_per_unit: number;
    standard_time: number;
    remaining_quantity: number;
  }>,
  todayString: string,
  dueDate: string,
  existingStepMinutesByDate: ExistingStepMinutesByDate
): PlanningPair[] {
  const mergedPlans = mergePlanningPairs(plans);
  const allocationMap = new Map<string, number>();
  const usedMinutesMap = new Map<string, number>(Object.entries(existingStepMinutesByDate));
  const stepByJobStepId = new Map(stepCapacities.map((step) => [step.job_step_id, step]));
  const allocatedByJobStep = new Map<number, number>();

  for (const plan of mergedPlans) {
    const step = stepByJobStepId.get(plan.job_step_id);
    if (!step) {
      continue;
    }

    const availableUnits = getAvailableUnitsForDate(step, plan.date, usedMinutesMap);
    const alreadyAllocated = allocatedByJobStep.get(plan.job_step_id) || 0;
    const remainingAllowed = Math.max(0, step.remaining_quantity - alreadyAllocated);
    const adjustedQuantity = Math.min(plan.quantity, availableUnits, remainingAllowed);

    if (adjustedQuantity <= 0) {
      console.log(
        `[AUTO-PLAN DEBUG] Step ${step.step_name} ${plan.date}: AI allocation skipped because no shared capacity remains (${getUsedMinutesForStepOnDate(usedMinutesMap, step.step_id, plan.date)}/${step.standard_time} min already used)`
      );
      continue;
    }

    if (adjustedQuantity !== plan.quantity) {
      console.log(
        `[AUTO-PLAN DEBUG] Step ${step.step_name} ${plan.date}: AI allocation adjusted from ${plan.quantity} to ${adjustedQuantity} due to remaining shared capacity`
      );
    }

    allocationMap.set(`${plan.job_step_id}:${plan.date}`, adjustedQuantity);
    allocatedByJobStep.set(plan.job_step_id, alreadyAllocated + adjustedQuantity);
    addStepMinutesUsage(usedMinutesMap, step.step_id, plan.date, adjustedQuantity * step.minutes_per_unit);
  }

  const productionDates = getWeekdayDateStrings(todayString, dueDate);

  console.log("[AUTO-PLAN DEBUG] Working dates considered:", productionDates.join(", "));

  for (const step of stepCapacities) {
    const maxPossibleBeforeDueDate = productionDates.reduce(
      (sum, date) => sum + getAvailableUnitsForDate(step, date, usedMinutesMap),
      0
    ) + (allocatedByJobStep.get(step.job_step_id) || 0);
    console.log(
      `[AUTO-PLAN DEBUG] Step ${step.step_name} (${step.job_step_id}) capacity: ${step.standard_time} min/day, ${step.minutes_per_unit} min/unit, max ${maxPossibleBeforeDueDate} units before ${dueDate}`
    );

    const initialAllocations = productionDates.map((date) => ({
      date,
      quantity: allocationMap.get(`${step.job_step_id}:${date}`) || 0,
    }));
    console.log(
      `[AUTO-PLAN DEBUG] Step ${step.step_name} initial allocations: ${initialAllocations
        .map((entry) => `${entry.date}=${entry.quantity}`)
        .join(", ")}`
    );

    const allocated = allocatedByJobStep.get(step.job_step_id) || 0;

    let remaining = step.remaining_quantity - allocated;
    console.log(
      `[AUTO-PLAN DEBUG] Step ${step.step_name} allocated ${allocated}/${step.remaining_quantity}, remaining ${remaining}`
    );

    for (const date of productionDates) {
      if (remaining <= 0) {
        break;
      }

      const key = `${step.job_step_id}:${date}`;
      const usedMinutes = getUsedMinutesForStepOnDate(usedMinutesMap, step.step_id, date);
      const availableCapacity = getAvailableUnitsForDate(step, date, usedMinutesMap);
      if (availableCapacity <= 0) {
        console.log(
          `[AUTO-PLAN DEBUG] Step ${step.step_name} ${date}: no free shared capacity left (${usedMinutes}/${step.standard_time} min used)`
        );
        continue;
      }

      const addedQuantity = Math.min(remaining, availableCapacity);
      const currentQuantity = allocationMap.get(key) || 0;
      allocationMap.set(key, currentQuantity + addedQuantity);
      addStepMinutesUsage(usedMinutesMap, step.step_id, date, addedQuantity * step.minutes_per_unit);
      allocatedByJobStep.set(step.job_step_id, (allocatedByJobStep.get(step.job_step_id) || 0) + addedQuantity);
      remaining -= addedQuantity;
      console.log(
        `[AUTO-PLAN DEBUG] Step ${step.step_name} ${date}: added ${addedQuantity}, day total ${currentQuantity + addedQuantity}, remaining ${remaining}`
      );
    }

    const finalAllocations = productionDates.map((date) => ({
      date,
      quantity: allocationMap.get(`${step.job_step_id}:${date}`) || 0,
    }));
    console.log(
      `[AUTO-PLAN DEBUG] Step ${step.step_name} final allocations: ${finalAllocations
        .map((entry) => `${entry.date}=${entry.quantity}`)
        .join(", ")}`
    );

    if (remaining > 0) {
      throw new Error(
        `Unable to create a complete plan for step ${step.step_name}. Missing ${remaining} units before due date ${dueDate}. Shared step capacity is already partly used on those days, and the maximum possible before due date is ${maxPossibleBeforeDueDate} units.`
      );
    }
  }

  rebalanceSingleStepSingletonDays(allocationMap, usedMinutesMap, stepCapacities, productionDates);

  return [...allocationMap.entries()]
    .filter(([, quantity]) => quantity > 0)
    .map(([key, quantity]) => {
      const [jobStepId, date] = key.split(":");
      return {
        job_step_id: Number(jobStepId),
        date,
        quantity,
      };
    })
    .sort((a, b) => {
      if (a.date !== b.date) {
        return a.date.localeCompare(b.date);
      }
      return a.job_step_id - b.job_step_id;
    });
}

function ensureBatchStepCoverage(
  plans: BatchPlanningPair[],
  jobs: BatchJobPlanningInput[],
  todayString: string,
  existingStepMinutesByDate: ExistingStepMinutesByDate
): BatchPlanningPair[] {
  const mergedPlans = mergeBatchPlanningPairs(plans);
  const allocationMap = new Map<string, number>();
  const usedMinutesMap = new Map<string, number>(Object.entries(existingStepMinutesByDate));
  const allocatedByJobStep = new Map<string, number>();

  const stepMap = new Map(
    jobs.flatMap((job) =>
      job.job_steps.map((step) => [
        `${job.job_id}:${step.job_step_id}`,
        {
          job_id: job.job_id,
          job_number: job.job_number,
          due_date: job.due_date,
          ...step,
        },
      ])
    )
  );

  for (const plan of mergedPlans) {
    const step = stepMap.get(`${plan.job_id}:${plan.job_step_id}`);
    if (!step || !step.minutes_per_unit || step.minutes_per_unit <= 0) {
      continue;
    }

    const normalizedStep = {
      ...step,
      minutes_per_unit: step.minutes_per_unit,
    };

    const allocationKey = `${plan.job_id}:${plan.job_step_id}:${plan.date}`;
    const availableUnits = getAvailableUnitsForDate(normalizedStep, plan.date, usedMinutesMap);
    const allocatedForStep = allocatedByJobStep.get(`${plan.job_id}:${plan.job_step_id}`) || 0;
    const remainingAllowed = Math.max(0, normalizedStep.remaining_quantity - allocatedForStep);
    const adjustedQuantity = Math.min(plan.quantity, availableUnits, remainingAllowed);

    if (adjustedQuantity <= 0) {
      console.log(
        `[AUTO-PLAN BATCH DEBUG] Job ${normalizedStep.job_number} step ${normalizedStep.step_name} ${plan.date}: AI allocation skipped because no shared capacity remains (${getUsedMinutesForStepOnDate(usedMinutesMap, normalizedStep.step_id, plan.date)}/${normalizedStep.standard_time} min already used)`
      );
      continue;
    }

    if (adjustedQuantity !== plan.quantity) {
      console.log(
        `[AUTO-PLAN BATCH DEBUG] Job ${normalizedStep.job_number} step ${normalizedStep.step_name} ${plan.date}: AI allocation adjusted from ${plan.quantity} to ${adjustedQuantity} due to shared capacity`
      );
    }

    allocationMap.set(allocationKey, adjustedQuantity);
    allocatedByJobStep.set(`${plan.job_id}:${plan.job_step_id}`, allocatedForStep + adjustedQuantity);
    addStepMinutesUsage(usedMinutesMap, normalizedStep.step_id, plan.date, adjustedQuantity * normalizedStep.minutes_per_unit);
  }

  for (const job of jobs) {
    const productionDates = getWeekdayDateStrings(todayString, job.due_date);
    console.log(
      `[AUTO-PLAN BATCH DEBUG] Job ${job.job_number} working dates considered: ${productionDates.join(", ")}`
    );

    for (const step of job.job_steps.filter((item) => item.minutes_per_unit && item.minutes_per_unit > 0)) {
      const unitsPerDay = Math.floor(step.standard_time / (step.minutes_per_unit || 1));
      const stepAllocationKey = `${job.job_id}:${step.job_step_id}`;
      const maxPossibleBeforeDueDate = productionDates.reduce(
        (sum, date) => sum + getAvailableUnitsForDate(step as typeof step & { minutes_per_unit: number }, date, usedMinutesMap),
        0
      ) + (allocatedByJobStep.get(stepAllocationKey) || 0);
      console.log(
        `[AUTO-PLAN BATCH DEBUG] Job ${job.job_number} step ${step.step_name} (${step.job_step_id}) capacity: ${step.standard_time} min/day, ${step.minutes_per_unit} min/unit, max ${maxPossibleBeforeDueDate} units before ${job.due_date}`
      );

      const initialAllocations = productionDates.map((date) => ({
        date,
        quantity: allocationMap.get(`${job.job_id}:${step.job_step_id}:${date}`) || 0,
      }));
      console.log(
        `[AUTO-PLAN BATCH DEBUG] Job ${job.job_number} step ${step.step_name} initial allocations: ${initialAllocations
          .map((entry) => `${entry.date}=${entry.quantity}`)
          .join(", ")}`
      );

      const allocated = allocatedByJobStep.get(stepAllocationKey) || 0;

      let remaining = step.remaining_quantity - allocated;
      console.log(
        `[AUTO-PLAN BATCH DEBUG] Job ${job.job_number} step ${step.step_name} allocated ${allocated}/${step.remaining_quantity}, remaining ${remaining}`
      );

      for (const date of productionDates) {
        if (remaining <= 0) {
          break;
        }

        const key = `${job.job_id}:${step.job_step_id}:${date}`;
        const usedMinutes = getUsedMinutesForStepOnDate(usedMinutesMap, step.step_id, date);
        const availableCapacity = getAvailableUnitsForDate(step as typeof step & { minutes_per_unit: number }, date, usedMinutesMap);
        if (availableCapacity <= 0) {
          console.log(
            `[AUTO-PLAN BATCH DEBUG] Job ${job.job_number} step ${step.step_name} ${date}: no free shared capacity left (${usedMinutes}/${step.standard_time} min used)`
          );
          continue;
        }

        const addedQuantity = Math.min(remaining, availableCapacity);
        const currentQuantity = allocationMap.get(key) || 0;
        allocationMap.set(key, currentQuantity + addedQuantity);
        addStepMinutesUsage(usedMinutesMap, step.step_id, date, addedQuantity * (step.minutes_per_unit || 0));
        allocatedByJobStep.set(stepAllocationKey, (allocatedByJobStep.get(stepAllocationKey) || 0) + addedQuantity);
        remaining -= addedQuantity;
        console.log(
          `[AUTO-PLAN BATCH DEBUG] Job ${job.job_number} step ${step.step_name} ${date}: added ${addedQuantity}, day total ${currentQuantity + addedQuantity}, remaining ${remaining}`
        );
      }

      const finalAllocations = productionDates.map((date) => ({
        date,
        quantity: allocationMap.get(`${job.job_id}:${step.job_step_id}:${date}`) || 0,
      }));
      console.log(
        `[AUTO-PLAN BATCH DEBUG] Job ${job.job_number} step ${step.step_name} final allocations: ${finalAllocations
          .map((entry) => `${entry.date}=${entry.quantity}`)
          .join(", ")}`
      );

      if (remaining > 0) {
        throw new Error(
          `Unable to create a complete plan for job ${job.job_number} step ${step.step_name}. Missing ${remaining} units before due date ${job.due_date}. Shared step capacity is already partly used on those days, and the maximum possible before due date is ${maxPossibleBeforeDueDate} units.`
        );
      }
    }
  }

  rebalanceBatchStepSingletonDays(allocationMap, usedMinutesMap, jobs, todayString);

  return [...allocationMap.entries()]
    .filter(([, quantity]) => quantity > 0)
    .map(([key, quantity]) => {
      const [jobId, jobStepId, date] = key.split(":");
      return {
        job_id: Number(jobId),
        job_step_id: Number(jobStepId),
        date,
        quantity,
      };
    })
    .sort((a, b) => {
      if (a.date !== b.date) {
        return a.date.localeCompare(b.date);
      }
      if (a.job_id !== b.job_id) {
        return a.job_id - b.job_id;
      }
      return a.job_step_id - b.job_step_id;
    });
}

export async function generateAutoPlan(
  jobNumber: string,
  dueDate: string,
  jobSteps: JobStepWithRemaining[],
  existingStepMinutesByDate: ExistingStepMinutesByDate = {}
): Promise<PlanningPair[]> {
  const provider = getAiProvider();
  const providerName = getProviderDisplayName(provider);
  getApiKeyForProvider(provider);

  const todayString = formatLocalDate(new Date());

  console.log(`\n========== ${providerName.toUpperCase()} AUTO PLAN REQUEST ==========`);
  console.log(`Job Number: ${jobNumber}`);
  console.log(`Due Date: ${dueDate}`);
  console.log(`Current Date: ${todayString}`);
  console.log(`Job Steps Count: ${jobSteps.length}`);
  console.log("Job Steps Data:");
  jobSteps.forEach(s => {
    console.log(`  - Step ID ${s.job_step_id}: ${s.step_name} (${s.minutes_per_unit} min/unit, ${s.standard_time} min/day, remaining ${s.remaining_quantity})`);
  });

  // Calculate capacity for each step
  const stepCapacities = jobSteps
    .filter((s) => s.minutes_per_unit && s.minutes_per_unit > 0)
    .map((s) => {
      const minutesPerUnit = s.minutes_per_unit as number;
      return {
        job_step_id: s.job_step_id,
        step_id: s.step_id,
        step_name: s.step_name,
        minutes_per_unit: minutesPerUnit,
        standard_time: s.standard_time,
        remaining_quantity: s.remaining_quantity,
        units_per_day: Math.floor(s.standard_time / minutesPerUnit),
      };
    });

  if (stepCapacities.length === 0) {
    throw new Error(
      "No job steps with minutes_per_unit configured found"
    );
  }

  // Build detailed prompt for AI provider
  const stepDetails = stepCapacities
    .map(
      (s) =>
        `- Job Step ID ${s.job_step_id} (${s.step_name}): Can produce max ${s.units_per_day} units/day (${s.standard_time} min available ÷ ${s.minutes_per_unit} min/unit)`
    )
    .join("\n");

  const prompt = `You are a production planning AI. Calculate an optimal production schedule for a manufacturing job.

Job Details:
- Job Number: ${jobNumber}
- Current Date: ${todayString}
- Due Date: ${dueDate}
- Production Steps with Daily Capacities:
${stepDetails}

Requirements:
1. Schedule production only on weekdays (Monday-Friday)
2. Do not schedule any work before the current date (${todayString})
3. Do not exceed the daily capacity for each step
4. Each job_step_id must complete its own remaining_quantity by the due date
5. Distribute work evenly across steps where possible
6. Prefer consolidated batches on fewer production days when capacity allows
7. Avoid returning quantity 1 for a day unless it is unavoidable because of due date or remaining capacity
8. Return a JSON array with objects containing: date (YYYY-MM-DD), job_step_id, quantity

Production Start: Start on or after ${todayString}. Never use dates before ${todayString}.

Return ONLY valid JSON array format like:
[
  {"date": "2026-03-24", "job_step_id": 1, "quantity": 100},
  {"date": "2026-03-25", "job_step_id": 1, "quantity": 100}
]

Do not include any markdown formatting, code blocks, or explanations. Just the JSON array.`;

  console.log(`\nPrompt being sent to ${providerName}:`);
  console.log("---");
  console.log(prompt);
  console.log("---\n");

  try {
    const responseText = await callAiTextResponse(provider, prompt, "single auto-plan");
    console.log("\nExtracted Response Text:");
    console.log(responseText);

    const jsonString = extractJsonArrayCandidate(responseText);
    console.log(jsonString !== sanitizeJsonCandidate(responseText)
      ? "\nExtracted JSON array from response"
      : "\nNo complete JSON array wrapper found, using normalized response text");
    console.log("JSON String length:", jsonString.length);
    console.log("JSON String Content:");
    console.log(jsonString);

    const plannedSchedule = parseAiJsonArray<PlanningPair>(responseText, `${providerName} single auto-plan`);
    console.log(`Parsed JSON successfully. Array length: ${plannedSchedule.length}`);
    console.log("Parsed Schedule Data:");
    console.log(JSON.stringify(plannedSchedule, null, 2));

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

      if (date > dueDate) {
        console.warn(`Plan date ${date} is after due date ${dueDate}, skipping`);
        continue;
      }

      if (!isWeekday(date)) {
        console.warn(`Plan date ${date} is not a weekday, skipping`);
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

      const currentAllocated = quantityTracker[job_step_id] || 0;
      const remainingAllowed = Math.max(0, stepCapacity.remaining_quantity - currentAllocated);
      if (remainingAllowed <= 0) {
        console.warn(`No remaining quantity left for step ${job_step_id}, skipping`);
        continue;
      }

      if (quantity > stepCapacity.units_per_day || quantity > remainingAllowed) {
        const adjustedQuantity = Math.min(stepCapacity.units_per_day, remainingAllowed);
        console.warn(
          `Quantity ${quantity} exceeds allowed amount for step ${job_step_id} on ${date}, adjusting to ${adjustedQuantity}`
        );
        validPlans.push({
          date,
          job_step_id,
          quantity: adjustedQuantity,
        });
        quantityTracker[job_step_id] = (quantityTracker[job_step_id] || 0) + adjustedQuantity;
      } else {
        validPlans.push({ date, job_step_id, quantity });
        quantityTracker[job_step_id] = (quantityTracker[job_step_id] || 0) + quantity;
      }
    }

    const completedPlans = ensureSingleStepCoverage(
      validPlans,
      stepCapacities.map((step) => ({
        job_step_id: step.job_step_id,
        step_id: step.step_id,
        step_name: step.step_name,
        minutes_per_unit: step.minutes_per_unit,
        standard_time: step.standard_time,
        remaining_quantity: step.remaining_quantity,
      })),
      todayString,
      dueDate,
      existingStepMinutesByDate
    );

    // Log summary
    const totalPlanned = completedPlans.reduce((sum, plan) => sum + plan.quantity, 0);
    console.log(
      `${providerName} planning: Total ${totalPlanned} units planned across ${completedPlans.length} planning records`
    );
    
    console.log("\nFinal Planning Pairs:");
    completedPlans.slice(0, 5).forEach((p, i) => {
      console.log(`  ${i + 1}. Date: ${p.date}, Step ID: ${p.job_step_id}, Quantity: ${p.quantity}`);
    });
    if (completedPlans.length > 5) {
      console.log(`  ... and ${completedPlans.length - 5} more`);
    }
    
    console.log(`========== ${providerName.toUpperCase()} REQUEST COMPLETE ==========\n`);

    return completedPlans;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error(`Failed to parse AI response as JSON: ${error.message}`);
    }
    throw error;
  }
}

export async function generateBatchAutoPlan(
  jobs: BatchJobPlanningInput[],
  existingStepMinutesByDate: ExistingStepMinutesByDate = {}
): Promise<BatchPlanningPair[]> {
  const provider = getAiProvider();
  const providerName = getProviderDisplayName(provider);
  getApiKeyForProvider(provider);

  if (!jobs.length) {
    return [];
  }

  const todayString = formatLocalDate(new Date());

  console.log(`\n========== ${providerName.toUpperCase()} BATCH AUTO PLAN REQUEST ==========`);
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
7. Prefer consolidated batches on fewer production days when capacity allows
8. Avoid returning quantity 1 for a day unless it is unavoidable because of due date or remaining capacity
9. Return ONLY a valid JSON array of objects with fields: job_id, date, job_step_id, quantity

Return ONLY valid JSON array format like:
[
  {"job_id": 1, "date": "2026-03-24", "job_step_id": 37, "quantity": 13},
  {"job_id": 1, "date": "2026-03-24", "job_step_id": 38, "quantity": 30}
]

Do not include markdown formatting, code blocks, comments, or explanations.`;

  console.log(`\nBatch prompt being sent to ${providerName}:`);
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
    const responseText = await callAiTextResponse(provider, prompt, "batch auto-plan");
    console.log("\nExtracted Batch Response Text:");
    console.log(responseText);

    const jsonString = extractJsonArrayCandidate(responseText);
    console.log(jsonString !== sanitizeJsonCandidate(responseText)
      ? "\nExtracted JSON array from batch response"
      : "\nNo complete JSON array wrapper found in batch response, using normalized response text");

    console.log("Batch JSON String length:", jsonString.length);
    console.log("Batch JSON String Content:");
    console.log(jsonString);

    const plannedSchedule = parseAiJsonArray<BatchPlanningPair>(responseText, `${providerName} batch auto-plan`);
    console.log(`Parsed batch JSON successfully. Array length: ${plannedSchedule.length}`);
    console.log("Parsed Batch Schedule Data:");
    console.log(JSON.stringify(plannedSchedule, null, 2));

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

      if (!isWeekday(date)) {
        console.warn(`Plan date ${date} is not a weekday, skipping`);
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
    const completedPlans = ensureBatchStepCoverage(validPlans, jobs, todayString, existingStepMinutesByDate);
    const completedTotalPlanned = completedPlans.reduce((sum, plan) => sum + plan.quantity, 0);
    console.log(
      `${providerName} batch planning: Total ${completedTotalPlanned} units planned across ${completedPlans.length} planning records`
    );

    console.log("\nFinal Batch Planning Pairs:");
    completedPlans.slice(0, 10).forEach((plan, index) => {
      console.log(
        `  ${index + 1}. Job ID: ${plan.job_id}, Date: ${plan.date}, Step ID: ${plan.job_step_id}, Quantity: ${plan.quantity}`
      );
    });
    if (completedPlans.length > 10) {
      console.log(`  ... and ${completedPlans.length - 10} more`);
    }

    console.log(`========== ${providerName.toUpperCase()} BATCH REQUEST COMPLETE ==========\n`);

    return completedPlans;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error(`Failed to parse AI response as JSON: ${error.message}`);
    }
    throw error;
  }
}
