import "@/styles/planning.css";
import { useEffect, useState, useMemo } from "react";
import { parseISO, startOfMonth, addMonths, getDaysInMonth, addDays, format } from "date-fns";
import StepWeekGrid, { StepEvent } from "../components/planning/StepWeekGrid";
import AppLayout from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { usePermissions } from "@/App";
import { List, ArrowUpDown, Search, Sparkles } from "lucide-react";
import NewItemBadge from "@/components/common/NewItemBadge";

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
    };
    step?: {
      step_name: string;
    };
  };
}

interface JobItem {
  id: string;
  job_id: number;
  quantity: number;
  due: string;
  customer_name: string;
  createdAt?: string;
}

const stepColorPalette: Record<string, string> = {
  "Cutting": "#86efac",
  "Heating": "#fca5a5",
  "Embroidering": "#fde68a",
  "Sewing": "#a5b4fc",
  "QC": "#67e8f9",
  "Pack": "#f0abfc",
};

// API Base URL
const API_BASE_URL = 'http://localhost:4000/api';

export default function Planning() {
  const { canEdit } = usePermissions();
  const canEditPage = canEdit("/planning");

  const [viewMode, setViewMode] = useState<'week' | 'month'>('month');
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
  const [showCompletedJobs, setShowCompletedJobs] = useState<boolean>(true);
  const [jobSearchQuery, setJobSearchQuery] = useState<string>('');
  const [jobSortDescending, setJobSortDescending] = useState<boolean>(true);
  const [planningSearchQuery, setPlanningSearchQuery] = useState<string>('');
  const [planningCompactList, setPlanningCompactList] = useState<boolean>(false);
  const [planningSortDescending, setPlanningSortDescending] = useState<boolean>(true);
  const [isAutoPlanLoading, setIsAutoPlanLoading] = useState<boolean>(false);
  const [autoPlanProcessedCount, setAutoPlanProcessedCount] = useState<number>(0);
  const [autoPlanTotalCount, setAutoPlanTotalCount] = useState<number>(0);

  // Data from API
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [steps, setSteps] = useState<{ key: string; color: string }[]>([]);
  const [stepsData, setStepsData] = useState<Step[]>([]); // Add raw steps data
  const [jobSteps, setJobSteps] = useState<JobStep[]>([]);
  const [plannings, setPlannings] = useState<Planning[]>([]);
  const [loading, setLoading] = useState(true);

  const [currentDate, setCurrentDate] = useState<Date>(
    startOfMonth(new Date())
  );

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [jobsRes, stepsRes, jobStepsRes, planningsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/jobs`),
          fetch(`${API_BASE_URL}/steps`),
          fetch(`${API_BASE_URL}/jobsteps`),
          fetch(`${API_BASE_URL}/plannings`),
        ]);

        const jobsData: Job[] = await jobsRes.json();
        const stepsData: Step[] = await stepsRes.json();
        const jobStepsData: JobStep[] = await jobStepsRes.json();
        const planningsData: Planning[] = await planningsRes.json();

        console.log('JobSteps data:', jobStepsData); // Debug log
        console.log('Plannings data:', planningsData); // Debug log

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
          color: stepColorPalette[step.step_name] || "#9ca3af",
        }));

        setJobs(transformedJobs);
        setSteps(transformedSteps);
        setStepsData(stepsData); // Store raw steps data
        setJobSteps(jobStepsData);
        setPlannings(planningsData);

        // Transform plannings to events
        const transformedEvents: StepEvent[] = planningsData
          .filter(planning => planning.jobStep?.job && planning.jobStep?.step) // Filter out invalid data
          .map(planning => {
            const plannedDate = new Date(planning.planned_date);
            const monthStart = startOfMonth(currentDate);
            const dayDiff = Math.floor((plannedDate.getTime() - monthStart.getTime()) / (1000 * 60 * 60 * 24));
            
            return {
              id: `planning-${planning.planning_id}`,
              planning_id: planning.planning_id,
              step: planning.jobStep!.step!.step_name,
              day: dayDiff + 1,
              jobId: planning.jobStep!.job!.job_number,
              qty: planning.planned_quantity,
              color: stepColorPalette[planning.jobStep!.step!.step_name] || "#9ca3af",
              date: new Date(planning.planned_date).toISOString().split('T')[0],
              job_step_id: planning.job_step_id,
            };
          });

        setEvents(transformedEvents);
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
          key: stepName,
          color: stepColorPalette[stepName] || "#9ca3af",
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

  const filteredJobsList = useMemo(() => {
    let filtered = jobs.filter(
      (j) => showCompletedJobs || !isJobComplete(j.id)
    );

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
  }, [jobs, showCompletedJobs, jobSearchQuery, jobSortDescending]);

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
      const dateA = new Date(a.planned_date).getTime();
      const dateB = new Date(b.planned_date).getTime();
      return planningSortDescending ? dateB - dateA : dateA - dateB;
    });

    return filtered;
  }, [plannings, planningSearchQuery, planningSortDescending]);

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
      const response = await fetch(`${API_BASE_URL}/plannings`, {
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
        alert(error.error || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล');
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
          },
          step: {
            step_name: qtyPopup.step,
          },
        },
      };

      // Update local state
      const newEvent: StepEvent = {
        id: `planning-${newPlanning.planning_id}`,
        planning_id: newPlanning.planning_id,
        step: qtyPopup.step,
        day: qtyPopup.day,
        jobId: qtyPopup.jobId,
        qty,
        color,
        date: qtyPopup.date,
        job_step_id: qtyPopup.job_step_id,
      };

      setEvents((prev) => [...prev, newEvent]);
      setPlannings((prev) => [...prev, completePlanning]);
      setQtyPopup(null);
    } catch (error) {
      console.error('Error creating planning:', error);
      alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    }
  };

  const removeEvent = async (id: string) => {
    if (!canEditPage) return;
    
    const event = events.find((e) => e.id === id);
    if (!event || !event.planning_id) return;

    try {
      const response = await fetch(`${API_BASE_URL}/plannings/${event.planning_id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.error || 'เกิดข้อผิดพลาดในการลบข้อมูล');
        return;
      }

      // Update local state
      setEvents((prev) => prev.filter((e) => e.id !== id));
      setPlannings((prev) => prev.filter((p) => p.planning_id !== event.planning_id));
      setDeletePopup(null); // Close delete popup
    } catch (error) {
      console.error('Error deleting planning:', error);
      alert('เกิดข้อผิดพลาดในการลบข้อมูล');
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
      const response = await fetch(`${API_BASE_URL}/plannings/${event.planning_id}`, {
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
        alert(error.error || 'เกิดข้อผิดพลาดในการแก้ไขข้อมูล');
        return;
      }

      const updatedPlanning: Planning = await response.json();

      // Update local state with complete data
      setEvents((prev) => {
        const eventIndex = prev.findIndex(e => e.id === eventId);
        if (eventIndex === -1) return prev;
        
        const oldEvent = prev[eventIndex];
        const newEvent: StepEvent = {
          ...oldEvent,
          step: newStep,
          date: newDate,
          color: steps.find((s) => s.key === newStep)?.color || oldEvent.color,
          job_step_id: newJobStep.job_step_id,
          day: (() => {
            try {
              const eventDate = new Date(newDate);
              const monthStart = startOfMonth(currentDate);
              const dayDiff = Math.floor((eventDate.getTime() - monthStart.getTime()) / (1000 * 60 * 60 * 24));
              return dayDiff + 1;
            } catch (error) {
              console.error('Error calculating day:', error);
              return oldEvent.day;
            }
          })(),
        };
        
        const newEvents = [...prev];
        newEvents[eventIndex] = newEvent;
        return newEvents;
      });

      setPlannings((prev) => {
        const planningIndex = prev.findIndex(p => p.planning_id === event.planning_id);
        if (planningIndex === -1) return prev;
        
        // Create complete Planning object
        const completePlanning: Planning = {
          ...updatedPlanning,
          jobStep: {
            job: {
              job_number: event.jobId,
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
      alert('เกิดข้อผิดพลาดในการย้ายข้อมูล');
    }
  };

  const handleViewModeChange = (mode: 'week' | 'month') => {
    setViewMode(mode);
    if (mode === 'week') {
      setCurrentWeekPage(0);
    }
  };

  const handleAutoPlanAll = async () => {
    if (!filteredJobsList.length) {
      alert('ไม่มี Job ที่สามารถสร้างแผนการได้');
      return;
    }

    const incompleteJobs = filteredJobsList.filter(job => !isJobComplete(job.id));
    if (!incompleteJobs.length) {
      alert('ทั้งหมด Job เสร็จแล้ว');
      return;
    }

    try {
      setIsAutoPlanLoading(true);
      setAutoPlanTotalCount(incompleteJobs.length);
      setAutoPlanProcessedCount(0);
      
      const response = await fetch(`${API_BASE_URL}/plannings/auto-plan-batch`, {
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
          errorMessage += `\n\n${result.failedJobs.join('\n')}`;
        }
        alert(errorMessage);
        return;
      }

      setAutoPlanProcessedCount(incompleteJobs.length);

      const totalCreated = result.count || 0;
      const successCount = result.jobCount || 0;
      const failedJobs = Array.isArray(result.failedJobs) ? result.failedJobs : [];

      // Refresh planning data
      const planningsRes = await fetch(`${API_BASE_URL}/plannings`);
      const planningsData: Planning[] = await planningsRes.json();
      setPlannings(planningsData);
      
      // Update events
      const transformedEvents: StepEvent[] = planningsData
        .filter(planning => planning.jobStep?.job && planning.jobStep?.step)
        .map(planning => {
          const plannedDate = new Date(planning.planned_date);
          const monthStart = startOfMonth(currentDate);
          const dayDiff = Math.floor((plannedDate.getTime() - monthStart.getTime()) / (1000 * 60 * 60 * 24));
          
          return {
            id: `planning-${planning.planning_id}`,
            planning_id: planning.planning_id,
            step: planning.jobStep!.step!.step_name,
            day: dayDiff + 1,
            jobId: planning.jobStep!.job!.job_number,
            qty: planning.planned_quantity,
            color: stepColorPalette[planning.jobStep!.step!.step_name] || "#9ca3af",
            date: new Date(planning.planned_date).toISOString().split('T')[0],
            job_step_id: planning.job_step_id,
          };
        });
      
      setEvents(transformedEvents);
      setSelected(null);

      let message = `✅ สำเร็จ: ${successCount}/${incompleteJobs.length} Jobs สร้างแผนการแล้ว (${totalCreated} Planning Records)`;
      if (failedJobs.length > 0) {
        message += `\n\n❌ ไม่สำเร็จ:\n${failedJobs.join('\n')}`;
      }
      alert(message);
    } catch (error) {
      console.error('Error calling auto-plan:', error);
      alert('เกิดข้อผิดพลาดในการใช้ Auto Plan All');
    } finally {
      setIsAutoPlanLoading(false);
      setAutoPlanProcessedCount(0);
      setAutoPlanTotalCount(0);
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

                <div className="flex items-center gap-2">
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
            
            <div className="relative min-w-0 max-w-full overflow-x-auto">
              <StepWeekGrid
                startDate={addDays(startDate, weekStartDay - 1)}
                steps={steps}
                events={events}
                viewMode={viewMode}
                daysToShow={daysToShow}
                onAskQuantity={askQuantity}
                onRemoveEvent={removeEvent}
                onMoveEvent={moveEvent}
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
            <div className="max-h-[32rem] min-h-[482px] space-y-2 overflow-y-auto overflow-x-hidden pr-1">
              {filteredJobsList
                .slice(0, 5)
                .map((job) => {
                  const jobStepsForJob = getJobSteps(job.job_id);
                  const jobComplete = isJobComplete(job.id);

                  return (
                    <div key={job.id}>
                      <button
                        onClick={() => setSelected(job)}
                        className={`w-full rounded-lg border px-3 py-3 text-left hover:bg-slate-50 relative z-30 ${
                          jobComplete ? 'bg-emerald-50 border-emerald-200' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <div className="min-w-0 truncate font-medium">{job.id}</div>
                            {job.createdAt && <NewItemBadge dateValue={job.createdAt} />}
                          </div>
                          {jobComplete && <span className="text-emerald-600 text-xs">✓ Complete</span>}
                        </div>
                        <div className="truncate text-xs text-slate-500">
                          {job.quantity} pcs • {job.customer_name}
                        </div>
                        <div className="truncate text-xs text-slate-400">
                          Due {job.due}
                        </div>
                      </button>
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
                                    .filter((s) => calcRemainingStep(job.id, s.key) > 0)
                                    .map((s) => (
                                      <div
                                        key={s.job_step_id}
                                        draggable
                                        onDragStart={(e) => {
                                          e.dataTransfer.setData("text/step", s.key);
                                          e.dataTransfer.setData("text/job", job.id);
                                        }}
                                        className="job-step-item"
                                        style={{ backgroundColor: s.color }}
                                      >
                                        <div className="job-step-name">{s.key}</div>
                                        <div className="job-step-remaining">
                                          {calcRemainingStep(job.id, s.key)} remaining
                                        </div>
                                      </div>
                                    ))}
                                  {jobStepsForJob.length === 0 && (
                                    <div className="job-steps-complete">
                                      <div className="job-steps-complete-icon">⚠️</div>
                                      <div className="job-steps-complete-text">
                                        No steps configured for this job
                                      </div>
                                    </div>
                                  )}
                                  {jobStepsForJob.length > 0 && jobStepsForJob.every((s) => calcRemainingStep(job.id, s.key) === 0) && (
                                    <div className="job-steps-complete">
                                      <div className="job-steps-complete-icon">✅</div>
                                      <div className="job-steps-complete-text">
                                        All steps completed!
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div className="job-detail-actions">
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
              {filteredJobsList.length > 5 && (
                <div className="text-xs text-slate-500 text-center py-2 px-3 bg-slate-50 rounded-lg">
                  ...showing 5 of {filteredJobsList.length} jobs (use search to filter)
                </div>
              )}
            </div>
          </div>

          <div className="xl:col-span-3 min-w-0 max-w-full overflow-hidden rounded-lg border bg-white p-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="font-semibold">Planning Records</div>
              <button
                onClick={handleAutoPlanAll}
                disabled={!canEditPage || filteredJobsList.every(j => isJobComplete(j.id)) || isAutoPlanLoading}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                title="Generate auto plans for all incomplete jobs"
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
              <button
                onClick={() => setPlanningSortDescending(!planningSortDescending)}
                className="flex items-center gap-1 px-3 py-2 rounded-lg border hover:bg-slate-50 transition-colors"
                title="Sort by date"
              >
                <ArrowUpDown className="h-4 w-4" />
              </button>
            </div>
            <div className="max-w-full min-h-[550px] overflow-x-auto">
              <table className="min-w-[520px] w-full text-sm border">
                <thead>
                  <tr className="bg-slate-100">
                    <th className="px-2 py-1 border">Job ID</th>
                    <th className="px-2 py-1 border">Step</th>
                    <th className="px-2 py-1 border">Date</th>
                    <th className="px-2 py-1 border">Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {plannings
                    .filter(rec => rec.jobStep?.job && rec.jobStep?.step)
                    .slice(0, 5)
                    .map((rec) => (
                      <tr key={rec.planning_id}>
                        <td className="px-2 py-1 border">{rec.jobStep!.job!.job_number}</td>
                        <td className="px-2 py-1 border">{rec.jobStep!.step!.step_name}</td>
                        <td className="px-2 py-1 border">
                          {new Date(rec.planned_date).toLocaleDateString('th-TH')}
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
                  {filteredPlanningsList.length > 5 && (
                    <tr>
                      <td colSpan={4} className="text-center text-slate-500 text-xs py-2 bg-slate-50">
                        ...showing 5 of {filteredPlanningsList.length} records (use search to filter)
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
                    {autoPlanTotalCount}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Jobs in one AI request
                  </p>
                </div>

                {/* Helper Text */}
                <p className="text-xs text-slate-500 pt-2 leading-relaxed">
                  AI is calculating all selected jobs in one request. Please don't close this window.
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
      </div>
    </AppLayout>
  );
}
