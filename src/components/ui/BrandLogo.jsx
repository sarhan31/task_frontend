import { cn } from "@utils/cn";

const sizeClasses = {
  sm: {
    wrap: "gap-2.5",
    mark: "h-9 w-9 p-1.5 rounded-xl",
    title: "text-lg",
    subtitle: "text-[10px]",
  },
  md: {
    wrap: "gap-3",
    mark: "h-11 w-11 p-2 rounded-2xl",
    title: "text-xl sm:text-2xl",
    subtitle: "text-xs",
  },
  lg: {
    wrap: "gap-3",
    mark: "h-12 w-12 p-2.5 rounded-2xl",
    title: "text-2xl",
    subtitle: "text-xs",
  },
};

const BrandLogo = ({
  className = "",
  size = "md",
  showSubtitle = true,
  brandName = "Tasky Studio",
  subtitle = "Workflow automation for modern teams",
  brandClassName = "",
  titleClassName = "",
  subtitleClassName = "",
  markClassName = "",
}) => {
  const config = sizeClasses[size] || sizeClasses.md;

  return (
    <div className={cn("flex min-w-0 items-center", config.wrap, className)}>
      <div
        className={cn(
          "grid flex-shrink-0 grid-cols-2 gap-1 bg-[#0f6c57] text-white shadow-[0_8px_20px_rgba(15,108,87,0.28)]",
          config.mark,
          markClassName,
        )}
      >
        <span className="rounded-[6px] bg-white/95" />
        <span className="rounded-[6px] bg-white/75" />
        <span className="rounded-[6px] bg-white/75" />
        <span className="rounded-[6px] bg-white/95" />
      </div>

      <div className={cn("min-w-0", brandClassName)}>
        <p
          className={cn(
            "truncate font-display font-bold tracking-tight text-slate-950",
            config.title,
            titleClassName,
          )}
        >
          {brandName}
        </p>
        {showSubtitle && (
          <p
            className={cn(
              "truncate font-medium text-slate-500",
              config.subtitle,
              subtitleClassName,
            )}
          >
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};

export default BrandLogo;
