import { useState, useMemo, useEffect } from "react";
import AppLayout from "@/components/layout/Sidebar";
import { format, parseISO, isWithinInterval, isSameDay, addDays, subDays } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Users,
  Calendar,
  Download,
  ClipboardList,
  Printer,
} from "lucide-react";

// API Base URL
const API_BASE_URL = 'http://localhost:4000/api';

interface Job {
  job_id: number;
  job_number: string;
  total_quantity: number;
  end_date: string;
  customer: {
    customer_id: number;
    fullname: string;
  };
}

interface JobStep {
  job_step_id: number;
  job_id: number;
  step_id: number;
  step: {
    step_name: string;
  };
}

interface ProductionLog {
  log_id: number;
  job_id: number;
  job_step_id: number;
  log_date: string;
  quantity: number;
  employee_id: number;
  dateline_date: string;
  job: {
    job_number: string;
    customer: {
      fullname: string;
    };
  };
  jobStep: {
    step: {
      step_name: string;
    };
  };
  employee: {
    fullname: string;
  };
}

interface DailyRecord {
  log_id: number;
  date: string;
  job: string;
  step: string;
  quantity: number;
  recorder: string;
  customer: string;
}

interface JobDueDate {
  job_id: number;
  job_number: string;
  customer: string;
  quantity: number;
  dueDate: string;
  completedQuantity: number;
  totalSteps: number;
  completedSteps: number;
  status: 'completed' | 'in-progress' | 'overdue';
}

const stepPalette = [
  { key: "Cutting", color: "#86efac", name: "Cutting" },
  { key: "Heating", color: "#fca5a5", name: "Heating" },
  { key: "Embroidering", color: "#fde68a", name: "Embroidering" },
  { key: "Sewing", color: "#a5b4fc", name: "Sewing" },
  { key: "QC", color: "#67e8f9", name: "QC" },
  { key: "Pack", color: "#f0abfc", name: "Pack" },
];

type ReportType = 'daily-records' | 'due-dates';

