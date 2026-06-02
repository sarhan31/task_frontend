import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Calendar, BarChart3, CheckSquare, Sparkles, FileSpreadsheet, RefreshCcw } from 'lucide-react';
import Button from '@components/ui/Button';
import Card from '@components/ui/Card';
import Select from '@components/ui/Select';
import { toast } from '@components/ui/Toaster';
import { useTaskStore } from '@services/taskStore';
import { analyticsService } from '@services/analyticsService';

const COMPLETED_STATUSES = ['Completed', 'completed', 'Approved'];
const IN_PROGRESS_STATUSES = ['In Progress', 'Started', 'in_progress', 'Under Review', 'in_review', 'Rejected'];

const compileLocalReport = (tasks, period) => {
  const days = Number.parseInt(period, 10);
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  const filteredTasks = tasks.filter((task) => !task.createdAt || new Date(task.createdAt) >= cutoff);
  const completed = filteredTasks.filter((task) => COMPLETED_STATUSES.includes(task.status)).length;
  const progress = filteredTasks.filter((task) => IN_PROGRESS_STATUSES.includes(task.status)).length;
  const pending = filteredTasks.filter((task) => ['Assigned', 'Accepted', 'todo'].includes(task.status)).length;

  return {
    total: filteredTasks.length,
    pending,
    progress,
    completed,
    efficiency: filteredTasks.length > 0 ? Math.round((completed / filteredTasks.length) * 100) : 0,
    rows: filteredTasks.map((task) => ({
      title: task.title,
      assignee: task.assignee || task.assignedToName || (task.assignedToAll ? 'All Members' : 'Unassigned'),
      status: task.status,
      priority: task.priority,
      progress: task.progressPercentage ?? task.progress ?? 0,
      dueDate: task.dueDate
    }))
  };
};

const escapeCsv = (value) => `"${String(value ?? '').replace(/"/g, '""')}"`;
const isDemoToken = () => localStorage.getItem('token')?.startsWith('demo-token:');

const createCsvBlob = (rows) => {
  const safeRows = rows.length ? rows : [{ message: 'No records found for this period' }];
  const headers = Object.keys(safeRows[0]);
  const csv = [
    headers.map(escapeCsv).join(','),
    ...safeRows.map((row) => headers.map((header) => escapeCsv(row[header])).join(','))
  ].join('\n');
  return new Blob([csv], { type: 'text/csv;charset=utf-8' });
};

const createPdfBlob = (report) => {
  const sanitize = (value) =>
    String(value ?? '')
      .replace(/[^\x20-\x7E]/g, ' ')
      .replace(/\\/g, '\\\\')
      .replace(/\(/g, '\\(')
      .replace(/\)/g, '\\)');
  const lines = [
    report.title,
    `Compiled: ${report.generatedAt}`,
    '',
    `Total Tasks: ${report.total}`,
    `Pending Tasks: ${report.pending}`,
    `In Progress Tasks: ${report.progress}`,
    `Completed Tasks: ${report.completed}`,
    `Efficiency Ratio: ${report.efficiency}%`,
    '',
    ...(report.rows || []).map((row, index) =>
      `${index + 1}. ${Object.entries(row).map(([key, value]) => `${key}: ${value}`).join(' | ')}`
    )
  ];
  const content = [
    'BT',
    '/F1 10 Tf',
    '48 760 Td',
    ...lines.slice(0, 42).flatMap((line, index) => [
      index === 0 ? '/F1 15 Tf' : '/F1 10 Tf',
      `(${sanitize(line)}) Tj`,
      '0 -17 Td'
    ]),
    'ET'
  ].join('\n');
  const objects = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 5 0 R >> >> /Contents 4 0 R >>',
    `<< /Length ${content.length} >>\nstream\n${content}\nendstream`,
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>'
  ];
  let pdf = '%PDF-1.4\n';
  const offsets = [0];
  objects.forEach((object, index) => {
    offsets[index + 1] = pdf.length;
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });
  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.slice(1).forEach((offset) => {
    pdf += `${String(offset).padStart(10, '0')} 00000 n \n`;
  });
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
  return new Blob([pdf], { type: 'application/pdf' });
};

const downloadBlob = (blob, filename) => {
  const downloadUrl = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(downloadUrl);
};

const getInsight = ({ total, progress, completed, efficiency }) => {
  if (total === 0) return 'No task records were found for the selected period. Choose a longer period or create tasks to begin tracking delivery performance.';
  if (efficiency >= 70) return `The team completed ${completed} of ${total} tasks with a ${efficiency}% efficiency ratio. Delivery is healthy; keep an eye on the ${progress} active task${progress === 1 ? '' : 's'}.`;
  if (progress > 0) return `${progress} task${progress === 1 ? ' is' : 's are'} actively moving, while ${completed} of ${total} tasks are complete. Review active work and unblock overdue items to improve delivery speed.`;
  return `${completed} of ${total} tasks are complete. There are currently no tasks in progress, so the next step is to review pending assignments and start the highest-priority work.`;
};

