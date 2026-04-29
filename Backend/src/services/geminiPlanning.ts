export interface JobStepWithCapacity {
  job_step_id: number;
  step_id: number;
  step_name: string;
  minutes_per_unit: number | null;
  standard_time: number; // minutes available per day
  priority: number;
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

interface BatchJobPriorityRecommendation {
  job_id: number;
  priority: number;
  reason?: string;
}

export interface BatchPriorityRecommendationResult {
  job_id: number;
  job_number: string;
  priority: number | null;
  reason: string;
}

export interface BatchAutoPlanResult {
  planningPairs: BatchPlanningPair[];
  priorityRecommendations: BatchPriorityRecommendationResult[];
}

type AiProvider = "gemini" | "groq";

const debugLog = (..._args: unknown[]): void => {};

function sortStepsByPriority<T extends { priority: number; step_name: string; job_step_id: number }>(steps: T[]): T[] {
  return [...steps].sort((left, right) => {
    if (left.priority !== right.priority) {
      return left.priority - right.priority;
    }

    const nameComparison = left.step_name.localeCompare(right.step_name);
    if (nameComparison !== 0) {
      return nameComparison;
    }

    return left.job_step_id - right.job_step_id;
  });
}

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

function isPreferredWorkingDay(dateString: string): boolean {
  const day = parseLocalDate(dateString).getDay();
  return day !== 0 && day !== 6;
}

function getDateStringsInRange(startDate: string, endDate: string): string[] {
  const dates: string[] = [];
  const current = parseLocalDate(startDate);
  const end = parseLocalDate(endDate);

  while (current <= end) {
    dates.push(formatLocalDate(current));
    current.setDate(current.getDate() + 1);
  }

  return dates;
}

function getPreferredWorkingDateStrings(startDate: string, endDate: string): string[] {
  return getDateStringsInRange(startDate, endDate).filter(isPreferredWorkingDay);
}

function getWeekendDateStrings(startDate: string, endDate: string): string[] {
  return getDateStringsInRange(startDate, endDate).filter((dateString) => !isPreferredWorkingDay(dateString));
}

function getNextDateString(dateString: string): string {
  const current = parseLocalDate(dateString);
  current.setDate(current.getDate() + 1);
  return formatLocalDate(current);
}

function getLaterDateString(left: string, right: string): string {
  return left >= right ? left : right;
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

        debugLog(`[${providerName} Attempt ${attempt + 1}/${maxRetries + 1}] Rate limited. Waiting ${waitSeconds}s before retry...`);

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
        
        debugLog(`[${providerName} Attempt ${attempt + 1}/${maxRetries + 1}] API returned ${response.status}. ${attempt < maxRetries ? 'Retrying...' : 'Max retries reached.'}`);
        
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
        debugLog(`[${providerName} Attempt ${attempt + 1}/${maxRetries + 1}] Error occurred. Waiting ${waitMs}ms before retry...`);
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
    debugLog(`Calling ${providerName} API at: ${apiUrl}`);

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
    debugLog(`\n${providerName} API Response Status: SUCCESS (${requestLabel})`);
    debugLog("Full Response:");
    debugLog(JSON.stringify(result, null, 2));

    const responseText = result?.choices?.[0]?.message?.content;
    if (!responseText || typeof responseText !== "string") {
      debugLog(`ERROR: Invalid ${providerName} response structure`);
      throw new Error(`Invalid ${providerName} API response structure`);
    }

    return responseText;
  }

  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
  debugLog(`Calling ${providerName} API at: ${apiUrl.replace(apiKey, "REDACTED")}`);

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
  debugLog(`\n${providerName} API Response Status: SUCCESS (${requestLabel})`);
  debugLog("Full Response:");
  debugLog(JSON.stringify(result, null, 2));

  const responseText = result?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!responseText || typeof responseText !== "string") {
    debugLog(`ERROR: Invalid ${providerName} response structure`);
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

function getImmediatePredecessorSteps<T extends { priority: number }>(
  currentStep: T,
  allSteps: T[]
): T[] {
  const previousPriority = allSteps.reduce((highestLowerPriority, step) => {
    if (step.priority >= currentStep.priority) {
      return highestLowerPriority;
    }

    return Math.max(highestLowerPriority, step.priority);
  }, Number.NEGATIVE_INFINITY);

  if (!Number.isFinite(previousPriority)) {
    return [];
  }

  return allSteps.filter((step) => step.priority === previousPriority);
}

function getCumulativeAllocatedQuantity<T extends { job_step_id: number }>(
  allocationMap: Map<string, number>,
  currentStep: T,
  productionDates: string[],
  targetDate: string,
  includeTargetDate: boolean,
  keyBuilder: (step: T, date: string) => string
): number {
  return productionDates.reduce((sum, date) => {
    if (includeTargetDate ? date > targetDate : date >= targetDate) {
      return sum;
    }

    return sum + (allocationMap.get(keyBuilder(currentStep, date)) || 0);
  }, 0);
}

function getPrecedenceAllowanceForDate<
  T extends { job_step_id: number; priority: number; remaining_quantity: number }
>(
  currentStep: T,
  allSteps: T[],
  allocationMap: Map<string, number>,
  productionDates: string[],
  targetDate: string,
  keyBuilder: (step: T, date: string) => string
): number {
  const predecessorSteps = getImmediatePredecessorSteps(currentStep, allSteps);
  if (predecessorSteps.length === 0) {
    return Number.POSITIVE_INFINITY;
  }

  const currentAllocatedBeforeDate = getCumulativeAllocatedQuantity(
    allocationMap,
    currentStep,
    productionDates,
    targetDate,
    false,
    keyBuilder
  );

  const predecessorCompletionLimit = predecessorSteps.reduce((minimumAllowed, predecessorStep) => {
    const predecessorAllocatedBeforeDate = getCumulativeAllocatedQuantity(
      allocationMap,
      predecessorStep,
      productionDates,
      targetDate,
      false,
      keyBuilder
    );

    const completedBufferFromExistingPlans = currentStep.remaining_quantity - predecessorStep.remaining_quantity;
    return Math.min(minimumAllowed, completedBufferFromExistingPlans + predecessorAllocatedBeforeDate);
  }, Number.POSITIVE_INFINITY);

  return Math.max(0, predecessorCompletionLimit - currentAllocatedBeforeDate);
}

function extendProductionDatesUntilPlanned<
  T extends {
    job_step_id: number;
    step_id: number;
    step_name: string;
    minutes_per_unit: number;
    standard_time: number;
    priority: number;
    remaining_quantity: number;
  }
>(
  currentStep: T,
  allSteps: T[],
  allocationMap: Map<string, number>,
  usedMinutesMap: Map<string, number>,
  allocatedByJobStep: Map<number, number>,
  productionDates: string[],
  remaining: number,
  extensionStartDate: string,
  keyBuilder: (step: T, date: string) => string,
  logLabel: string
): number {
  let unresolved = remaining;
  let anchorDate = productionDates[productionDates.length - 1] || "";
  let extraDays = 0;

  while (unresolved > 0 && extraDays < 365) {
    const nextDate = anchorDate
      ? getNextDateString(anchorDate)
      : extensionStartDate;
    anchorDate = nextDate;
    productionDates.push(nextDate);
    extraDays += 1;

    const availableCapacity = getAvailableUnitsForDate(currentStep, nextDate, usedMinutesMap);
    const usedMinutes = getUsedMinutesForStepOnDate(usedMinutesMap, currentStep.step_id, nextDate);
    const remainingMinutes = Math.max(0, currentStep.standard_time - usedMinutes);
    const precedenceAllowance = getPrecedenceAllowanceForDate(
      currentStep,
      allSteps,
      allocationMap,
      productionDates,
      nextDate,
      keyBuilder
    );

    if (availableCapacity <= 0 || precedenceAllowance <= 0) {
      debugLog(`${logLabel} ${nextDate}: extended beyond due date with ${remainingMinutes}/${currentStep.standard_time} minutes free, can place ${availableCapacity} units, predecessor allows ${precedenceAllowance}`);
      continue;
    }

    const allocationKey = keyBuilder(currentStep, nextDate);
    const addedQuantity = Math.min(unresolved, availableCapacity, precedenceAllowance);
    const currentQuantity = allocationMap.get(allocationKey) || 0;
    allocationMap.set(allocationKey, currentQuantity + addedQuantity);
    addStepMinutesUsage(usedMinutesMap, currentStep.step_id, nextDate, addedQuantity * currentStep.minutes_per_unit);
    allocatedByJobStep.set(currentStep.job_step_id, (allocatedByJobStep.get(currentStep.job_step_id) || 0) + addedQuantity);
    unresolved -= addedQuantity;

    debugLog(`${logLabel} ${nextDate}: added ${addedQuantity} after due date, free minutes ${remainingMinutes}, max units today ${availableCapacity}, day total ${currentQuantity + addedQuantity}, remaining ${unresolved}`);
  }

  return unresolved;
}

function extendBatchProductionDatesUntilPlanned(
  jobId: number,
  jobNumber: string,
  currentStep: JobStepWithRemaining & { minutes_per_unit: number },
  allSteps: JobStepWithRemaining[],
  allocationMap: Map<string, number>,
  usedMinutesMap: Map<string, number>,
  allocatedByJobStep: Map<string, number>,
  productionDates: string[],
  remaining: number,
  extensionStartDate: string,
): number {
  let unresolved = remaining;
  let anchorDate = productionDates[productionDates.length - 1] || "";
  let extraDays = 0;

  while (unresolved > 0 && extraDays < 365) {
    const nextDate = anchorDate
      ? getNextDateString(anchorDate)
      : extensionStartDate;
    anchorDate = nextDate;
    productionDates.push(nextDate);
    extraDays += 1;

    const availableCapacity = getAvailableUnitsForDate(currentStep, nextDate, usedMinutesMap);
    const usedMinutes = getUsedMinutesForStepOnDate(usedMinutesMap, currentStep.step_id, nextDate);
    const remainingMinutes = Math.max(0, currentStep.standard_time - usedMinutes);
    const precedenceAllowance = getPrecedenceAllowanceForDate(
      currentStep,
      allSteps,
      allocationMap,
      productionDates,
      nextDate,
      (step, date) => `${jobId}:${step.job_step_id}:${date}`
    );

    if (availableCapacity <= 0 || precedenceAllowance <= 0) {
      debugLog(`[AUTO-PLAN BATCH DEBUG] Job ${jobNumber} step ${currentStep.step_name} ${nextDate}: extended beyond due date with ${remainingMinutes}/${currentStep.standard_time} minutes free, can place ${availableCapacity} units, predecessor allows ${precedenceAllowance}`);
      continue;
    }

    const allocationKey = `${jobId}:${currentStep.job_step_id}:${nextDate}`;
    const addedQuantity = Math.min(unresolved, availableCapacity, precedenceAllowance);
    const currentQuantity = allocationMap.get(allocationKey) || 0;
    allocationMap.set(allocationKey, currentQuantity + addedQuantity);
    addStepMinutesUsage(usedMinutesMap, currentStep.step_id, nextDate, addedQuantity * currentStep.minutes_per_unit);
    const stepAllocationKey = `${jobId}:${currentStep.job_step_id}`;
    allocatedByJobStep.set(stepAllocationKey, (allocatedByJobStep.get(stepAllocationKey) || 0) + addedQuantity);
    unresolved -= addedQuantity;

    debugLog(`[AUTO-PLAN BATCH DEBUG] Job ${jobNumber} step ${currentStep.step_name} ${nextDate}: added ${addedQuantity} after due date, free minutes ${remainingMinutes}, max units today ${availableCapacity}, day total ${currentQuantity + addedQuantity}, remaining ${unresolved}`);
  }

  return unresolved;
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
    priority: number;
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
          if (date <= sourceDate) {
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

        debugLog(
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
    const productionDates = getPreferredWorkingDateStrings(todayString, job.due_date);

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
            if (date <= sourceDate) {
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

          debugLog(
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
    priority: number;
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
  const beforeDueDates = getPreferredWorkingDateStrings(todayString, dueDate);
  const weekendDatesBeforeDue = getWeekendDateStrings(todayString, dueDate);
  const productionDates = [...beforeDueDates];

  const sortedMergedPlans = [...mergedPlans].sort((left, right) => {
    if (left.date !== right.date) {
      return left.date.localeCompare(right.date);
    }

    const leftPriority = stepByJobStepId.get(left.job_step_id)?.priority ?? Number.MAX_SAFE_INTEGER;
    const rightPriority = stepByJobStepId.get(right.job_step_id)?.priority ?? Number.MAX_SAFE_INTEGER;
    if (leftPriority !== rightPriority) {
      return leftPriority - rightPriority;
    }

    return left.job_step_id - right.job_step_id;
  });

  for (const plan of sortedMergedPlans) {
    const step = stepByJobStepId.get(plan.job_step_id);
    if (!step) {
      continue;
    }

    const availableUnits = getAvailableUnitsForDate(step, plan.date, usedMinutesMap);
    const alreadyAllocated = allocatedByJobStep.get(plan.job_step_id) || 0;
    const remainingAllowed = Math.max(0, step.remaining_quantity - alreadyAllocated);
    const precedenceAllowance = getPrecedenceAllowanceForDate(
      step,
      stepCapacities,
      allocationMap,
      productionDates,
      plan.date,
      (currentStep, date) => `${currentStep.job_step_id}:${date}`
    );
    const adjustedQuantity = Math.min(plan.quantity, availableUnits, remainingAllowed, precedenceAllowance);

    if (adjustedQuantity <= 0) {
      debugLog(
        `[AUTO-PLAN DEBUG] Step ${step.step_name} ${plan.date}: AI allocation skipped because no shared capacity or predecessor output is available`
      );
      continue;
    }

    if (adjustedQuantity !== plan.quantity) {
      debugLog(
        `[AUTO-PLAN DEBUG] Step ${step.step_name} ${plan.date}: AI allocation adjusted from ${plan.quantity} to ${adjustedQuantity} due to shared capacity or predecessor handoff limits`
      );
    }

    allocationMap.set(`${plan.job_step_id}:${plan.date}`, adjustedQuantity);
    allocatedByJobStep.set(plan.job_step_id, alreadyAllocated + adjustedQuantity);
    addStepMinutesUsage(usedMinutesMap, step.step_id, plan.date, adjustedQuantity * step.minutes_per_unit);
  }

  debugLog("[AUTO-PLAN DEBUG] Working dates considered:", productionDates.join(", "));

  for (const step of stepCapacities) {
    const maxPossibleBeforeDueDate = beforeDueDates.reduce(
      (sum, date) => sum + getAvailableUnitsForDate(step, date, usedMinutesMap),
      0
    ) + (allocatedByJobStep.get(step.job_step_id) || 0);
    debugLog(
      `[AUTO-PLAN DEBUG] Step ${step.step_name} (${step.job_step_id}) capacity: ${step.standard_time} min/day, ${step.minutes_per_unit} min/unit, max ${maxPossibleBeforeDueDate} units before ${dueDate}`
    );

    const initialAllocations = productionDates.map((date) => ({
      date,
      quantity: allocationMap.get(`${step.job_step_id}:${date}`) || 0,
    }));
    debugLog(
      `[AUTO-PLAN DEBUG] Step ${step.step_name} initial allocations: ${initialAllocations
        .map((entry) => `${entry.date}=${entry.quantity}`)
        .join(", ")}`
    );

    const allocated = allocatedByJobStep.get(step.job_step_id) || 0;

    let remaining = step.remaining_quantity - allocated;
    debugLog(
      `[AUTO-PLAN DEBUG] Step ${step.step_name} allocated ${allocated}/${step.remaining_quantity}, remaining ${remaining}`
    );

    for (const date of productionDates) {
      if (remaining <= 0) {
        break;
      }

      const key = `${step.job_step_id}:${date}`;
      const usedMinutes = getUsedMinutesForStepOnDate(usedMinutesMap, step.step_id, date);
      const availableCapacity = getAvailableUnitsForDate(step, date, usedMinutesMap);
      const precedenceAllowance = getPrecedenceAllowanceForDate(
        step,
        stepCapacities,
        allocationMap,
        productionDates,
        date,
        (currentStep, currentDate) => `${currentStep.job_step_id}:${currentDate}`
      );
      if (availableCapacity <= 0) {
        debugLog(
          `[AUTO-PLAN DEBUG] Step ${step.step_name} ${date}: no free shared capacity left (${usedMinutes}/${step.standard_time} min used)`
        );
        continue;
      }

      if (precedenceAllowance <= 0) {
        debugLog(
          `[AUTO-PLAN DEBUG] Step ${step.step_name} ${date}: waiting for predecessor steps to finish enough quantity before handing off more work`
        );
        continue;
      }

      const addedQuantity = Math.min(remaining, availableCapacity, precedenceAllowance);
      const currentQuantity = allocationMap.get(key) || 0;
      allocationMap.set(key, currentQuantity + addedQuantity);
      addStepMinutesUsage(usedMinutesMap, step.step_id, date, addedQuantity * step.minutes_per_unit);
      allocatedByJobStep.set(step.job_step_id, (allocatedByJobStep.get(step.job_step_id) || 0) + addedQuantity);
      remaining -= addedQuantity;
      debugLog(
        `[AUTO-PLAN DEBUG] Step ${step.step_name} ${date}: added ${addedQuantity}, day total ${currentQuantity + addedQuantity}, remaining ${remaining}`
      );
    }

    for (const date of weekendDatesBeforeDue) {
      if (remaining <= 0) {
        break;
      }

      if (!productionDates.includes(date)) {
        productionDates.push(date);
      }

      const key = `${step.job_step_id}:${date}`;
      const availableCapacity = getAvailableUnitsForDate(step, date, usedMinutesMap);
      const precedenceAllowance = getPrecedenceAllowanceForDate(
        step,
        stepCapacities,
        allocationMap,
        productionDates,
        date,
        (currentStep, currentDate) => `${currentStep.job_step_id}:${currentDate}`
      );

      if (availableCapacity <= 0 || precedenceAllowance <= 0) {
        continue;
      }

      const addedQuantity = Math.min(remaining, availableCapacity, precedenceAllowance);
      const currentQuantity = allocationMap.get(key) || 0;
      allocationMap.set(key, currentQuantity + addedQuantity);
      addStepMinutesUsage(usedMinutesMap, step.step_id, date, addedQuantity * step.minutes_per_unit);
      allocatedByJobStep.set(step.job_step_id, (allocatedByJobStep.get(step.job_step_id) || 0) + addedQuantity);
      remaining -= addedQuantity;
      debugLog(
        `[AUTO-PLAN DEBUG] Step ${step.step_name} ${date}: weekend fallback added ${addedQuantity}, day total ${currentQuantity + addedQuantity}, remaining ${remaining}`
      );
    }

    if (remaining > 0) {
      debugLog(
        `[AUTO-PLAN DEBUG] Step ${step.step_name}: due-date capacity exhausted, extending planning beyond ${dueDate}`
      );
      remaining = extendProductionDatesUntilPlanned(
        step,
        stepCapacities,
        allocationMap,
        usedMinutesMap,
        allocatedByJobStep,
        productionDates,
        remaining,
        getLaterDateString(todayString, dueDate),
        (currentStep, currentDate) => `${currentStep.job_step_id}:${currentDate}`,
        `[AUTO-PLAN DEBUG] Step ${step.step_name}`
      );
    }

    const finalAllocations = productionDates.map((date) => ({
      date,
      quantity: allocationMap.get(`${step.job_step_id}:${date}`) || 0,
    }));
    debugLog(
      `[AUTO-PLAN DEBUG] Step ${step.step_name} final allocations: ${finalAllocations
        .map((entry) => `${entry.date}=${entry.quantity}`)
        .join(", ")}`
    );

    if (remaining > 0) {
      throw new Error(
        `Unable to create a complete plan for step ${step.step_name}. Missing ${remaining} units even after extending beyond due date ${dueDate}. Shared step capacity and predecessor constraints do not allow enough output, and the maximum possible before due date is ${maxPossibleBeforeDueDate} units.`
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
  const overdueRemainingByJobStep = new Map<string, number>();

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

  const jobStepsByJobId = new Map(jobs.map((job) => [job.job_id, job.job_steps]));
  const productionDatesByJobId = new Map(
    jobs.map((job) => [job.job_id, getPreferredWorkingDateStrings(todayString, job.due_date)])
  );
  const beforeDueDatesByJobId = new Map(
    jobs.map((job) => [job.job_id, getPreferredWorkingDateStrings(todayString, job.due_date)])
  );
  const weekendDatesByJobId = new Map(
    jobs.map((job) => [job.job_id, getWeekendDateStrings(todayString, job.due_date)])
  );

  const sortedMergedPlans = [...mergedPlans].sort((left, right) => {
    if (left.date !== right.date) {
      return left.date.localeCompare(right.date);
    }

    if (left.job_id !== right.job_id) {
      return left.job_id - right.job_id;
    }

    const leftPriority = stepMap.get(`${left.job_id}:${left.job_step_id}`)?.priority ?? Number.MAX_SAFE_INTEGER;
    const rightPriority = stepMap.get(`${right.job_id}:${right.job_step_id}`)?.priority ?? Number.MAX_SAFE_INTEGER;
    if (leftPriority !== rightPriority) {
      return leftPriority - rightPriority;
    }

    return left.job_step_id - right.job_step_id;
  });

  for (const plan of sortedMergedPlans) {
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
    const precedenceAllowance = getPrecedenceAllowanceForDate(
      normalizedStep,
      jobStepsByJobId.get(plan.job_id) || [],
      allocationMap,
      productionDatesByJobId.get(plan.job_id) || [],
      plan.date,
      (currentStep, date) => `${plan.job_id}:${currentStep.job_step_id}:${date}`
    );
    const adjustedQuantity = Math.min(plan.quantity, availableUnits, remainingAllowed, precedenceAllowance);

    if (adjustedQuantity <= 0) {
      debugLog(
        `[AUTO-PLAN BATCH DEBUG] Job ${normalizedStep.job_number} step ${normalizedStep.step_name} ${plan.date}: AI allocation skipped because no shared capacity or predecessor output is available`
      );
      continue;
    }

    if (adjustedQuantity !== plan.quantity) {
      debugLog(
        `[AUTO-PLAN BATCH DEBUG] Job ${normalizedStep.job_number} step ${normalizedStep.step_name} ${plan.date}: AI allocation adjusted from ${plan.quantity} to ${adjustedQuantity} due to shared capacity or predecessor handoff limits`
      );
    }

    allocationMap.set(allocationKey, adjustedQuantity);
    allocatedByJobStep.set(`${plan.job_id}:${plan.job_step_id}`, allocatedForStep + adjustedQuantity);
    addStepMinutesUsage(usedMinutesMap, normalizedStep.step_id, plan.date, adjustedQuantity * normalizedStep.minutes_per_unit);
  }

  for (const job of jobs) {
    const productionDates = productionDatesByJobId.get(job.job_id) || [];
    const beforeDueDates = beforeDueDatesByJobId.get(job.job_id) || productionDates;
    const weekendDates = weekendDatesByJobId.get(job.job_id) || [];
    debugLog(
      `[AUTO-PLAN BATCH DEBUG] Job ${job.job_number} working dates considered: ${productionDates.join(", ")}`
    );

    for (const step of job.job_steps.filter((item) => item.minutes_per_unit && item.minutes_per_unit > 0)) {
      const unitsPerDay = Math.floor(step.standard_time / (step.minutes_per_unit || 1));
      const stepAllocationKey = `${job.job_id}:${step.job_step_id}`;
      const maxPossibleBeforeDueDate = beforeDueDates.reduce(
        (sum, date) => sum + getAvailableUnitsForDate(step as typeof step & { minutes_per_unit: number }, date, usedMinutesMap),
        0
      ) + (allocatedByJobStep.get(stepAllocationKey) || 0);
      debugLog(
        `[AUTO-PLAN BATCH DEBUG] Job ${job.job_number} step ${step.step_name} (${step.job_step_id}) capacity: ${step.standard_time} min/day, ${step.minutes_per_unit} min/unit, max ${maxPossibleBeforeDueDate} units before ${job.due_date}`
      );

      const initialAllocations = productionDates.map((date) => ({
        date,
        quantity: allocationMap.get(`${job.job_id}:${step.job_step_id}:${date}`) || 0,
      }));
      debugLog(
        `[AUTO-PLAN BATCH DEBUG] Job ${job.job_number} step ${step.step_name} initial allocations: ${initialAllocations
          .map((entry) => `${entry.date}=${entry.quantity}`)
          .join(", ")}`
      );

      const allocated = allocatedByJobStep.get(stepAllocationKey) || 0;

      let remaining = step.remaining_quantity - allocated;
      debugLog(
        `[AUTO-PLAN BATCH DEBUG] Job ${job.job_number} step ${step.step_name} allocated ${allocated}/${step.remaining_quantity}, remaining ${remaining}`
      );

      for (const date of productionDates) {
        if (remaining <= 0) {
          break;
        }

        const key = `${job.job_id}:${step.job_step_id}:${date}`;
        const usedMinutes = getUsedMinutesForStepOnDate(usedMinutesMap, step.step_id, date);
        const availableCapacity = getAvailableUnitsForDate(step as typeof step & { minutes_per_unit: number }, date, usedMinutesMap);
        const precedenceAllowance = getPrecedenceAllowanceForDate(
          step,
          job.job_steps,
          allocationMap,
          productionDates,
          date,
          (currentStep, currentDate) => `${job.job_id}:${currentStep.job_step_id}:${currentDate}`
        );
        if (availableCapacity <= 0) {
          debugLog(
            `[AUTO-PLAN BATCH DEBUG] Job ${job.job_number} step ${step.step_name} ${date}: no free shared capacity left (${usedMinutes}/${step.standard_time} min used)`
          );
          continue;
        }

        if (precedenceAllowance <= 0) {
          debugLog(
            `[AUTO-PLAN BATCH DEBUG] Job ${job.job_number} step ${step.step_name} ${date}: waiting for predecessor steps to finish enough quantity before handing off more work`
          );
          continue;
        }

        const addedQuantity = Math.min(remaining, availableCapacity, precedenceAllowance);
        const currentQuantity = allocationMap.get(key) || 0;
        allocationMap.set(key, currentQuantity + addedQuantity);
        addStepMinutesUsage(usedMinutesMap, step.step_id, date, addedQuantity * (step.minutes_per_unit || 0));
        allocatedByJobStep.set(stepAllocationKey, (allocatedByJobStep.get(stepAllocationKey) || 0) + addedQuantity);
        remaining -= addedQuantity;
        debugLog(
          `[AUTO-PLAN BATCH DEBUG] Job ${job.job_number} step ${step.step_name} ${date}: added ${addedQuantity}, day total ${currentQuantity + addedQuantity}, remaining ${remaining}`
        );
      }

      for (const date of weekendDates) {
        if (remaining <= 0) {
          break;
        }

        if (!productionDates.includes(date)) {
          productionDates.push(date);
        }

        const key = `${job.job_id}:${step.job_step_id}:${date}`;
        const availableCapacity = getAvailableUnitsForDate(step as typeof step & { minutes_per_unit: number }, date, usedMinutesMap);
        const precedenceAllowance = getPrecedenceAllowanceForDate(
          step,
          job.job_steps,
          allocationMap,
          productionDates,
          date,
          (currentStep, currentDate) => `${job.job_id}:${currentStep.job_step_id}:${currentDate}`
        );

        if (availableCapacity <= 0 || precedenceAllowance <= 0) {
          continue;
        }

        const addedQuantity = Math.min(remaining, availableCapacity, precedenceAllowance);
        const currentQuantity = allocationMap.get(key) || 0;
        allocationMap.set(key, currentQuantity + addedQuantity);
        addStepMinutesUsage(usedMinutesMap, step.step_id, date, addedQuantity * (step.minutes_per_unit || 0));
        allocatedByJobStep.set(stepAllocationKey, (allocatedByJobStep.get(stepAllocationKey) || 0) + addedQuantity);
        remaining -= addedQuantity;
        debugLog(
          `[AUTO-PLAN BATCH DEBUG] Job ${job.job_number} step ${step.step_name} ${date}: weekend fallback added ${addedQuantity}, day total ${currentQuantity + addedQuantity}, remaining ${remaining}`
        );
      }

      if (remaining > 0) {
        debugLog(
          `[AUTO-PLAN BATCH DEBUG] Job ${job.job_number} step ${step.step_name}: due-date capacity exhausted, deferring ${remaining} units to overdue phase so jobs that can still finish on time use shared capacity first`
        );
        overdueRemainingByJobStep.set(stepAllocationKey, remaining);
      }

      const finalAllocations = productionDates.map((date) => ({
        date,
        quantity: allocationMap.get(`${job.job_id}:${step.job_step_id}:${date}`) || 0,
      }));
      debugLog(
        `[AUTO-PLAN BATCH DEBUG] Job ${job.job_number} step ${step.step_name} final allocations: ${finalAllocations
          .map((entry) => `${entry.date}=${entry.quantity}`)
          .join(", ")}`
      );

      if (remaining <= 0) {
        overdueRemainingByJobStep.delete(stepAllocationKey);
      }
    }
  }

  for (const job of jobs) {
    const productionDates = productionDatesByJobId.get(job.job_id) || [];

    for (const step of job.job_steps.filter((item) => item.minutes_per_unit && item.minutes_per_unit > 0)) {
      const stepAllocationKey = `${job.job_id}:${step.job_step_id}`;
      const remaining = overdueRemainingByJobStep.get(stepAllocationKey) || 0;
      if (remaining <= 0) {
        continue;
      }

      debugLog(
        `[AUTO-PLAN BATCH DEBUG] Job ${job.job_number} step ${step.step_name}: starting overdue phase with ${remaining} units after all on-time jobs were allocated`
      );

      const unresolved = extendBatchProductionDatesUntilPlanned(
        job.job_id,
        job.job_number,
        step as JobStepWithRemaining & { minutes_per_unit: number },
        job.job_steps,
        allocationMap,
        usedMinutesMap,
        allocatedByJobStep,
        productionDates,
        remaining,
        getLaterDateString(todayString, job.due_date)
      );

      if (unresolved > 0) {
        const maxPossibleBeforeDueDate = (beforeDueDatesByJobId.get(job.job_id) || productionDates).reduce(
          (sum, date) => sum + getAvailableUnitsForDate(step as typeof step & { minutes_per_unit: number }, date, usedMinutesMap),
          0
        ) + ((allocatedByJobStep.get(stepAllocationKey) || 0) - unresolved);

        throw new Error(
          `Unable to create a complete plan for job ${job.job_number} step ${step.step_name}. Missing ${unresolved} units even after extending beyond due date ${job.due_date}. Shared step capacity and predecessor constraints do not allow enough output, and the maximum possible before due date is ${maxPossibleBeforeDueDate} units.`
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
  const todayString = formatLocalDate(new Date());

  debugLog(`\n========== AUTO PLAN REQUEST ==========`);
  debugLog(`Job Number: ${jobNumber}`);
  debugLog(`Due Date: ${dueDate}`);
  debugLog(`Current Date: ${todayString}`);
  const orderedJobSteps = sortStepsByPriority(jobSteps);

  debugLog(`Job Steps Count: ${orderedJobSteps.length}`);
  debugLog("Job Steps Data:");
  orderedJobSteps.forEach((step) => {
    debugLog(`  - Priority ${step.priority} Step ID ${step.job_step_id}: ${step.step_name} (${step.minutes_per_unit} min/unit, ${step.standard_time} min/day, remaining ${step.remaining_quantity})`);
  });

  // Calculate capacity for each step
  const stepCapacities = orderedJobSteps
    .filter((s) => s.minutes_per_unit && s.minutes_per_unit > 0)
    .map((s) => {
      const minutesPerUnit = s.minutes_per_unit as number;
      return {
        job_step_id: s.job_step_id,
        step_id: s.step_id,
        step_name: s.step_name,
        minutes_per_unit: minutesPerUnit,
        standard_time: s.standard_time,
        priority: s.priority,
        remaining_quantity: s.remaining_quantity,
        units_per_day: Math.floor(s.standard_time / minutesPerUnit),
      };
    });

  if (stepCapacities.length === 0) {
    throw new Error(
      "No job steps with minutes_per_unit configured found"
    );
  }

  const completedPlans = ensureSingleStepCoverage(
    [],
    stepCapacities.map((step) => ({
      job_step_id: step.job_step_id,
      step_id: step.step_id,
      step_name: step.step_name,
      minutes_per_unit: step.minutes_per_unit,
      standard_time: step.standard_time,
      priority: step.priority,
      remaining_quantity: step.remaining_quantity,
    })),
    todayString,
    dueDate,
    existingStepMinutesByDate
  );

  const totalPlanned = completedPlans.reduce((sum, plan) => sum + plan.quantity, 0);
  debugLog(
    `Deterministic weekday-first planning: Total ${totalPlanned} units planned across ${completedPlans.length} planning records`
  );

  debugLog("\nFinal Planning Pairs:");
  completedPlans.slice(0, 5).forEach((p, i) => {
    debugLog(`  ${i + 1}. Date: ${p.date}, Step ID: ${p.job_step_id}, Quantity: ${p.quantity}`);
  });
  if (completedPlans.length > 5) {
    debugLog(`  ... and ${completedPlans.length - 5} more`);
  }

  debugLog("========== AUTO PLAN REQUEST COMPLETE ==========\n");

  return completedPlans;
}

export async function generateBatchAutoPlan(
  jobs: BatchJobPlanningInput[],
  existingStepMinutesByDate: ExistingStepMinutesByDate = {}
): Promise<BatchAutoPlanResult> {
  const provider = getAiProvider();
  const providerName = getProviderDisplayName(provider);
  getApiKeyForProvider(provider);

  if (!jobs.length) {
    return {
      planningPairs: [],
      priorityRecommendations: [],
    };
  }

  const todayString = formatLocalDate(new Date());

  debugLog(`\n========== ${providerName.toUpperCase()} BATCH AUTO PLAN REQUEST ==========`);
  debugLog(`Jobs Count: ${jobs.length}`);
  debugLog(`Current Date: ${todayString}`);

  const orderedJobs = jobs.map((job) => ({
    ...job,
    job_steps: sortStepsByPriority(job.job_steps),
  }));

  const promptJobs = orderedJobs.map((job) => ({
    job_id: job.job_id,
    job_number: job.job_number,
    due_date: job.due_date,
    total_quantity: job.total_quantity,
    job_steps: job.job_steps
      .filter((step) => step.minutes_per_unit && step.minutes_per_unit > 0 && step.remaining_quantity > 0)
      .map((step) => ({
        job_step_id: step.job_step_id,
        step_name: step.step_name,
        priority: step.priority,
        remaining_quantity: step.remaining_quantity,
        units_per_day: Math.floor(step.standard_time / (step.minutes_per_unit || 1)),
      })),
  }));

  const prompt = `You are a production planning AI. Prioritize multiple manufacturing jobs for a deterministic factory scheduler.

Current Date: ${todayString}

Input Jobs JSON:
${JSON.stringify(promptJobs)}

Requirements:
1. Return job priorities only. Do not create dates or quantities.
2. Lower numeric priority means the job should receive shared factory capacity earlier.
3. Prioritize jobs that are more urgent to keep on or before due_date.
4. When urgency is similar, prefer jobs with less slack between current date and required production effort.
5. Consider total remaining work across all job steps and daily capacities.
6. Consider that the deterministic scheduler will schedule each job on Monday-Friday first, fill each day as much as allowed, and enforce step precedence.
7. Only use job_id values that exist in the input JSON.
8. Return every job exactly once.
9. Include a short human-readable reason for each job priority.
10. Return ONLY a valid JSON array of objects with fields: job_id, priority, reason.

Return ONLY valid JSON array format like:
[
  {"job_id": 5, "priority": 1, "reason": "Due date is closest and the job has low slack."},
  {"job_id": 2, "priority": 2, "reason": "Due date is later but it still competes for shared capacity."},
  {"job_id": 9, "priority": 3, "reason": "This job has the most slack before due date."}
]

Do not include markdown formatting, code blocks, comments, or explanations.`;

  debugLog(`\nBatch prompt being sent to ${providerName}:`);
  debugLog("---");
  debugLog(prompt);
  debugLog("---\n");

  try {
    const responseText = await callAiTextResponse(provider, prompt, "batch job prioritization");
    debugLog("\nExtracted Batch Response Text:");
    debugLog(responseText);

    const jsonString = extractJsonArrayCandidate(responseText);
    debugLog(jsonString !== sanitizeJsonCandidate(responseText)
      ? "\nExtracted JSON array from batch response"
      : "\nNo complete JSON array wrapper found in batch response, using normalized response text");

    debugLog("Batch JSON String length:", jsonString.length);
    debugLog("Batch JSON String Content:");
    debugLog(jsonString);

    const prioritySchedule = parseAiJsonArray<BatchJobPriorityRecommendation>(responseText, `${providerName} batch job prioritization`);
    debugLog(`Parsed batch JSON successfully. Array length: ${prioritySchedule.length}`);
    debugLog("Parsed Batch Priority Data:");
    debugLog(JSON.stringify(prioritySchedule, null, 2));

    const aiPriorityByJobId = new Map<number, number>();
    const aiReasonByJobId = new Map<number, string>();
    for (const item of prioritySchedule) {
      if (!Number.isInteger(item?.job_id)) {
        console.warn(`Invalid prioritized job_id: ${item?.job_id}, skipping`);
        continue;
      }

      if (!orderedJobs.some((job) => job.job_id === item.job_id)) {
        console.warn(`Prioritized job ${item.job_id} not found in batch input, skipping`);
        continue;
      }

      if (!Number.isInteger(item?.priority) || item.priority <= 0) {
        console.warn(`Invalid priority ${item?.priority} for job ${item?.job_id}, skipping`);
        continue;
      }

      if (aiPriorityByJobId.has(item.job_id)) {
        console.warn(`Duplicate priority recommendation for job ${item.job_id}, keeping first value`);
        continue;
      }

      aiPriorityByJobId.set(item.job_id, item.priority);
      aiReasonByJobId.set(
        item.job_id,
        typeof item.reason === "string" && item.reason.trim().length > 0
          ? item.reason.trim()
          : "AI did not provide a reason; fallback scheduling rules will still apply."
      );
    }

    const prioritizedJobs = [...orderedJobs].sort((left, right) => {
      const leftPriority = aiPriorityByJobId.get(left.job_id) ?? Number.MAX_SAFE_INTEGER;
      const rightPriority = aiPriorityByJobId.get(right.job_id) ?? Number.MAX_SAFE_INTEGER;

      if (leftPriority !== rightPriority) {
        return leftPriority - rightPriority;
      }

      if (left.due_date !== right.due_date) {
        return left.due_date.localeCompare(right.due_date);
      }

      return left.job_number.localeCompare(right.job_number);
    });

    debugLog("Batch job execution order after AI prioritization:");
    prioritizedJobs.forEach((job, index) => {
      const priorityLabel = aiPriorityByJobId.get(job.job_id) ?? "fallback";
      const reasonLabel = aiReasonByJobId.get(job.job_id) ?? "Fallback by due date and job number.";
      debugLog(`  ${index + 1}. Job ${job.job_number} (job_id=${job.job_id}, ai_priority=${priorityLabel}) - ${reasonLabel}`);
    });

    const completedPlans = ensureBatchStepCoverage([], prioritizedJobs, todayString, existingStepMinutesByDate);
    const completedTotalPlanned = completedPlans.reduce((sum, plan) => sum + plan.quantity, 0);
    debugLog(
      `${providerName} batch prioritization + deterministic scheduling: Total ${completedTotalPlanned} units planned across ${completedPlans.length} planning records`
    );

    debugLog("\nFinal Batch Planning Pairs:");
    completedPlans.slice(0, 10).forEach((plan, index) => {
      debugLog(
        `  ${index + 1}. Job ID: ${plan.job_id}, Date: ${plan.date}, Step ID: ${plan.job_step_id}, Quantity: ${plan.quantity}`
      );
    });
    if (completedPlans.length > 10) {
      debugLog(`  ... and ${completedPlans.length - 10} more`);
    }

    debugLog(`========== ${providerName.toUpperCase()} BATCH REQUEST COMPLETE ==========\n`);

    return {
      planningPairs: completedPlans,
      priorityRecommendations: prioritizedJobs.map((job) => ({
        job_id: job.job_id,
        job_number: job.job_number,
        priority: aiPriorityByJobId.get(job.job_id) ?? null,
        reason: aiReasonByJobId.get(job.job_id) ?? "Fallback by due date and job number.",
      })),
    };
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error(`Failed to parse AI response as JSON: ${error.message}`);
    }
    throw error;
  }
}

