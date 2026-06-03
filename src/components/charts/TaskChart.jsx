import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-2xl border border-[#ead8cb] bg-white px-4 py-3 shadow-[0_8px_32px_rgba(90,55,20,0.14)]">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</p>
        {payload.map((entry) => (
          <div key={entry.name} className="flex items-center gap-2 text-sm">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: entry.fill }} />
            <span className="capitalize text-slate-600">{entry.name}:</span>
            <span className="font-semibold text-slate-800">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const TaskChart = ({ data }) => {
  return (
    <div className="h-[280px] w-full min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} barCategoryGap="32%" barGap={4}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f4ddd0" vertical={false} />
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#94a3b8', fontFamily: 'Inter' }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#94a3b8', fontFamily: 'Inter' }}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f7e3cf', radius: 8 }} />
          <Legend
            wrapperStyle={{ fontSize: '12px', color: '#64748b', paddingTop: '16px', fontFamily: 'Inter' }}
            iconType="circle"
            iconSize={8}
          />
          <Bar dataKey="completed" name="Completed" fill="#13856f" radius={[6, 6, 0, 0]} />
          <Bar dataKey="inProgress" name="In Progress" fill="#efbf91" radius={[6, 6, 0, 0]} />
          <Bar dataKey="todo" name="To Do" fill="#f3b59e" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TaskChart;
