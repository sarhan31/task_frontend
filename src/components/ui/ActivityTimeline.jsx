import { CheckCircle2, FileText, UserPlus, MessageSquare, AlertCircle } from "lucide-react";
import { formatTimeAgo } from "@utils/formatters";

const getActivityIcon = (text) => {
  const lower = text.toLowerCase();
  if (lower.includes('assigned')) return <UserPlus className="h-4 w-4" />;
  if (lower.includes('completed') || lower.includes('approved')) return <CheckCircle2 className="h-4 w-4" />;
  if (lower.includes('comment') || lower.includes('message')) return <MessageSquare className="h-4 w-4" />;
  if (lower.includes('error') || lower.includes('failed')) return <AlertCircle className="h-4 w-4" />;
  return <FileText className="h-4 w-4" />;
};

const ActivityTimeline = ({ activities, limit = 5 }) => {
  const displayActivities = activities.slice(0, limit);

  return (
    <div className="relative border-l-2 border-slate-200 ml-4 space-y-6">
      {displayActivities.length > 0 ? (
        displayActivities.map((activity, index) => (
          <div key={activity.id || index} className="relative pl-6">
            <span className="absolute -left-[11px] top-1 flex h-5 w-5 items-center justify-center rounded-full bg-white border-2" style={{ borderColor: activity.color || '#13856f' }}>
              <div className="text-slate-500" style={{ color: activity.color || '#13856f' }}>
                {getActivityIcon(activity.text)}
              </div>
            </span>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-slate-800">{activity.text}</span>
              <span className="mt-1 text-xs font-bold uppercase tracking-wider text-slate-400">
                {activity.time}
              </span>
            </div>
          </div>
        ))
      ) : (
        <div className="pl-6 text-sm text-slate-500">No recent activity.</div>
      )}
    </div>
  );
};

export default ActivityTimeline;
