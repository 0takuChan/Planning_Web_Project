import "@/styles/planning.css";
import { useEffect, useState, useMemo } from "react";
import { parseISO, startOfMonth, addMonths, getDaysInMonth, addDays, format } from "date-fns";
import StepWeekGrid, { StepEvent, PlanningEventStatus } from "../components/planning/StepWeekGrid";
import AppLayout from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { usePermissions } from "@/App";
import { apiFetch } from "@/lib/api";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { List, ArrowUpDown, Search, Sparkles, AlertTriangle, CheckCircle2, Info } from "lucide-react";
import NewItemBadge from "@/components/common/NewItemBadge";

const AUTO_PLAN_MARKER_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

function isRecentDate(createdAt?: string | null, maxAgeMs = AUTO_PLAN_MARKER_MAX_AGE_MS): boolean {
  if (!createdAt) return false;
  const t = Date.parse(createdAt);
  if (Number.isNaN(t)) return false;
  return Date.now() - t <= maxAgeMs;
}

interface Job {
  job_id: number;
  job_number: string;
  total_quantity: number;
  end_date: string;
  customer: {
    fullname: string;
  };
}

interface Step {
  step_id: number;
  step_name: string;
}

interface JobStep {
  job_step_id: number;
  job_id: number;
  step_id: number;
  minutes_per_unit?: number | null;
  step?: {
    step_name: string;
  };
}

interface Planning {
  planning_id: number;
  job_step_id: number;
  planned_date: string;
  planned_quantity: number;
  jobStep?: {
    job?: {
      job_number: string;
      end_date?: string;
    };
    step?: {
      step_name: string;
    };
  };
}

interface ProductionLog {
  log_id: number;
  job_step_id: number;
  log_date: string;
  quantity: number;
}

interface JobItem {
  id: string;
  job_id: number;
  quantity: number;
  due: string;
  customer_name: string;
  createdAt?: string;
}

type JobListFilter = 'all' | 'unplanned' | 'planned' | 'complete';
type PlanningSortField = 'job' | 'step' | 'date' | 'quantity';
type AutoPlanFeedbackTone = 'success' | 'error' | 'info';
type AutoPlanningMarkerMap = Record<string, string>;

interface AutoPlanFeedbackState {
  open: boolean;
  tone: AutoPlanFeedbackTone;
  title: string;
  message: string;
  details: string[];
}

interface ClearPlanningDialogState {
  open: boolean;
  job: JobItem | null;
}

interface BatchPriorityRecommendation {
  job_id: number;
  job_number: string;
  priority: number | null;
  reason: string;
}

const stepColorPalette: Record<string, string> = {
  "Cutting": "#86efac",
  "Heating": "#fca5a5",
  "Embroidering": "#fde68a",
  "Sewing": "#a5b4fc",
  "QC": "#67e8f9",
  "Pack": "#f0abfc",
};

const generatedStepColors = new Map<string, string>();

function hslToHex(hue: number, saturation: number, lightness: number): string {
  const normalizedHue = hue / 360;
  const normalizedSaturation = saturation / 100;
  const normalizedLightness = lightness / 100;

  const hueToRgb = (p: number, q: number, t: number) => {
    let value = t;
    if (value < 0) value += 1;
    if (value > 1) value -= 1;
    if (value < 1 / 6) return p + (q - p) * 6 * value;
    if (value < 1 / 2) return q;
    if (value < 2 / 3) return p + (q - p) * (2 / 3 - value) * 6;
    return p;
  };

  let red: number;
  let green: number;
  let blue: number;

  if (normalizedSaturation === 0) {
    red = normalizedLightness;
    green = normalizedLightness;
    blue = normalizedLightness;
  } else {
    const q = normalizedLightness < 0.5
      ? normalizedLightness * (1 + normalizedSaturation)
      : normalizedLightness + normalizedSaturation - normalizedLightness * normalizedSaturation;
    const p = 2 * normalizedLightness - q;
    red = hueToRgb(p, q, normalizedHue + 1 / 3);
    green = hueToRgb(p, q, normalizedHue);
    blue = hueToRgb(p, q, normalizedHue - 1 / 3);
  }

  const toHex = (value: number) => Math.round(value * 255).toString(16).padStart(2, "0");
  return `#${toHex(red)}${toHex(green)}${toHex(blue)}`;
}

function getStepColor(stepName: string): string {
  if (stepColorPalette[stepName]) {
    return stepColorPalette[stepName];
  }

  const cachedColor = generatedStepColors.get(stepName);
  if (cachedColor) {
    return cachedColor;
  }

  let hash = 0;
  for (let index = 0; index < stepName.length; index += 1) {
    hash = (hash * 31 + stepName.charCodeAt(index)) % 360;
  }

  const generatedColor = hslToHex(hash, 72, 72);
  generatedStepColors.set(stepName, generatedColor);
  return generatedColor;
}

const PLANNING_PROGRESS_KEY_SEPARATOR = '::';
const AUTO_PLAN_NEW_MARKERS_STORAGE_KEY = 'planning-auto-new-markers';

function pruneAutoPlanningMarkerMap(markers: AutoPlanningMarkerMap): AutoPlanningMarkerMap {
  return Object.fromEntries(
    Object.entries(markers).filter(([, createdAt]) => isRecentDate(createdAt))
  );
}

function loadAutoPlanningMarkerMap(): AutoPlanningMarkerMap {
  if (typeof window === 'undefined') {
    return {};
  }

  try {
    const rawValue = window.localStorage.getItem(AUTO_PLAN_NEW_MARKERS_STORAGE_KEY);
    if (!rawValue) {
      return {};
    }

    const parsedValue = JSON.parse(rawValue) as AutoPlanningMarkerMap;
    return pruneAutoPlanningMarkerMap(parsedValue ?? {});
  } catch (error) {
    console.error('Failed to load auto-plan new markers:', error);
    return {};
  }
}

function getApiDateOnly(dateValue: string): string {
  return dateValue.split('T')[0];
}

function parseApiDate(dateValue: string): Date {
  return parseISO(getApiDateOnly(dateValue));
}

function isPlanningOverdue(plannedDate: string, dueDate?: string): boolean {
  if (!dueDate) {
    return false;
  }

  return getApiDateOnly(plannedDate) > getApiDateOnly(dueDate);
}

function getPlanningProgressKey(jobStepId: number, dateValue: string): string {
  return `${jobStepId}${PLANNING_PROGRESS_KEY_SEPARATOR}${getApiDateOnly(dateValue)}`;
}

function getPlanningStatus(
  plannedDate: string,
  plannedQty: number,
  loggedQty: number,
): PlanningEventStatus | undefined {
  const normalizedLoggedQty = Math.max(0, loggedQty);

  if (plannedQty > 0 && normalizedLoggedQty >= plannedQty) {
    return 'done';
  }

  if (getApiDateOnly(plannedDate) < format(new Date(), 'yyyy-MM-dd')) {
    return 'delay';
  }

  if (normalizedLoggedQty > 0) {
    return 'working';
  }

  return undefined;
}

function buildPlanningProgressMap(planningsData: Planning[], productionLogs: ProductionLog[]) {
  const plannedQtyByKey = new Map<string, number>();
  const loggedQtyByKey = new Map<string, number>();

  planningsData.forEach((planning) => {
    const key = getPlanningProgressKey(planning.job_step_id, planning.planned_date);
    plannedQtyByKey.set(key, (plannedQtyByKey.get(key) ?? 0) + planning.planned_quantity);
  });

  productionLogs.forEach((log) => {
    const key = getPlanningProgressKey(log.job_step_id, log.log_date);
    loggedQtyByKey.set(key, (loggedQtyByKey.get(key) ?? 0) + log.quantity);
  });

  return new Map(
    Array.from(plannedQtyByKey.entries()).map(([key, plannedQty]) => {
      const [, plannedDate] = key.split(PLANNING_PROGRESS_KEY_SEPARATOR);
      const loggedQty = loggedQtyByKey.get(key) ?? 0;
      return [
        key,
        {
          plannedQty,
          loggedQty,
          status: getPlanningStatus(plannedDate, plannedQty, loggedQty),
        },
      ];
    }),
  );
}

