import { cn } from "@utils/cn";

const sizeConfig = {
  sm: {
    wrap: "gap-2.5",
    imgSize: 36,
    title: "text-lg",
    subtitle: "text-[10px]",
  },
  md: {
    wrap: "gap-3",
    imgSize: 44,
    title: "text-xl sm:text-2xl",
    subtitle: "text-xs",
  },
  lg: {
    wrap: "gap-3",
    imgSize: 48,
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
  const config = sizeConfig[size] || sizeConfig.md;

  return (
    <div className={cn("flex min-w-0 items-center", config.wrap, className)}>
      <div
        className={cn(
          "flex-shrink-0 overflow-hidden rounded-xl border border-[#e6d6ca] bg-white shadow-sm",
          markClassName
        )}
        style={{ width: config.imgSize, height: config.imgSize }}
      >
        <img
          src="/logotask_manager.png"
          alt="Tasky Studio"
          width={config.imgSize}
          height={config.imgSize}
          className="h-full w-full object-cover"
          style={{ imageRendering: "auto" }}
          draggable={false}
        />
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