const Reports = () => {
  const { tasks } = useTaskStore();
  const [reportType, setReportType] = useState('tasks');
  const [period, setPeriod] = useState('30d');
  const [generatedReport, setGeneratedReport] = useState(null);
  const [loading, setLoading] = useState(false);

  const reportTypes = [
    { value: 'tasks', label: 'Task Reports' },
    { value: 'users', label: 'User Reports' },
    { value: 'performance', label: 'Performance Reports' },
  ];

  const periods = [
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 90 Days' },
  ];

  const handleGenerate = async () => {
    setLoading(true);
    try {
      if (isDemoToken()) throw new Error('demo');
      const response = await analyticsService.getReports(reportType, period);
      const summary = {
        title: `${reportTypes.find(r => r.value === reportType).label} - ${periods.find(p => p.value === period).label}`,
        generatedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        ...response.data.summary,
        rows: response.data.rows || []
      };
      setGeneratedReport(summary);
      toast.success('Report compiled successfully!');
    } catch (error) {
      const localReport = compileLocalReport(tasks, period);
      setGeneratedReport({
        title: `${reportTypes.find(r => r.value === reportType).label} - ${periods.find(p => p.value === period).label}`,
        generatedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        ...localReport
      });
      toast.info('Compiled report from the current workspace data.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (format) => {
    try {
      toast.success(`Preparing report download in ${format.toUpperCase()} format...`);
      if (isDemoToken()) throw new Error('demo');
      const response = await analyticsService.exportReport(reportType, format, period);
      
      const blob = new Blob([response.data], { type: format === 'csv' ? 'text/csv' : 'application/pdf' });
      downloadBlob(blob, `report_${reportType}_${period}.${format}`);
      toast.success(`Report downloaded successfully!`);
    } catch (err) {
      const localReport = generatedReport || compileLocalReport(tasks, period);
      const blob = format === 'csv'
        ? createCsvBlob(localReport.rows || [])
        : createPdfBlob({
            ...localReport,
            title: localReport.title || `${reportTypes.find(r => r.value === reportType).label} - ${periods.find(p => p.value === period).label}`,
            generatedAt: localReport.generatedAt || new Date().toLocaleString()
          });
      downloadBlob(blob, `report_${reportType}_${period}.${format}`);
      toast.success(`${format.toUpperCase()} report downloaded from workspace data.`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold text-slate-900 font-display">Reports</h1>
        <p className="text-sm text-slate-500 mt-1">Generate, compile, and download system activity logs</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Generator panel */}
        <Card className="lg:col-span-1 border border-[#ead8cb] bg-white p-5 shadow-sm rounded-3xl">
          <Card.Header className="px-0 pt-0 pb-4 border-b border-[#f4ddd0]">
            <Card.Title className="text-base font-bold text-slate-800 font-display">Configure Report Parameters</Card.Title>
          </Card.Header>
          <Card.Content className="px-0 py-4 space-y-4">
            <Select
              label="Report Type"
              options={reportTypes}
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
            />
            <Select
              label="Time Period"
              options={periods}
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
            />
            <Button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full bg-[#13856f] text-white hover:bg-[#0f7260]"
            >
              {loading ? (
                <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <BarChart3 className="mr-2 h-4 w-4" />
              )}
              {loading ? 'Compiling Parameters…' : 'Generate Summary'}
            </Button>
          </Card.Content>
        </Card>

        {/* Display compiled report or placeholder */}
        <div className="lg:col-span-2 space-y-6">
          <AnimatePresence mode="wait">
            {generatedReport ? (
              <motion.div
                key="report"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="bg-white border border-[#ead8cb] rounded-[28px] p-6 shadow-sm space-y-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#f4ddd0] pb-4">
                  <div>
                    <h3 className="font-bold text-lg text-slate-800 font-display">{generatedReport.title}</h3>
                    <p className="text-[10px] text-slate-400 mt-1 font-semibold">Compiled: {generatedReport.generatedAt}</p>
                  </div>
                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-[#ead8cb] text-slate-600 hover:bg-[#fffaf6]"
                      onClick={() => handleDownload('pdf')}
                    >
                      <Download className="mr-1.5 h-3.5 w-3.5" />
                      PDF
                    </Button>
                    <Button
                      size="sm"
                      className="bg-[#13856f] text-white hover:bg-[#0f7260]"
                      onClick={() => handleDownload('csv')}
                    >
                      <FileSpreadsheet className="mr-1.5 h-3.5 w-3.5" />
                      CSV
                    </Button>
                  </div>
                </div>

                {/* Report Statistics Details */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-[#fffaf6] border border-[#ead8cb] rounded-2xl p-4 text-center">
                    <p className="text-lg font-bold text-slate-800">{generatedReport.total}</p>
                    <p className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold mt-1">Total Tasks</p>
                  </div>

                  <div className="bg-[#fffaf6] border border-[#ead8cb] rounded-2xl p-4 text-center">
                    <p className="text-lg font-bold text-[#b5722a]">{generatedReport.progress}</p>
                    <p className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold mt-1">In Progress</p>
                  </div>

                  <div className="bg-[#fffaf6] border border-[#ead8cb] rounded-2xl p-4 text-center">
                    <p className="text-lg font-bold text-[#13856f]">{generatedReport.completed}</p>
                    <p className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold mt-1">Completed</p>
                  </div>

                  <div className="bg-[#fffaf6] border border-[#ead8cb] rounded-2xl p-4 text-center">
                    <p className="text-lg font-bold text-slate-800">{generatedReport.efficiency}%</p>
                    <p className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold mt-1">Efficiency Ratio</p>
                  </div>
                </div>

                {/* Insight block */}
                <div className="bg-[#e8f6f2] border border-[#b8e0d8] rounded-2xl p-4 flex items-start gap-3">
                  <Sparkles className="h-5 w-5 text-[#13856f] flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-[#13856f]">AI Summary Insight</h4>
                    <p className="text-xs text-[#0f7260] leading-5 mt-1">
                      {getInsight(generatedReport)}
                    </p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mx-auto max-w-sm space-y-3 rounded-[28px] border border-[#ead8cb] bg-white/80 p-6 text-center sm:p-12"
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-50 text-slate-400 border border-[#e6d6ca]">
                  <BarChart3 className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-slate-800 font-display">No report compiled</h3>
                <p className="text-xs text-slate-400">
                  Select report parameters on the configuration panel and click "Generate Summary" to compile metrics.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default Reports;
