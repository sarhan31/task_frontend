import { motion } from "framer-motion";
import { cn } from "@utils/cn";

const TeamStatCard = ({ title, value, icon: Icon, colorClass, gradientClass, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="relative overflow-hidden rounded-[24px] border border-white/60 bg-white/40 p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] backdrop-blur-xl sm:p-7"
    >
      <div className={cn("absolute right-0 top-0 h-32 w-32 -translate-y-8 translate-x-8 rounded-full blur-3xl", gradientClass)} />
      
      <div className="relative z-10 flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-500">{title}</p>
          <h3 className="mt-2 text-3xl font-black tracking-tight text-slate-800 sm:text-4xl">
            {value}
          </h3>
        </div>
        <div className={cn("flex h-12 w-12 items-center justify-center rounded-2xl shadow-sm", colorClass)}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </motion.div>
  );
};

export default TeamStatCard;