function buildPlanningEvents(
  planningsData: Planning[],
  currentPlanningDate: Date,
  jobStepsData: JobStep[],
  productionLogs: ProductionLog[],
  newAutoPlanningIds: Set<number>,
): StepEvent[] {
  const monthStart = startOfMonth(currentPlanningDate);
  const progressMap = buildPlanningProgressMap(planningsData, productionLogs);

  return planningsData
    .filter(planning => planning.jobStep?.job && planning.jobStep?.step)
    .map((planning) => {
      const plannedDate = parseApiDate(planning.planned_date);
      const dayDiff = Math.floor((plannedDate.getTime() - monthStart.getTime()) / (1000 * 60 * 60 * 24));
      const progress = progressMap.get(getPlanningProgressKey(planning.job_step_id, planning.planned_date));

      return {
        id: `planning-${planning.planning_id}`,
        planning_id: planning.planning_id,
        step: planning.jobStep!.step!.step_name,
        day: dayDiff + 1,
        jobId: planning.jobStep!.job!.job_number,
        qty: planning.planned_quantity,
        color: getStepColor(planning.jobStep!.step!.step_name),
        date: getApiDateOnly(planning.planned_date),
        job_step_id: planning.job_step_id,
        minutesPerUnit: jobStepsData.find((jobStep) => jobStep.job_step_id === planning.job_step_id)?.minutes_per_unit ?? null,
        dueDate: planning.jobStep?.job?.end_date ? getApiDateOnly(planning.jobStep.job.end_date) : undefined,
        isOverdue: isPlanningOverdue(planning.planned_date, planning.jobStep?.job?.end_date),
        isNewAutoPlanned: newAutoPlanningIds.has(planning.planning_id),
        status: progress?.status,
        loggedQty: progress?.loggedQty ?? 0,
        totalPlannedQty: progress?.plannedQty ?? planning.planned_quantity,
      };
    });
}