export default function Summary() {
  const [reportType, setReportType] = useState<ReportType>('daily-records');
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());

  // State for API data
  const [jobs, setJobs] = useState<Job[]>([]);
  const [jobSteps, setJobSteps] = useState<JobStep[]>([]);
  const [productionLogs, setProductionLogs] = useState<ProductionLog[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [jobsRes, jobStepsRes, logsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/jobs`),
          fetch(`${API_BASE_URL}/jobsteps`),
          fetch(`${API_BASE_URL}/productionlogs`),
        ]);

        const jobsData: Job[] = await jobsRes.json();
        const jobStepsData: JobStep[] = await jobStepsRes.json();
        const logsData: ProductionLog[] = await logsRes.json();

        console.log('Production Logs:', logsData);

        setJobs(jobsData);
        setJobSteps(jobStepsData);
        setProductionLogs(logsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Daily Records Report - ดึงจาก ProductionLog ตามช่วงวันที่
  const dailyRecords = useMemo((): DailyRecord[] => {
    return productionLogs
      .filter(log => {
        const logDate = new Date(log.log_date);
        return isWithinInterval(logDate, { start: startDate, end: endDate });
      })
      .filter(log => log.job?.customer && log.jobStep?.step)
      .map(log => ({
        log_id: log.log_id,
        date: format(new Date(log.log_date), 'MM/dd/yyyy'),
        job: log.job.job_number,
        step: log.jobStep.step.step_name,
        quantity: log.quantity,
        recorder: log.employee.fullname,
        customer: log.job.customer.fullname,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [startDate, endDate, productionLogs]);

  // Due Dates Report - ดึงจาก Job ตามช่วงวันที่
  const jobsDueInRange = useMemo((): JobDueDate[] => {
    const currentDate = new Date();
    
    return jobs
      .filter(job => {
        const jobDate = new Date(job.end_date);
        return isWithinInterval(jobDate, { start: startDate, end: endDate });
      })
      .map(job => {
        const jobStepsForJob = jobSteps.filter(js => js.job_id === job.job_id);
        const totalSteps = jobStepsForJob.length;
        
        let completedSteps = 0;
        let completedQuantity = 0;

        jobStepsForJob.forEach(jobStep => {
          const loggedQty = productionLogs
            .filter(log => log.job_step_id === jobStep.job_step_id)
            .reduce((sum, log) => sum + log.quantity, 0);
          
          if (loggedQty >= job.total_quantity) {
            completedSteps++;
          }
          completedQuantity += loggedQty;
        });

        const jobDate = new Date(job.end_date);
        let status: 'completed' | 'in-progress' | 'overdue';
        
        if (completedSteps === totalSteps && totalSteps > 0) {
          status = 'completed';
        } else if (jobDate < currentDate) {
          status = 'overdue';
        } else {
          status = 'in-progress';
        }

        return {
          job_id: job.job_id,
          job_number: job.job_number,
          customer: job.customer.fullname,
          quantity: job.total_quantity,
          dueDate: format(new Date(job.end_date), 'MM/dd/yyyy'),
          completedQuantity,
          totalSteps,
          completedSteps,
          status,
        };
      })
      .sort((a, b) => {
        const dateCompare = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        if (dateCompare !== 0) return dateCompare;
        
        const statusOrder = { 'overdue': 0, 'in-progress': 1, 'completed': 2 };
        return statusOrder[a.status] - statusOrder[b.status];
      });
  }, [startDate, endDate, jobs, jobSteps, productionLogs]);

  const navigateDateRange = (direction: 'prev' | 'next', days: number = 1) => {
    if (direction === 'prev') {
      setStartDate(prev => subDays(prev, days));
      setEndDate(prev => subDays(prev, days));
    } else {
      setStartDate(prev => addDays(prev, days));
      setEndDate(prev => addDays(prev, days));
    }
  };

  const handlePrintPDF = () => {
    window.print();
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
      <div className="space-y-6">
        {/* Header */}
        <div className="rounded-xl bg-gradient-to-r from-[hsl(var(--brand-start))] to-[hsl(var(--brand-end))] text-white p-6 shadow print:hidden">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Production Reports</h1>
              <p className="text-white/80 mt-1">
                Daily records and job due dates
              </p>
            </div>
            <div className="flex items-center gap-3">
              {/* Report Type Selector */}
              <div className="flex items-center bg-white/10 rounded-lg p-1">
                <button
                  className={`px-3 py-1.5 text-xs rounded-md transition-colors flex items-center gap-2 ${
                    reportType === 'daily-records'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-white/80 hover:text-white'
                  }`}
                  onClick={() => setReportType('daily-records')}
                >
                  <ClipboardList className="h-3.5 w-3.5" />
                  Daily Records
                </button>
                <button
                  className={`px-3 py-1.5 text-xs rounded-md transition-colors flex items-center gap-2 ${
                    reportType === 'due-dates'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-white/80 hover:text-white'
                  }`}
                  onClick={() => setReportType('due-dates')}
                >
                  <Calendar className="h-3.5 w-3.5" />
                  Due Dates
                </button>
              </div>

              {/* Date Range Selector */}
              <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2">
                <Calendar className="h-4 w-4" />
                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    value={format(startDate, 'yyyy-MM-dd')}
                    onChange={(e) => setStartDate(new Date(e.target.value))}
                    className="bg-white/20 border border-white/30 rounded px-2 py-1 text-sm text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
                  />
                  <span className="text-white/80">to</span>
                  <input
                    type="date"
                    value={format(endDate, 'yyyy-MM-dd')}
                    onChange={(e) => setEndDate(new Date(e.target.value))}
                    className="bg-white/20 border border-white/30 rounded px-2 py-1 text-sm text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
                  />
                </div>
                <div className="flex items-center gap-1 ml-2">
                  <button
                    className="px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 transition-colors"
                    onClick={() => navigateDateRange('prev', 1)}
                    title="Previous day"
                  >
                    {"<"}
                  </button>
                  <button
                    className="px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 transition-colors"
                    onClick={() => navigateDateRange('next', 1)}
                    title="Next day"
                  >
                    {">"}
                  </button>
                  <button
                    className="px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 transition-colors text-xs"
                    onClick={() => navigateDateRange('prev', 7)}
                    title="Previous week"
                  >
                    {"<<"}
                  </button>
                  <button
                    className="px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 transition-colors text-xs"
                    onClick={() => navigateDateRange('next', 7)}
                    title="Next week"
                  >
                    {">>"}
                  </button>
                </div>
              </div>

              {/* Quick Range Buttons */}
              <div className="flex items-center gap-1">
                <button
                  className="px-2 py-1 text-xs rounded bg-white/10 hover:bg-white/20 transition-colors"
                  onClick={() => {
                    const today = new Date();
                    setStartDate(today);
                    setEndDate(today);
                  }}
                >
                  Today
                </button>
                <button
                  className="px-2 py-1 text-xs rounded bg-white/10 hover:bg-white/20 transition-colors"
                  onClick={() => {
                    const today = new Date();
                    setStartDate(subDays(today, 7));
                    setEndDate(today);
                  }}
                >
                  Last 7 days
                </button>
                <button
                  className="px-2 py-1 text-xs rounded bg-white/10 hover:bg-white/20 transition-colors"
                  onClick={() => {
                    const today = new Date();
                    setStartDate(subDays(today, 30));
                    setEndDate(today);
                  }}
                >
                  Last 30 days
                </button>
              </div>

              {/* Print Button */}
              <Button
                onClick={handlePrintPDF}
                className="bg-white/10 hover:bg-white/20 text-white border-white/20"
                size="sm"
              >
                <Printer className="h-4 w-4 mr-2" />
                Print PDF
              </Button>
            </div>
          </div>
        </div>

        {/* Official Print Header */}
        <div className="hidden print:block">
          <div className="border-b-4 border-gray-800 pb-4 mb-6">
            <div className="text-center mb-4">
              <h1 className="text-3xl font-bold text-gray-900 mb-1">บริษัท GG จำกัด</h1>
              <p className="text-sm text-gray-600">ที่อยู่บริษัท | โทร: XXX-XXX-XXXX | อีเมล: Test@company.com</p>
            </div>
            <div className="text-center border-t border-gray-300 pt-4">
              <h2 className="text-2xl font-bold text-gray-800">
                {reportType === 'daily-records' && 'รายงานบันทึกการผลิตรายวัน'}
                {reportType === 'due-dates' && 'รายงานกำหนดส่งงาน'}
              </h2>
              <p className="text-gray-600 mt-2">
                ระหว่างวันที่ {format(startDate, "dd/MM/yyyy")} ถึง {format(endDate, "dd/MM/yyyy")}
              </p>
            </div>
          </div>
          <div className="flex justify-between text-sm text-gray-600 mb-6">
            <div>
              <p><strong>วันที่พิมพ์:</strong> {format(new Date(), "dd/MM/yyyy HH:mm น.")}</p>
              <p><strong>ประเภทรายงาน:</strong> {reportType === 'daily-records' ? 'บันทึกการผลิตรายวัน' : 'กำหนดส่งงาน'}</p>
            </div>
            <div className="text-right">
              <p><strong>จำนวนรายการ:</strong> {reportType === 'daily-records' ? dailyRecords.length : jobsDueInRange.length}</p>
              <p><strong>เอกสารเลขที่:</strong> {format(new Date(), "yyyyMMdd")}-{Math.floor(Math.random() * 1000).toString().padStart(3, '0')}</p>
            </div>
          </div>
        </div>

        {/* Daily Records Report */}
        {reportType === 'daily-records' && (
          <div className="bg-white rounded-lg border p-6 print:border-0 print:p-0">
            <div className="flex items-center justify-between mb-6 print:hidden">
              <div>
                <h3 className="text-lg font-semibold">Daily Production Records</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {format(startDate, "MMM dd, yyyy")} - {format(endDate, "MMM dd, yyyy")}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">{dailyRecords.length}</p>
                <p className="text-sm text-gray-500">Total Records</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b-2 border-gray-800">
                    <th className="text-left py-3 px-3 font-bold text-gray-900 print:py-2">ลำดับ</th>
                    <th className="text-left py-3 px-3 font-bold text-gray-900 print:py-2">วันที่</th>
                    <th className="text-left py-3 px-3 font-bold text-gray-900 print:py-2">เลขที่งาน</th>
                    <th className="text-left py-3 px-3 font-bold text-gray-900 print:py-2">ลูกค้า</th>
                    <th className="text-left py-3 px-3 font-bold text-gray-900 print:py-2">ขั้นตอน</th>
                    <th className="text-right py-3 px-3 font-bold text-gray-900 print:py-2">จำนวน</th>
                    <th className="text-left py-3 px-3 font-bold text-gray-900 print:py-2">ผู้บันทึก</th>
                  </tr>
                </thead>
                <tbody>
                  {dailyRecords.map((record, index) => (
                    <tr key={record.log_id} className="border-b border-gray-200 print:break-inside-avoid">
                      <td className="py-3 px-3 text-gray-700 print:py-2">{index + 1}</td>
                      <td className="py-3 px-3 text-gray-700 print:py-2">{record.date}</td>
                      <td className="py-3 px-3 font-medium text-gray-900 print:py-2">{record.job}</td>
                      <td className="py-3 px-3 text-gray-700 print:py-2">{record.customer}</td>
                      <td className="py-3 px-3 print:py-2">
                        {/* Show icon with color on screen */}
                        <span className="inline-flex items-center gap-1.5 print:hidden">
                          <span
                            className="w-3 h-3 rounded-full"
                            style={{
                              backgroundColor: stepPalette.find(s => s.key === record.step)?.color || '#64748b'
                            }}
                          />
                          {record.step}
                        </span>
                        {/* Show text only on print */}
                        <span className="hidden print:inline">{record.step}</span>
                      </td>
                      <td className="py-3 px-3 text-right font-semibold text-gray-900 print:py-2">{record.quantity.toLocaleString()}</td>
                      <td className="py-3 px-3 text-gray-700 print:py-2">{record.recorder}</td>
                    </tr>
                  ))}
                  {dailyRecords.length === 0 && (
                    <tr>
                      <td colSpan={7} className="text-center py-12 text-gray-500 print:hidden">
                        <ClipboardList className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                        <p>No production records for this date range</p>
                      </td>
                    </tr>
                  )}
                </tbody>
                {dailyRecords.length > 0 && (
                  <tfoot>
                    <tr className="border-t-2 border-gray-800 font-bold bg-gray-50 print:bg-white">
                      <td colSpan={5} className="py-3 px-3 text-right text-gray-900 print:py-2">รวมทั้งหมด:</td>
                      <td className="py-3 px-3 text-right text-gray-900 print:py-2">
                        {dailyRecords.reduce((sum, r) => sum + r.quantity, 0).toLocaleString()}
                      </td>
                      <td></td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>

            {/* Signature Section for Print */}
            <div className="hidden print:block mt-16 pt-8 border-t border-gray-300">
              <div className="grid grid-cols-3 gap-8 text-center">
                <div>
                  <p className="mb-12">ผู้จัดทำรายงาน</p>
                  <div className="border-t border-gray-400 pt-2">
                    <p>(...................................................)</p>
                    <p className="text-sm text-gray-600 mt-1">วันที่ ......./......./..........</p>
                  </div>
                </div>
                <div>
                  <p className="mb-12">ผู้ตรวจสอบ</p>
                  <div className="border-t border-gray-400 pt-2">
                    <p>(...................................................)</p>
                    <p className="text-sm text-gray-600 mt-1">วันที่ ......./......./..........</p>
                  </div>
                </div>
                <div>
                  <p className="mb-12">ผู้อนุมัติ</p>
                  <div className="border-t border-gray-400 pt-2">
                    <p>(...................................................)</p>
                    <p className="text-sm text-gray-600 mt-1">วันที่ ......./......./..........</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Due Dates Report */}
        {reportType === 'due-dates' && (
          <div className="bg-white rounded-lg border p-6 print:border-0 print:p-0">
            <div className="flex items-center justify-between mb-6 print:hidden">
              <div>
                <h3 className="text-lg font-semibold">Jobs Due in Date Range</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {format(startDate, "MMM dd, yyyy")} - {format(endDate, "MMM dd, yyyy")}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">{jobsDueInRange.length}</p>
                <p className="text-sm text-gray-500">Jobs Due</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b-2 border-gray-800">
                    <th className="text-left py-3 px-3 font-bold text-gray-900 print:py-2">ลำดับ</th>
                    <th className="text-left py-3 px-3 font-bold text-gray-900 print:py-2">กำหนดส่ง</th>
                    <th className="text-left py-3 px-3 font-bold text-gray-900 print:py-2">เลขที่งาน</th>
                    <th className="text-left py-3 px-3 font-bold text-gray-900 print:py-2">ลูกค้า</th>
                    <th className="text-right py-3 px-3 font-bold text-gray-900 print:py-2">จำนวน</th>
                    <th className="text-center py-3 px-3 font-bold text-gray-900 print:py-2">ความคืบหน้า</th>
                    <th className="text-center py-3 px-3 font-bold text-gray-900 print:py-2">สถานะ</th>
                  </tr>
                </thead>
                <tbody>
                  {jobsDueInRange.map((job, index) => (
                    <tr key={job.job_id} className="border-b border-gray-200 print:break-inside-avoid">
                      <td className="py-3 px-3 text-gray-700 print:py-2">{index + 1}</td>
                      <td className="py-3 px-3 text-gray-700 print:py-2">{job.dueDate}</td>
                      <td className="py-3 px-3 font-medium text-gray-900 print:py-2">{job.job_number}</td>
                      <td className="py-3 px-3 text-gray-700 print:py-2">{job.customer}</td>
                      <td className="py-3 px-3 text-right font-semibold text-gray-900 print:py-2">{job.quantity.toLocaleString()}</td>
                      <td className="py-3 px-3 text-center print:py-2">
                        {/* Show progress bar on screen */}
                        <div className="flex items-center justify-center gap-2 print:hidden">
                          <div className="w-24 bg-gray-200 rounded-full h-2.5">
                            <div
                              className="h-2.5 rounded-full bg-blue-600"
                              style={{
                                width: `${job.totalSteps > 0 ? (job.completedSteps / job.totalSteps) * 100 : 0}%`
                              }}
                            />
                          </div>
                          <span className="text-xs text-gray-700 font-medium">
                            {job.completedSteps}/{job.totalSteps}
                          </span>
                        </div>
                        {/* Show text only on print */}
                        <span className="hidden print:inline text-gray-900 font-medium">
                          {job.completedSteps}/{job.totalSteps}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center print:py-2">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold print:px-0 print:py-0 print:rounded-none print:bg-transparent print:text-black ${
                            job.status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : job.status === 'overdue'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {job.status === 'completed' && 'เสร็จสมบูรณ์'}
                          {job.status === 'overdue' && 'เลยกำหนด'}
                          {job.status === 'in-progress' && 'กำลังดำเนินการ'}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {jobsDueInRange.length === 0 && (
                    <tr>
                      <td colSpan={7} className="text-center py-12 text-gray-500 print:hidden">
                        <Calendar className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                        <p>No jobs due in this date range</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Summary Statistics - Hidden on print */}
            {jobsDueInRange.length > 0 && (
              <div className="mt-8 grid grid-cols-3 gap-6 pt-6 border-t-2 border-gray-300 print:hidden">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-3xl font-bold text-green-700">
                    {jobsDueInRange.filter(j => j.status === 'completed').length}
                  </p>
                  <p className="text-sm text-gray-700 mt-1 font-medium">เสร็จสมบูรณ์</p>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <p className="text-3xl font-bold text-yellow-700">
                    {jobsDueInRange.filter(j => j.status === 'in-progress').length}
                  </p>
                  <p className="text-sm text-gray-700 mt-1 font-medium">กำลังดำเนินการ</p>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <p className="text-3xl font-bold text-red-700">
                    {jobsDueInRange.filter(j => j.status === 'overdue').length}
                  </p>
                  <p className="text-sm text-gray-700 mt-1 font-medium">เลยกำหนด</p>
                </div>
              </div>
            )}

            {/* Signature Section for Print */}
            <div className="hidden print:block mt-16 pt-8 border-t border-gray-300">
              <div className="grid grid-cols-3 gap-8 text-center">
                <div>
                  <p className="mb-12">ผู้จัดทำรายงาน</p>
                  <div className="border-t border-gray-400 pt-2">
                    <p>(...................................................)</p>
                    <p className="text-sm text-gray-600 mt-1">วันที่ ......./......./..........</p>
                  </div>
                </div>
                <div>
                  <p className="mb-12">ผู้ตรวจสอบ</p>
                  <div className="border-t border-gray-400 pt-2">
                    <p>(...................................................)</p>
                    <p className="text-sm text-gray-600 mt-1">วันที่ ......./......./..........</p>
                  </div>
                </div>
                <div>
                  <p className="mb-12">ผู้อนุมัติ</p>
                  <div className="border-t border-gray-400 pt-2">
                    <p>(...................................................)</p>
                    <p className="text-sm text-gray-600 mt-1">วันที่ ......./......./..........</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Professional Print Styles */}
      <style>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 1.5cm;
          }
          
          /* Hide sidebar and navbar */
          aside,
          nav,
          header,
          .sidebar,
          .navbar,
          [class*="sidebar"],
          [class*="navbar"],
          [class*="header"],
          [role="banner"],
          [class*="top-bar"],
          [class*="topbar"] {
            display: none !important;
          }
          
          /* Make main content full width */
          main {
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
          }
          
          body > div,
          #root > div,
          [class*="layout"] > div:first-child {
            display: contents !important;
          }
          
          * {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          
          body {
            font-family: 'Sarabun', 'TH Sarabun New', sans-serif;
          }
          
          .print\\:hidden {
            display: none !important;
          }
          
          .print\\:block {
            display: block !important;
          }
          
          .print\\:inline {
            display: inline !important;
          }
          
          .print\\:border {
            border-width: 1px !important;
          }
          
          .print\\:border-0 {
            border-width: 0 !important;
          }
          
          .print\\:border-2 {
            border-width: 2px !important;
          }
          
          .print\\:p-0 {
            padding: 0 !important;
          }
          
          .print\\:px-0 {
            padding-left: 0 !important;
            padding-right: 0 !important;
          }
          
          .print\\:py-0 {
            padding-top: 0 !important;
            padding-bottom: 0 !important;
          }
          
          .print\\:py-2 {
            padding-top: 0.5rem !important;
            padding-bottom: 0.5rem !important;
          }
          
          .print\\:bg-white {
            background-color: white !important;
          }
          
          .print\\:bg-transparent {
            background-color: transparent !important;
          }
          
          .print\\:text-black {
            color: black !important;
          }
          
          .print\\:rounded-none {
            border-radius: 0 !important;
          }
          
          .print\\:break-inside-avoid {
            break-inside: avoid !important;
          }
          
          table {
            page-break-inside: auto;
          }
          
          tr {
            page-break-inside: avoid;
            page-break-after: auto;
          }
          
          thead {
            display: table-header-group;
          }
          
          tfoot {
            display: table-footer-group;
          }
        }
      `}</style>
    </AppLayout>
  );
}