export default function Planning() {
  const { canEdit } = usePermissions();
  const canEditPage = canEdit("/planning");

  const [viewMode, setViewMode] = useState<'week' | 'month'>('month');
  const [showStatusColors, setShowStatusColors] = useState<boolean>(false);
  const [currentWeekPage, setCurrentWeekPage] = useState<number>(0);
  const [events, setEvents] = useState<StepEvent[]>([]);
  const [selected, setSelected] = useState<JobItem | null>(null);
  const [qtyPopup, setQtyPopup] = useState<null | {
    step: string;
    day: number;
    jobId: string;
    job_step_id: number;
    date: string;
    left: number;
    top: number;
    containerLeft: number;
    containerRight: number;
  }>(null);
  const [qtyDraft, setQtyDraft] = useState<number>(0);
  const [deletePopup, setDeletePopup] = useState<null | {
    id: string;
    planning_id: number;
    left: number;
    top: number;
  }>(null);
  const [hiddenJobs, setHiddenJobs] = useState<Set<string>>(new Set());
  const [jobListFilter, setJobListFilter] = useState<JobListFilter>('all');
  const [jobSearchQuery, setJobSearchQuery] = useState<string>('');
  const [jobSortDescending, setJobSortDescending] = useState<boolean>(true);
  const [planningSearchQuery, setPlanningSearchQuery] = useState<string>('');
  const [planningCompactList, setPlanningCompactList] = useState<boolean>(false);
  const [planningSortField, setPlanningSortField] = useState<PlanningSortField>('date');
  const [planningSortDescending, setPlanningSortDescending] = useState<boolean>(true);
  const [locatingPlanningId, setLocatingPlanningId] = useState<number | null>(null);
  const [isAutoPlanLoading, setIsAutoPlanLoading] = useState<boolean>(false);
  const [autoPlanProcessedCount, setAutoPlanProcessedCount] = useState<number>(0);
  const [autoPlanTotalCount, setAutoPlanTotalCount] = useState<number>(0);
  const [activeAutoPlanLabel, setActiveAutoPlanLabel] = useState<string | null>(null);
  const [autoPlanFeedback, setAutoPlanFeedback] = useState<AutoPlanFeedbackState>({
    open: false,
    tone: 'info',
    title: '',
    message: '',
    details: [],
  });
  const [clearPlanningDialog, setClearPlanningDialog] = useState<ClearPlanningDialogState>({
    open: false,
    job: null,
  });
  const [isClearPlanningLoading, setIsClearPlanningLoading] = useState<boolean>(false);

  // Data from API
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [steps, setSteps] = useState<{ key: string; color: string }[]>([]);
  const [stepsData, setStepsData] = useState<Step[]>([]); // Add raw steps data
  const [jobSteps, setJobSteps] = useState<JobStep[]>([]);
  const [plannings, setPlannings] = useState<Planning[]>([]);
  const [productionLogs, setProductionLogs] = useState<ProductionLog[]>([]);
  const [newAutoPlanningMarkers, setNewAutoPlanningMarkers] = useState<AutoPlanningMarkerMap>(() => loadAutoPlanningMarkerMap());
  const [loading, setLoading] = useState(true);

  const [currentDate, setCurrentDate] = useState<Date>(
    startOfMonth(new Date())
  );

  const newAutoPlanningIds = useMemo(
    () => new Set(Object.keys(newAutoPlanningMarkers).map((planningId) => Number(planningId))),
    [newAutoPlanningMarkers]
  );

  const showAutoPlanFeedback = (
    tone: AutoPlanFeedbackTone,
    title: string,
    message: string,
    details: string[] = []
  ) => {
    const normalizedDetails = details
      .flatMap((detail) => String(detail).split('\n'))
      .map((detail) => detail.trim())
      .filter(Boolean);

    setAutoPlanFeedback({
      open: true,
      tone,
      title,
      message,
      details: normalizedDetails,
    });
  };

  const refreshPlanningState = async () => {
    const [planningsRes, productionLogsRes] = await Promise.all([
      apiFetch('/plannings'),
      apiFetch('/productionlogs'),
    ]);
    const [planningsData, productionLogsData]: [Planning[], ProductionLog[]] = await Promise.all([
      planningsRes.json(),
      productionLogsRes.json(),
    ]);
    setPlannings(planningsData);
    setProductionLogs(productionLogsData);
    setSelected(null);
  };

  useEffect(() => {
    setEvents(buildPlanningEvents(plannings, currentDate, jobSteps, productionLogs, newAutoPlanningIds));
  }, [plannings, currentDate, jobSteps, productionLogs, newAutoPlanningIds]);

  useEffect(() => {
    const prunedMarkers = pruneAutoPlanningMarkerMap(newAutoPlanningMarkers);

    if (Object.keys(prunedMarkers).length !== Object.keys(newAutoPlanningMarkers).length) {
      setNewAutoPlanningMarkers(prunedMarkers);
      return;
    }

    if (typeof window !== 'undefined') {
      window.localStorage.setItem(AUTO_PLAN_NEW_MARKERS_STORAGE_KEY, JSON.stringify(prunedMarkers));
    }
  }, [newAutoPlanningMarkers]);

  useEffect(() => {
    const pruneInterval = window.setInterval(() => {
      setNewAutoPlanningMarkers((previous) => pruneAutoPlanningMarkerMap(previous));
    }, 60 * 1000);

    return () => window.clearInterval(pruneInterval);
  }, []);

  // Listen for auto-planning creations triggered elsewhere (e.g., step edit)
  useEffect(() => {
    const handler = (ev: Event) => {
      try {
        // @ts-ignore custom event
        const detail = (ev as CustomEvent)?.detail;
        const created: number[] = Array.isArray(detail?.createdPlanningIds) ? detail.createdPlanningIds : [];
        if (created.length === 0) return;

        setNewAutoPlanningMarkers((prev) => {
          const next = { ...prev } as AutoPlanningMarkerMap;
          const now = new Date().toISOString();
          for (const id of created) {
            next[String(id)] = now;
          }
          if (typeof window !== 'undefined') {
            window.localStorage.setItem(AUTO_PLAN_NEW_MARKERS_STORAGE_KEY, JSON.stringify(next));
          }
          return next;
        });
        // Refresh plannings so newly-created planning records are loaded into state
        try {
          refreshPlanningState();
        } catch (err) {
          console.warn('Failed to refresh planning state after auto-plannings-updated', err);
        }
      } catch (err) {
        console.warn('Failed to handle auto-plannings-updated event', err);
      }
    };

    window.addEventListener('auto-plannings-updated', handler as EventListener);
    return () => window.removeEventListener('auto-plannings-updated', handler as EventListener);
  }, []);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [jobsRes, stepsRes, jobStepsRes, planningsRes, productionLogsRes] = await Promise.all([
          apiFetch('/jobs'),
          apiFetch('/steps'),
          apiFetch('/jobsteps'),
          apiFetch('/plannings'),
          apiFetch('/productionlogs'),
        ]);

        const jobsData: Job[] = await jobsRes.json();
        const stepsData: Step[] = await stepsRes.json();
        const jobStepsData: JobStep[] = await jobStepsRes.json();
        const planningsData: Planning[] = await planningsRes.json();
        const productionLogsData: ProductionLog[] = await productionLogsRes.json();

        // Transform jobs data
        const transformedJobs: JobItem[] = jobsData.map(job => ({
          id: job.job_number,
          job_id: job.job_id,
          quantity: job.total_quantity,
          due: new Date(job.end_date).toISOString().split('T')[0],
          customer_name: job.customer.fullname,
          createdAt: (job as any).created_date,
        }));

        // Transform steps data with colors
        const transformedSteps = stepsData.map(step => ({
          key: step.step_name,
          color: getStepColor(step.step_name),
        }));

        setJobs(transformedJobs);
        setSteps(transformedSteps);
        setStepsData(stepsData); // Store raw steps data
        setJobSteps(jobStepsData);
        setPlannings(planningsData);
        setProductionLogs(productionLogsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);



  // Get steps for a specific job based on JobStep
  const getJobSteps = (jobId: number) => {
    return jobSteps
      .filter(js => js.job_id === jobId)
      .map(js => {
        // Find step from stepsData using step_id
        const stepInfo = stepsData.find(s => s.step_id === js.step_id);
        const stepName = stepInfo?.step_name || '';
        
        return {
          job_step_id: js.job_step_id,
          step_id: js.step_id,
          minutes_per_unit: js.minutes_per_unit,
          key: stepName,
          color: getStepColor(stepName),
        };
      })
      .filter(s => s.key); // Filter out any empty step names
  };

  // คำนวนค่าสำหรับ week และ month view
  const startDate = startOfMonth(currentDate);
  const totalDaysInMonth = getDaysInMonth(startDate);
  
  let daysToShow: number;
  let weekStartDay: number;
  
  if (viewMode === 'week') {
    daysToShow = 7;
    weekStartDay = (currentWeekPage * 7) + 1;
    
    if (weekStartDay > totalDaysInMonth) {
      weekStartDay = 1;
      setCurrentWeekPage(0);
    }
    
    if (weekStartDay + 6 > totalDaysInMonth) {
      daysToShow = totalDaysInMonth - weekStartDay + 1;
    }
  } else {
    daysToShow = totalDaysInMonth;
    weekStartDay = 1;
  }

  const totalWeekPages = Math.ceil(totalDaysInMonth / 7);

  const navigatePrevious = () => {
    if (viewMode === 'week') {
      if (currentWeekPage > 0) {
        setCurrentWeekPage(currentWeekPage - 1);
      } else {
        setCurrentDate(d => addMonths(d, -1));
        const prevMonthDays = getDaysInMonth(addMonths(currentDate, -1));
        setCurrentWeekPage(Math.ceil(prevMonthDays / 7) - 1);
      }
    } else {
      setCurrentDate(d => addMonths(d, -1));
    }
  };

  const navigateNext = () => {
    if (viewMode === 'week') {
      if (currentWeekPage < totalWeekPages - 1) {
        setCurrentWeekPage(currentWeekPage + 1);
      } else {
        setCurrentDate(d => addMonths(d, 1));
        setCurrentWeekPage(0);
      }
    } else {
      setCurrentDate(d => addMonths(d, 1));
    }
  };

  const calcRemaining = (jobId: string) => {
    const job = jobs.find((j) => j.id === jobId);
    if (!job) return 0;
    const used = events
      .filter((e) => e.jobId === jobId)
      .reduce((sum, e) => sum + (e.qty || 0), 0);
    return Math.max(0, job.quantity - used);
  };

  const calcRemainingStep = (jobId: string, step: string) => {
    const job = jobs.find((j) => j.id === jobId);
    if (!job) return 0;
    const used = events
      .filter((e) => e.jobId === jobId && e.step === step)
      .reduce((sum, e) => sum + (e.qty || 0), 0);
    return Math.max(0, job.quantity - used);
  };

  const calcPlannedStep = (jobId: string, step: string) => {
    return events
      .filter((event) => event.jobId === jobId && event.step === step)
      .reduce((sum, event) => sum + (event.qty || 0), 0);
  };

  const isJobComplete = (jobId: string, evs: StepEvent[] = events) => {
    const job = jobs.find((j) => j.id === jobId);
    if (!job) return false;
    
    // Check completion based on JobSteps for this job
    const jobStepsForJob = getJobSteps(job.job_id);
    if (jobStepsForJob.length === 0) return false;
    
    return jobStepsForJob.every((s) => {
      const used = evs
        .filter((e) => e.jobId === jobId && e.step === s.key)
        .reduce((sum, e) => sum + (e.qty || 0), 0);
      return used >= job.quantity;
    });
  };

  const getJobPlanningStatus = (jobId: string, evs: StepEvent[] = events): Exclude<JobListFilter, 'all'> => {
    if (isJobComplete(jobId, evs)) {
      return 'complete';
    }

    const hasPlanning = evs.some((event) => event.jobId === jobId);
    return hasPlanning ? 'planned' : 'unplanned';
  };

  const hasJobPlanning = (jobId: string, evs: StepEvent[] = events) =>
    evs.some((event) => event.jobId === jobId);

  const jobStatusCounts = useMemo(() => {
    return jobs.reduce(
      (counts, job) => {
        const status = getJobPlanningStatus(job.id);
        counts[status] += 1;
        return counts;
      },
      {
        all: jobs.length,
        unplanned: 0,
        planned: 0,
        complete: 0,
      } as Record<JobListFilter, number>
    );
  }, [jobs, events, jobSteps, stepsData]);

  const filteredJobsList = useMemo(() => {
    let filtered = jobs.filter((job) => {
      if (jobListFilter === 'all') {
        return true;
      }

      return getJobPlanningStatus(job.id) === jobListFilter;
    });

    if (jobSearchQuery) {
      const query = jobSearchQuery.toLowerCase();
      filtered = filtered.filter(
        (j) =>
          j.id.toLowerCase().includes(query) ||
          j.customer_name.toLowerCase().includes(query) ||
          j.quantity.toString().includes(query)
      );
    }

    filtered.sort((a, b) => {
      const dateA = new Date(a.due).getTime();
      const dateB = new Date(b.due).getTime();
      return jobSortDescending ? dateB - dateA : dateA - dateB;
    });

    return filtered;
  }, [jobs, jobListFilter, jobSearchQuery, jobSortDescending, events, jobSteps, stepsData]);

  const filteredPlanningsList = useMemo(() => {
    let filtered = plannings.filter(rec => rec.jobStep?.job && rec.jobStep?.step);

    if (planningSearchQuery) {
      const query = planningSearchQuery.toLowerCase();
      filtered = filtered.filter(
        (rec) =>
          rec.jobStep?.job?.job_number.toLowerCase().includes(query) ||
          rec.jobStep?.step?.step_name.toLowerCase().includes(query) ||
          rec.planned_quantity.toString().includes(query)
      );
    }

    filtered.sort((a, b) => {
      let comparison = 0;

      if (planningSortField === 'job') {
        comparison = (a.jobStep?.job?.job_number ?? '').localeCompare(b.jobStep?.job?.job_number ?? '');
      } else if (planningSortField === 'step') {
        comparison = (a.jobStep?.step?.step_name ?? '').localeCompare(b.jobStep?.step?.step_name ?? '');
      } else if (planningSortField === 'quantity') {
        comparison = a.planned_quantity - b.planned_quantity;
      } else {
        const dateA = parseApiDate(a.planned_date).getTime();
        const dateB = parseApiDate(b.planned_date).getTime();
        comparison = dateA - dateB;
      }

      if (comparison === 0) {
        comparison = parseApiDate(a.planned_date).getTime() - parseApiDate(b.planned_date).getTime();
      }

      return planningSortDescending ? -comparison : comparison;
    });

    return filtered;
  }, [plannings, planningSearchQuery, planningSortDescending, planningSortField]);

  const filteredPlanningEvents = useMemo(() => {
    if (!planningSearchQuery.trim()) {
      return events;
    }

    const visiblePlanningIds = new Set(filteredPlanningsList.map((planning) => planning.planning_id));
    return events.filter(
      (event) => event.planning_id !== undefined && visiblePlanningIds.has(event.planning_id)
    );
  }, [events, filteredPlanningsList, planningSearchQuery]);

  const selectedPlanningRecord = useMemo(
    () => filteredPlanningsList.find((planning) => planning.planning_id === locatingPlanningId) ?? null,
    [filteredPlanningsList, locatingPlanningId]
  );

  const clearPlanningCount = useMemo(() => {
    if (!clearPlanningDialog.job) {
      return 0;
    }

    return events.filter((planningEvent) => planningEvent.jobId === clearPlanningDialog.job?.id).length;
  }, [clearPlanningDialog.job, events]);

  const handlePlanningSort = (field: PlanningSortField) => {
    if (planningSortField === field) {
      setPlanningSortDescending((previous) => !previous);
      return;
    }

    setPlanningSortField(field);
    setPlanningSortDescending(field === 'date' || field === 'quantity');
  };

  const handleLocatePlanningRecord = (planning: Planning) => {
    const currentScrollY = window.scrollY;
    const planningDate = parseApiDate(planning.planned_date);
    setCurrentDate(startOfMonth(planningDate));
    setCurrentWeekPage(Math.floor((planningDate.getDate() - 1) / 7));
    setLocatingPlanningId(planning.planning_id);

    requestAnimationFrame(() => {
      window.scrollTo({ top: currentScrollY, behavior: 'auto' });
    });
  };

  const askQuantity = (
    info: { step: string; day: number; jobId: string; date: string },
    anchor: {
      left: number;
      top: number;
      containerLeft: number;
      containerRight: number;
    },
  ) => {
    if (!canEditPage) return;
    
    const remainingStep = calcRemainingStep(info.jobId, info.step);
    if (remainingStep <= 0) return;
    setQtyDraft(remainingStep);
    
    // Find job_step_id
    const job = jobs.find(j => j.id === info.jobId);
    if (!job) return;

    // Find the specific JobStep for this job and step combination
    const jobStepsForJob = getJobSteps(job.job_id);
    const jobStep = jobStepsForJob.find(js => js.key === info.step);
    if (!jobStep) return;
    
    const popupWidth = 280;
    const popupHeight = 200;
    const margin = 16;
    
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    let left = anchor.left;
    let top = anchor.top;
    
    if (left + popupWidth + margin > viewportWidth) {
      left = anchor.left - popupWidth - margin;
    }
    if (left < margin) {
      left = margin;
    }
    
    if (top + popupHeight + margin > viewportHeight) {
      top = anchor.top - popupHeight - margin;
    }
    if (top < margin) {
      top = margin;
    }
    
    setQtyPopup({
      ...info,
      job_step_id: jobStep.job_step_id,
      left: left,
      top: top,
      containerLeft: anchor.containerLeft,
      containerRight: anchor.containerRight,
    });
  };

  const confirmQty = async () => {
    if (!canEditPage || !qtyPopup) return;
    
    const remainingStep = calcRemainingStep(qtyPopup.jobId, qtyPopup.step);
    const qty = Math.min(Math.max(1, qtyDraft), remainingStep);
    const color = steps.find((s) => s.key === qtyPopup.step)?.color;

    try {
      // Call API to create planning
      const response = await apiFetch('/plannings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          job_step_id: qtyPopup.job_step_id,
          planned_date: qtyPopup.date,
          planned_quantity: qty,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        toast({
          title: 'บันทึก Planning ไม่สำเร็จ',
          description: error.error || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล',
          variant: 'destructive',
        });
        return;
      }

      const newPlanning: Planning = await response.json();

      // Find job and step info to create complete Planning object
      const job = jobs.find(j => j.id === qtyPopup.jobId);
      const stepInfo = stepsData.find(s => s.step_name === qtyPopup.step);

      // Create complete Planning object with nested data
      const completePlanning: Planning = {
        ...newPlanning,
        jobStep: {
          job: {
            job_number: qtyPopup.jobId,
            end_date: job?.due,
          },
          step: {
            step_name: qtyPopup.step,
          },
        },
      };

      // Update local state
      setPlannings((prev) => [...prev, completePlanning]);
      setQtyPopup(null);
    } catch (error) {
      console.error('Error creating planning:', error);
      toast({
        title: 'บันทึก Planning ไม่สำเร็จ',
        description: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล',
        variant: 'destructive',
      });
    }
  };

  const removeEvent = async (id: string) => {
    if (!canEditPage) return;
    
    const event = events.find((e) => e.id === id);
    if (!event || !event.planning_id) return;

    try {
      const response = await apiFetch(`/plannings/${event.planning_id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        toast({
          title: 'ลบ Planning ไม่สำเร็จ',
          description: error.error || 'เกิดข้อผิดพลาดในการลบข้อมูล',
          variant: 'destructive',
        });
        return;
      }

      // Update local state
      setPlannings((prev) => prev.filter((p) => p.planning_id !== event.planning_id));
      setNewAutoPlanningMarkers((previous) => {
        const next = { ...previous };
        delete next[String(event.planning_id)];
        return next;
      });
      setDeletePopup(null); // Close delete popup
    } catch (error) {
      console.error('Error deleting planning:', error);
      toast({
        title: 'ลบ Planning ไม่สำเร็จ',
        description: 'เกิดข้อผิดพลาดในการลบข้อมูล',
        variant: 'destructive',
      });
    }
  };

  const moveEvent = async (eventId: string, newStep: string, newDate: string) => {
    if (!canEditPage) return;
    
    const event = events.find(e => e.id === eventId);
    if (!event || !event.planning_id) return;

    // Find new job_step_id based on the job and new step
    const job = jobs.find(j => j.id === event.jobId);
    if (!job) return;

    const jobStepsForJob = getJobSteps(job.job_id);
    const newJobStep = jobStepsForJob.find(js => js.key === newStep);
    if (!newJobStep) return;

    try {
      const response = await apiFetch(`/plannings/${event.planning_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          job_step_id: newJobStep.job_step_id,
          planned_date: newDate,
          planned_quantity: event.qty,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        toast({
          title: 'แก้ไข Planning ไม่สำเร็จ',
          description: error.error || 'เกิดข้อผิดพลาดในการแก้ไขข้อมูล',
          variant: 'destructive',
        });
        return;
      }

      const updatedPlanning: Planning = await response.json();
      const dueDate = job.due;

      setPlannings((prev) => {
        const planningIndex = prev.findIndex(p => p.planning_id === event.planning_id);
        if (planningIndex === -1) return prev;
        
        // Create complete Planning object
        const completePlanning: Planning = {
          ...updatedPlanning,
          jobStep: {
            job: {
              job_number: event.jobId,
              end_date: dueDate,
            },
            step: {
              step_name: newStep,
            },
          },
        };
        
        const newPlannings = [...prev];
        newPlannings[planningIndex] = completePlanning;
        return newPlannings;
      });
    } catch (error) {
      console.error('Error moving event:', error);
      toast({
        title: 'ย้าย Planning ไม่สำเร็จ',
        description: 'เกิดข้อผิดพลาดในการย้ายข้อมูล',
        variant: 'destructive',
      });
    }
  };

  const handleViewModeChange = (mode: 'week' | 'month') => {
    setViewMode(mode);
    if (mode === 'week') {
      setCurrentWeekPage(0);
    }
  };

  const handleToday = () => {
    const today = new Date();
    setCurrentDate(startOfMonth(today));
    setCurrentWeekPage(Math.floor((today.getDate() - 1) / 7));
  };

  const handleAutoPlanJob = async (job: JobItem) => {
    if (isAutoPlanLoading) return;

    try {
      setIsAutoPlanLoading(true);
      setAutoPlanTotalCount(1);
      setAutoPlanProcessedCount(0);
      setActiveAutoPlanLabel(job.id);

      const response = await apiFetch('/plannings/auto-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ job_id: job.job_id }),
      });

      const result = await response.json();

      if (!response.ok) {
        showAutoPlanFeedback(
          'error',
          `Auto Plan ไม่สำเร็จสำหรับ ${job.id}`,
          result.message || `เกิดข้อผิดพลาดในการวางแผน ${job.id}`
        );
        return;
      }

      setAutoPlanProcessedCount(1);
      setNewAutoPlanningMarkers((previous) => ({
        ...previous,
        ...Object.fromEntries(
          ((result.plannings ?? []) as Planning[]).map((planning) => [planning.planning_id, new Date().toISOString()])
        ),
      }));
      await refreshPlanningState();
      showAutoPlanFeedback(
        'success',
        `Auto Plan สำเร็จสำหรับ ${job.id}`,
        `สร้างแผนการแล้ว ${result.count || 0} records`
      );
    } catch (error) {
      console.error('Error calling auto-plan for job:', error);
      showAutoPlanFeedback('error', `Auto Plan ไม่สำเร็จสำหรับ ${job.id}`, `เกิดข้อผิดพลาดในการใช้ Auto Plan สำหรับ ${job.id}`);
    } finally {
      setIsAutoPlanLoading(false);
      setAutoPlanProcessedCount(0);
      setAutoPlanTotalCount(0);
      setActiveAutoPlanLabel(null);
    }
  };

  const handleAutoPlanAll = async () => {
    if (!filteredJobsList.length) {
      showAutoPlanFeedback('info', 'ยังไม่มี Job ให้สร้างแผน', 'ไม่มี Job ที่สามารถสร้างแผนการได้');
      return;
    }

    const incompleteJobs = filteredJobsList.filter(job => !isJobComplete(job.id));
    if (!incompleteJobs.length) {
      showAutoPlanFeedback('info', 'ทุก Job ถูกวางแผนแล้ว', 'ทั้งหมด Job เสร็จแล้ว');
      return;
    }

    try {
      setIsAutoPlanLoading(true);
      setAutoPlanTotalCount(incompleteJobs.length);
      setAutoPlanProcessedCount(0);
      setActiveAutoPlanLabel(`${incompleteJobs.length} jobs`);
      
      const response = await apiFetch('/plannings/auto-plan-batch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          job_ids: incompleteJobs.map((job) => job.job_id),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        let errorMessage = result.message || 'เกิดข้อผิดพลาดในการใช้ Auto Plan All';
        if (Array.isArray(result.failedJobs) && result.failedJobs.length > 0) {
          showAutoPlanFeedback(
            'error',
            'Auto Plan All ไม่สำเร็จ',
            errorMessage,
            result.failedJobs
          );
          return;
        }
        showAutoPlanFeedback('error', 'Auto Plan All ไม่สำเร็จ', errorMessage);
        return;
      }

      setAutoPlanProcessedCount(incompleteJobs.length);

      const totalCreated = result.count || 0;
      const successCount = result.jobCount || 0;
      const failedJobs = Array.isArray(result.failedJobs) ? result.failedJobs : [];
      const priorityRecommendations: BatchPriorityRecommendation[] = Array.isArray(result.priorityRecommendations)
        ? result.priorityRecommendations
        : [];
      setNewAutoPlanningMarkers((previous) => ({
        ...previous,
        ...Object.fromEntries(
          ((result.plannings ?? []) as Planning[]).map((planning) => [planning.planning_id, new Date().toISOString()])
        ),
      }));

      await refreshPlanningState();

      let message = `✅ สำเร็จ: ${successCount}/${incompleteJobs.length} Jobs สร้างแผนการแล้ว (${totalCreated} Planning Records)`;
      const detailLines = [
        'Auto Plan All ใช้ AI แค่จัดลำดับความสำคัญของ jobs ก่อน แล้ว backend จะวางวันและจำนวนจริงตามกฎโรงงาน',
        ...priorityRecommendations.map((item) => {
          const priorityLabel = item.priority ?? 'fallback';
          return `${item.job_number} • ลำดับ ${priorityLabel} • ${item.reason}`;
        }),
        ...failedJobs,
      ];
      showAutoPlanFeedback(
        failedJobs.length > 0 ? 'info' : 'success',
        failedJobs.length > 0 ? 'Auto Plan All เสร็จสิ้นแบบมีบาง Job ไม่สำเร็จ' : 'Auto Plan All สำเร็จ',
        message,
        detailLines
      );
    } catch (error) {
      console.error('Error calling auto-plan:', error);
      showAutoPlanFeedback('error', 'Auto Plan All ไม่สำเร็จ', 'เกิดข้อผิดพลาดในการใช้ Auto Plan All');
    } finally {
      setIsAutoPlanLoading(false);
      setAutoPlanProcessedCount(0);
      setAutoPlanTotalCount(0);
      setActiveAutoPlanLabel(null);
    }
  };

  const handleClearJobPlanning = (job: JobItem) => {
    if (!canEditPage) return;
    if (!hasJobPlanning(job.id)) {
      toast({
        title: 'ยังไม่มี Planning',
        description: `ยังไม่มี planning สำหรับ ${job.id}`,
      });
      return;
    }

    setClearPlanningDialog({
      open: true,
      job,
    });
  };

  const confirmClearJobPlanning = async () => {
    const job = clearPlanningDialog.job;
    if (!job || isClearPlanningLoading) {
      return;
    }

    try {
      setIsClearPlanningLoading(true);
      const response = await apiFetch(`/plannings/job/${job.job_id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (!response.ok) {
        toast({
          title: 'ลบ Planning ของ Job ไม่สำเร็จ',
          description: result.error || `เกิดข้อผิดพลาดในการลบ planning ของ ${job.id}`,
          variant: 'destructive',
        });
        return;
      }

      await refreshPlanningState();
      setNewAutoPlanningMarkers((previous) => {
        const next = { ...previous };
        events
          .filter((planningEvent) => planningEvent.jobId === job.id && planningEvent.planning_id !== undefined)
          .forEach((planningEvent) => {
            delete next[String(planningEvent.planning_id)];
          });
        return next;
      });
      setClearPlanningDialog({ open: false, job: null });
      toast({
        title: 'ลบ Planning เรียบร้อยแล้ว',
        description: `ลบ planning ของ ${job.id} แล้ว ${result.count || 0} records`,
      });
    } catch (error) {
      console.error('Error clearing job planning:', error);
      toast({
        title: 'ลบ Planning ของ Job ไม่สำเร็จ',
        description: `เกิดข้อผิดพลาดในการลบ planning ของ ${job.id}`,
        variant: 'destructive',
      });
    } finally {
      setIsClearPlanningLoading(false);
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-lg">Loading...</div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="relative min-w-0 max-w-full space-y-4">
        {(selected || deletePopup) && (
          <div className="fixed inset-0 bg-black/30 z-20 pointer-events-none" />
        )}
        
        {qtyPopup && (
          <div className="fixed inset-0 bg-black/10 z-[90] pointer-events-none" />
        )}
        
        <div className="rounded-xl bg-gradient-to-r from-[hsl(var(--brand-start))] to-[hsl(var(--brand-end))] text-white p-6 shadow">
          <h1 className="text-2xl font-bold">Planning</h1>
        </div>
        
        <div className="relative z-30 min-w-0 max-w-full overflow-hidden rounded-lg border bg-white p-4">
            <div className="mb-3 flex flex-col gap-3 font-semibold lg:flex-row lg:items-center lg:justify-between">
              <div>
                {viewMode === 'month' 
                  ? `${format(startDate, "MMMM yyyy")} (${daysToShow} days)`
                  : `${format(startDate, "MMMM yyyy")} - Week ${currentWeekPage + 1}/${totalWeekPages} (Days ${weekStartDay}-${weekStartDay + daysToShow - 1})`
                }
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center rounded-lg bg-slate-100 p-1">
                  <button
                    className={`px-3 py-1 text-xs rounded-md transition-colors ${
                      viewMode === 'week'
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                    onClick={() => handleViewModeChange('week')}
                  >
                    Week
                  </button>
                  <button
                    className={`px-3 py-1 text-xs rounded-md transition-colors ${
                      viewMode === 'month'
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                    onClick={() => handleViewModeChange('month')}
                  >
                    Month
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setShowStatusColors((previous) => !previous)}
                  className={cn(
                    "rounded-lg border px-3 py-1.5 text-xs font-medium transition-all duration-200",
                    showStatusColors
                      ? "border-amber-300 bg-gradient-to-br from-amber-200 to-orange-200 text-amber-950 shadow-[0_8px_20px_rgba(245,158,11,0.18)] hover:from-amber-200 hover:to-orange-300"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  )}
                  title="Toggle planning status colors"
                >
                  Stat
                </button>

                <div className="flex items-center gap-2">
                  <button
                    className="px-3 py-1 rounded border bg-slate-900 text-white hover:bg-slate-800"
                    onClick={handleToday}
                  >
                    Today
                  </button>
                  <button
                    className="px-2 py-1 rounded border hover:bg-slate-50"
                    onClick={navigatePrevious}
                  >
                    {"<"}
                  </button>
                  <button
                    className="px-2 py-1 rounded border hover:bg-slate-50"
                    onClick={navigateNext}
                  >
                    {">"}
                  </button>
                </div>

                {viewMode === 'week' && (
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalWeekPages }, (_, i) => (
                      <button
                        key={i}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          i === currentWeekPage
                            ? 'bg-[hsl(var(--brand-end))]'
                            : 'bg-slate-300 hover:bg-slate-400'
                        }`}
                        onClick={() => setCurrentWeekPage(i)}
                        title={`Week ${i + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <div className="mb-3 text-xs text-slate-600 bg-slate-50 rounded-lg p-2">
              💡 <strong>Tips:</strong> Drag steps from job list to schedule them, or drag existing scheduled items to move them to different days/steps
            </div>

            {showStatusColors && (
              <div className="mb-3 flex animate-in fade-in-0 slide-in-from-top-1 flex-wrap items-center gap-2 rounded-lg border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 px-3 py-2 text-xs text-slate-700 duration-200">
                <span className="font-semibold text-slate-800">Status:</span>
                <span className="inline-flex items-center gap-1 rounded-full bg-green-200 px-2 py-0.5 text-green-950">Done</span>
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-200 px-2 py-0.5 text-amber-950">Working</span>
                <span className="inline-flex items-center gap-1 rounded-full bg-rose-200 px-2 py-0.5 text-rose-950">Delay</span>
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-200 px-2 py-0.5 text-slate-700">Pending</span>
              </div>
            )}
            
            <div className="relative min-w-0 max-w-full overflow-x-auto">
              <StepWeekGrid
                startDate={addDays(startDate, weekStartDay - 1)}
                steps={steps}
                events={filteredPlanningEvents}
                locatingPlanningId={locatingPlanningId}
                viewMode={viewMode}
                daysToShow={daysToShow}
                showStatusColors={showStatusColors}
                onAskQuantity={askQuantity}
                onRemoveEvent={removeEvent}
                onMoveEvent={moveEvent}
                onLocatePlanningSeen={(planningId) => {
                  if (planningId === locatingPlanningId) {
                    setLocatingPlanningId(null);
                  }
                }}
                onAskDelete={(ev, anchor) =>
                  setDeletePopup({
                    id: ev.id,
                    planning_id: ev.planning_id || 0,
                    left: anchor.left,
                    top: anchor.top,
                  })
                }
              />
            </div>
        </div>
        
        {qtyPopup && (
          <div
            className="fixed z-[100]"
            style={{ left: qtyPopup.left, top: qtyPopup.top }}
          >
            <div className="rounded-2xl border-2 border-slate-200 bg-white shadow-2xl w-72 ring-1 ring-black/5 overflow-hidden">
              <div className="bg-gradient-to-r from-[hsl(var(--brand-start))] to-[hsl(var(--brand-end))] text-white p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">Set Quantity</h3>
                    <p className="text-xs opacity-90 mt-1">
                      {qtyPopup.jobId} • {qtyPopup.step}
                    </p>
                  </div>
                  <button
                    className="text-white/80 hover:text-white hover:bg-white/10 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
                    onClick={() => setQtyPopup(null)}
                    aria-label="Close"
                  >
                    ×
                  </button>
                </div>
              </div>

              <div className="p-4 space-y-4">
                <div className="text-xs text-slate-500 bg-slate-50 rounded-lg p-2">
                  📅 {format(
                    new Date(qtyPopup.date),
                    "EEEE, MMMM dd, yyyy",
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 block">
                    Quantity
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={calcRemainingStep(qtyPopup.jobId, qtyPopup.step)}
                    className="w-full h-12 border-2 border-slate-200 rounded-xl px-4 text-lg font-semibold focus:outline-none focus:border-[hsl(var(--brand-end))] focus:ring-4 focus:ring-[hsl(var(--brand-end))]/20 transition-all"
                    value={qtyDraft}
                    onChange={(e) =>
                      setQtyDraft(parseInt(e.target.value || "0", 10) || 0)
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") confirmQty();
                      if (e.key === "Escape") setQtyPopup(null);
                    }}
                    placeholder="Enter quantity..."
                    autoFocus
                  />
                  <div className="text-xs text-slate-500 flex items-center justify-between">
                    <span>Available: {calcRemainingStep(qtyPopup.jobId, qtyPopup.step)} pieces</span>
                    <span className="text-emerald-600">
                      {qtyDraft > 0 && qtyDraft <= calcRemainingStep(qtyPopup.jobId, qtyPopup.step) ? '✓' : ''}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => setQtyPopup(null)}
                    className="flex-1 border-2"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={confirmQty}
                    disabled={!canEditPage || qtyDraft <= 0 || qtyDraft > calcRemainingStep(qtyPopup.jobId, qtyPopup.step)}
                    className="flex-1 bg-[hsl(var(--brand-end))] hover:bg-[hsl(var(--brand-end))]/90"
                  >
                    Confirm
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {deletePopup && (
          <div
            className="fixed z-[100]"
            style={{ left: deletePopup.left, top: deletePopup.top }}
          >
            <div className="rounded-lg border bg-white p-2 shadow-xl">
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  removeEvent(deletePopup.id);
                  setDeletePopup(null);
                }}
                disabled={!canEditPage}
              >
                Delete
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDeletePopup(null)}
                className="ml-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        <div className="mt-8 grid min-w-0 max-w-full grid-cols-1 gap-6 xl:grid-cols-4">
          <div className="relative min-w-0 max-w-full overflow-hidden rounded-lg border bg-white p-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="font-semibold">Job list</div>
              <div className="text-xs text-slate-500">{filteredJobsList.length} jobs</div>
            </div>
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="ค้นหา job, customer, จำนวน"
                  value={jobSearchQuery}
                  onChange={(e) => setJobSearchQuery(e.target.value)}
                  className="w-full border rounded-lg py-2 pl-8 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--brand-end))]/20"
                />
              </div>
              <button
                onClick={() => setJobSortDescending(!jobSortDescending)}
                className="flex items-center gap-1 px-3 py-2 rounded-lg border hover:bg-slate-50 transition-colors"
                title="Sort by due date"
              >
                <ArrowUpDown className="h-4 w-4" />
              </button>
            </div>
            <div className="mb-3 grid grid-cols-2 gap-2 xl:grid-cols-4">
              {[
                { key: 'all', label: 'ทั้งหมด' },
                { key: 'unplanned', label: 'ยังไม่วางแผน' },
                { key: 'planned', label: 'วางแผนแล้ว' },
                { key: 'complete', label: 'เสร็จแล้ว' },
              ].map((filter) => (
                <button
                  key={filter.key}
                  type="button"
                  onClick={() => setJobListFilter(filter.key as JobListFilter)}
                  className={`flex items-center justify-between rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
                    jobListFilter === filter.key
                      ? 'border-slate-900 bg-slate-900 text-white'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span>{filter.label}</span>
                  <span className={`rounded-full px-2 py-0.5 text-[11px] ${
                    jobListFilter === filter.key
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    {jobStatusCounts[filter.key as JobListFilter]}
                  </span>
                </button>
              ))}
            </div>
            <div className="max-h-[32rem] min-h-[482px] space-y-2 overflow-y-auto overflow-x-hidden pr-1">
              {filteredJobsList
                .map((job) => {
                  const jobStepsForJob = getJobSteps(job.job_id);
                  const jobComplete = isJobComplete(job.id);
                  const jobStatus = getJobPlanningStatus(job.id);
                  const jobHasPlanning = hasJobPlanning(job.id);

                  return (
                    <div key={job.id}>
                      <div className={`rounded-lg border ${jobComplete ? 'border-emerald-200 bg-emerald-50' : 'border-slate-200 bg-white'} overflow-hidden`}>
                        <button
                          onClick={() => setSelected(job)}
                          className="w-full px-3 py-3 text-left hover:bg-slate-50/70 relative z-30"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 min-w-0">
                              <div className="min-w-0 truncate font-medium">{job.id}</div>
                              {job.createdAt && <NewItemBadge dateValue={job.createdAt} />}
                            </div>
                            <span className={`text-xs rounded-full px-2 py-0.5 ${
                              jobStatus === 'complete'
                                ? 'bg-emerald-100 text-emerald-700'
                                : jobStatus === 'planned'
                                  ? 'bg-amber-100 text-amber-700'
                                  : 'bg-slate-100 text-slate-600'
                            }`}>
                              {jobStatus === 'complete'
                                ? '✓ Complete'
                                : jobStatus === 'planned'
                                  ? 'Planned'
                                  : 'Unplanned'}
                            </span>
                          </div>
                          <div className="truncate text-xs text-slate-500">
                            {job.quantity} pcs • {job.customer_name}
                          </div>
                          <div className="truncate text-xs text-slate-400">
                            Due {job.due}
                          </div>
                        </button>
                        {(!jobComplete || jobHasPlanning) && (
                          <div className="border-t border-slate-200 px-3 py-2">
                            <div className="flex gap-2">
                              {!jobComplete && (
                                <button
                                  type="button"
                                  onClick={() => handleAutoPlanJob(job)}
                                  disabled={!canEditPage || isAutoPlanLoading}
                                  className="flex w-full items-center justify-center gap-2 rounded-md bg-slate-900 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                  <Sparkles className={`h-3.5 w-3.5 ${isAutoPlanLoading && activeAutoPlanLabel === job.id ? 'animate-spin' : ''}`} />
                                  {isAutoPlanLoading && activeAutoPlanLabel === job.id ? 'Planning...' : 'Auto Plan Job'}
                                </button>
                              )}
                              {jobHasPlanning && (
                                <button
                                  type="button"
                                  onClick={() => handleClearJobPlanning(job)}
                                  disabled={!canEditPage}
                                  className="flex w-full items-center justify-center rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-medium text-rose-700 transition-colors hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                  Clear
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                      {selected?.id === job.id && (
                        <div className="job-detail-popup">
                          <div className="job-detail-popup-scroll">
                            <div className="job-detail-header">
                              <div className="job-detail-header-content">
                                <div className="job-detail-title-wrapper">
                                  <div className="job-detail-icon">
                                    {job.id.substring(0, 2)}
                                  </div>
                                  <div>
                                    <div className="job-detail-title">{job.id}</div>
                                    <div className="job-detail-subtitle">
                                      {job.customer_name}
                                    </div>
                                  </div>
                                </div>
                                <button
                                  className="job-detail-close"
                                  onClick={() => setSelected(null)}
                                  aria-label="Close"
                                >
                                  ×
                                </button>
                              </div>
                            </div>

                            <div className="job-detail-content">
                              <div className="job-info-grid">
                                <div className="job-info-item">
                                  <div className="job-info-label">📋 Job ID</div>
                                  <div className="job-info-value">{job.id}</div>
                                </div>
                                <div className="job-info-item">
                                  <div className="job-info-label">📦 Quantity</div>
                                  <div className="job-info-value">
                                    {calcRemaining(job.id)} / {job.quantity}
                                  </div>
                                </div>
                                <div className="job-info-item job-info-full">
                                  <div className="job-info-label">📅 Due Date</div>
                                  <div className="job-info-value">{job.due}</div>
                                </div>
                                <div className="job-info-item job-info-full">
                                  <div className="job-info-label">👤 Customer</div>
                                  <div className="job-info-value">{job.customer_name}</div>
                                </div>
                              </div>

                              <div className="job-steps-section">
                                <div className="job-steps-header">
                                  <div className="job-steps-title">Steps</div>
                                  <div className="job-steps-badge">
                                    Drag to schedule
                                  </div>
                                </div>

                                <div className="job-steps-grid">
                                  {jobStepsForJob
                                    .map((s) => {
                                      const plannedQuantity = Math.min(calcPlannedStep(job.id, s.key), job.quantity);
                                      const remainingQuantity = Math.max(0, job.quantity - plannedQuantity);
                                      const stepComplete = plannedQuantity >= job.quantity;

                                      return (
                                        <div
                                          key={s.job_step_id}
                                          draggable={!stepComplete}
                                          onDragStart={(e) => {
                                            if (stepComplete) {
                                              e.preventDefault();
                                              return;
                                            }
                                            e.dataTransfer.setData("text/step", s.key);
                                            e.dataTransfer.setData("text/job", job.id);
                                          }}
                                          className={cn("job-step-item", stepComplete && "is-complete")}
                                          style={{ backgroundColor: s.color }}
                                        >
                                          <div className="job-step-name">{s.key}</div>
                                          <div className={cn("job-step-progress", stepComplete && "is-complete")}>
                                            {stepComplete ? '✓ ' : ''}{plannedQuantity}/{job.quantity} planned
                                          </div>
                                          {!stepComplete && (
                                            <div className="job-step-remaining">
                                              {remainingQuantity} remaining
                                            </div>
                                          )}
                                        </div>
                                      );
                                    })}
                                  {jobStepsForJob.length === 0 && (
                                    <div className="job-steps-complete">
                                      <div className="job-steps-complete-icon">⚠️</div>
                                      <div className="job-steps-complete-text">
                                        No steps configured for this job
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div className="job-detail-actions">
                                {!isJobComplete(job.id) && (
                                  <button
                                    className="job-detail-done-btn"
                                    onClick={() => handleAutoPlanJob(job)}
                                    disabled={!canEditPage || isAutoPlanLoading}
                                  >
                                    {isAutoPlanLoading && activeAutoPlanLabel === job.id ? 'Planning...' : 'Auto Plan Job'}
                                  </button>
                                )}
                                {jobHasPlanning && (
                                  <button
                                    className="job-detail-done-btn"
                                    onClick={() => handleClearJobPlanning(job)}
                                    disabled={!canEditPage}
                                  >
                                    Clear Planning
                                  </button>
                                )}
                                <button
                                  className="job-detail-done-btn"
                                  onClick={() => {
                                    if (isJobComplete(job.id)) {
                                      setHiddenJobs((prev) => new Set(prev).add(job.id));
                                    }
                                    setSelected(null);
                                  }}
                                >
                                  {isJobComplete(job.id) ? 'Done' : 'Close'}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              {filteredJobsList.length === 0 && (
                <div className="rounded-lg border border-dashed border-slate-200 px-3 py-6 text-center text-sm text-slate-400">
                  No jobs match the selected filter.
                </div>
              )}
            </div>
          </div>

          <div className="xl:col-span-3 min-w-0 max-w-full overflow-hidden rounded-lg border bg-white p-4 xl:w-[1332px] xl:h-[694px]">
            <div className="mb-3 flex items-center justify-between">
              <div className="font-semibold">Planning Records</div>
              <button
                onClick={handleAutoPlanAll}
                disabled={!canEditPage || filteredJobsList.every(j => isJobComplete(j.id)) || isAutoPlanLoading}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                title="Auto Plan All uses AI only to prioritize jobs before backend creates the actual schedule"
              >
                <Sparkles className={`h-4 w-4 ${isAutoPlanLoading ? 'animate-spin' : ''}`} />
                {isAutoPlanLoading ? `Planning ${autoPlanTotalCount} jobs...` : 'Auto Plan All'}
              </button>
            </div>
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="ค้นหา job, step, จำนวน"
                  value={planningSearchQuery}
                  onChange={(e) => setPlanningSearchQuery(e.target.value)}
                  className="w-full border rounded-lg py-2 pl-8 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--brand-end))]/20"
                />
              </div>
              <button
                onClick={() => setPlanningCompactList(!planningCompactList)}
                className="flex items-center gap-1 px-3 py-2 rounded-lg border hover:bg-slate-50 transition-colors"
                title={planningCompactList ? 'Expanded list' : 'Compact list'}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
            {selectedPlanningRecord && (
              <div className="planning-records-locate-banner mb-3 rounded-lg border px-3 py-2 text-xs">
                Locating {selectedPlanningRecord.jobStep?.job?.job_number} / {selectedPlanningRecord.jobStep?.step?.step_name} on {parseApiDate(selectedPlanningRecord.planned_date).toLocaleDateString('th-TH')}.
                {isPlanningOverdue(selectedPlanningRecord.planned_date, selectedPlanningRecord.jobStep?.job?.end_date) && (
                  <span className="ml-2 inline-flex items-center gap-1 text-red-600">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    Over due date
                  </span>
                )}
                Move the pointer to the highlighted cell in the planning grid to clear this marker.
              </div>
            )}
            <div className="max-w-full min-h-[530px] overflow-x-auto xl:h-[calc(626px-96px)] overflow-y-auto">
              <table className="min-w-[520px] w-full text-sm border">
                <thead>
                  <tr className="bg-slate-100">
                    <th className="border px-2 py-1">
                      <button
                        type="button"
                        onClick={() => handlePlanningSort('job')}
                        className="flex w-full items-center justify-between gap-2 text-left font-medium hover:text-slate-900"
                      >
                        <span>Job ID</span>
                        <ArrowUpDown className={`h-4 w-4 ${planningSortField === 'job' ? 'text-slate-900' : 'text-slate-400'}`} />
                      </button>
                    </th>
                    <th className="border px-2 py-1">
                      <button
                        type="button"
                        onClick={() => handlePlanningSort('step')}
                        className="flex w-full items-center justify-between gap-2 text-left font-medium hover:text-slate-900"
                      >
                        <span>Step</span>
                        <ArrowUpDown className={`h-4 w-4 ${planningSortField === 'step' ? 'text-slate-900' : 'text-slate-400'}`} />
                      </button>
                    </th>
                    <th className="border px-2 py-1">
                      <button
                        type="button"
                        onClick={() => handlePlanningSort('date')}
                        className="flex w-full items-center justify-between gap-2 text-left font-medium hover:text-slate-900"
                      >
                        <span>Date</span>
                        <ArrowUpDown className={`h-4 w-4 ${planningSortField === 'date' ? 'text-slate-900' : 'text-slate-400'}`} />
                      </button>
                    </th>
                    <th className="border px-2 py-1">
                      <button
                        type="button"
                        onClick={() => handlePlanningSort('quantity')}
                        className="flex w-full items-center justify-between gap-2 text-left font-medium hover:text-slate-900"
                      >
                        <span>Quantity</span>
                        <ArrowUpDown className={`h-4 w-4 ${planningSortField === 'quantity' ? 'text-slate-900' : 'text-slate-400'}`} />
                      </button>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPlanningsList
                    .map((rec) => (
                      <tr
                        key={rec.planning_id}
                        onClick={() => handleLocatePlanningRecord(rec)}
                        className={cn(
                          'planning-record-row cursor-pointer',
                          locatingPlanningId === rec.planning_id && 'is-locating'
                        )}
                      >
                        <td className="px-2 py-1 border">
                          <span className="inline-flex items-center gap-2">
                            {rec.jobStep!.job!.job_number}
                            {newAutoPlanningIds.has(rec.planning_id) && (
                              <NewItemBadge forceShow variant="square" className="ml-1" />
                            )}
                          </span>
                        </td>
                        <td className="px-2 py-1 border">
                          <span className="inline-flex items-center gap-2">
                            {rec.jobStep!.step!.step_name}
                            {isPlanningOverdue(rec.planned_date, rec.jobStep?.job?.end_date) && (
                              <AlertTriangle className="h-4 w-4 text-red-600" />
                            )}
                          </span>
                        </td>
                        <td className="px-2 py-1 border">
                          {parseApiDate(rec.planned_date).toLocaleDateString('th-TH')}
                        </td>
                        <td className="px-2 py-1 border">{rec.planned_quantity}</td>
                      </tr>
                    ))}
                  {filteredPlanningsList.length === 0 && (
                    <tr>
                      <td colSpan={4} className="text-center text-slate-400 py-2">
                        No planning records found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Loading Modal */}
        {isAutoPlanLoading && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4">
              {/* Spinner */}
              <div className="flex justify-center mb-6">
                <div className="relative w-16 h-16">
                  <div className="absolute inset-0 rounded-full border-4 border-slate-200"></div>
                  <div 
                    className="absolute inset-0 rounded-full border-4 border-transparent border-t-violet-600 border-r-violet-600 animate-spin"
                    style={{ animation: 'spin 1s linear infinite' }}
                  ></div>
                </div>
              </div>

              {/* Text Content */}
              <div className="text-center space-y-3">
                <h3 className="text-lg font-semibold text-slate-900">
                  Processing Plans...
                </h3>
                <p className="text-sm text-slate-600">
                  Generating optimal production schedule
                </p>

                {/* Progress Counter */}
                <div className="pt-2">
                  <p className="text-2xl font-bold text-violet-600">
                    {autoPlanTotalCount > 1 ? autoPlanTotalCount : activeAutoPlanLabel || autoPlanTotalCount}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {autoPlanTotalCount > 1 ? 'Jobs in one AI request' : 'Job being planned'}
                  </p>
                </div>

                {/* Helper Text */}
                <p className="text-xs text-slate-500 pt-2 leading-relaxed">
                  {autoPlanTotalCount > 1
                    ? "AI is calculating all selected jobs in one request. Please don't close this window."
                    : "AI is calculating the selected job. Please don't close this window."}
                </p>
              </div>

              {/* Progress Bar */}
              <div className="mt-6 w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-violet-600 to-purple-600 h-full w-full rounded-full animate-pulse"
                ></div>
              </div>
            </div>
          </div>
        )}

        {/* Spin Animation Keyframes */}
        <style>{`
          @keyframes spin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
        `}</style>

        <Dialog
          open={clearPlanningDialog.open}
          onOpenChange={(open) => {
            if (isClearPlanningLoading) {
              return;
            }

            setClearPlanningDialog({
              open,
              job: open ? clearPlanningDialog.job : null,
            });
          }}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader className="space-y-3 text-left">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-100 text-rose-600">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <DialogTitle>Clear planning records</DialogTitle>
                <DialogDescription>
                  {clearPlanningDialog.job
                    ? `ลบ planning ทั้งหมดของ ${clearPlanningDialog.job.id} ใช่หรือไม่?`
                    : 'ยืนยันการลบ planning ทั้งหมดของ job นี้'}
                </DialogDescription>
              </div>
            </DialogHeader>

            {clearPlanningDialog.job && (
              <div className="rounded-xl border border-rose-100 bg-rose-50/80 px-4 py-3 text-sm text-rose-900">
                <div className="font-medium">{clearPlanningDialog.job.id}</div>
                <div className="mt-1 text-xs text-rose-700">
                  {clearPlanningCount} planning records will be removed from the grid and planning records list.
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setClearPlanningDialog({ open: false, job: null })}
                disabled={isClearPlanningLoading}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={confirmClearJobPlanning}
                disabled={isClearPlanningLoading || !clearPlanningDialog.job}
              >
                {isClearPlanningLoading ? 'Clearing...' : 'Clear Planning'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog
          open={autoPlanFeedback.open}
          onOpenChange={(open) => setAutoPlanFeedback((current) => ({ ...current, open }))}
        >
          <DialogContent className="auto-plan-feedback-dialog border-0 p-0 overflow-hidden sm:max-w-2xl">
            <div
              className={cn(
                'auto-plan-feedback-header',
                autoPlanFeedback.tone === 'success' && 'is-success',
                autoPlanFeedback.tone === 'error' && 'is-error',
                autoPlanFeedback.tone === 'info' && 'is-info'
              )}
            >
              <div className="auto-plan-feedback-icon-wrap">
                {autoPlanFeedback.tone === 'success' && <CheckCircle2 className="h-6 w-6" />}
                {autoPlanFeedback.tone === 'error' && <AlertTriangle className="h-6 w-6" />}
                {autoPlanFeedback.tone === 'info' && <Info className="h-6 w-6" />}
              </div>
              <DialogHeader className="space-y-1 text-left">
                <DialogTitle className="auto-plan-feedback-title">{autoPlanFeedback.title}</DialogTitle>
                <DialogDescription className="auto-plan-feedback-description">
                  {autoPlanFeedback.message}
                </DialogDescription>
              </DialogHeader>
            </div>

            {autoPlanFeedback.details.length > 0 && (
              <div className="auto-plan-feedback-body">
                <div className="auto-plan-feedback-body-label">Details</div>
                <div className="auto-plan-feedback-list">
                  {autoPlanFeedback.details.map((detail, index) => (
                    <div key={`${detail}-${index}`} className="auto-plan-feedback-item">
                      {detail}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="auto-plan-feedback-actions">
              <Button
                type="button"
                onClick={() => setAutoPlanFeedback((current) => ({ ...current, open: false }))}
                className="auto-plan-feedback-button"
              >
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}
