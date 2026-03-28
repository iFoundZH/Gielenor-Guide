interface ProgressBarProps {
  value: number;
  max: number;
  label?: string;
  color?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}

export function ProgressBar({
  value,
  max,
  label,
  color = "bg-osrs-gold",
  showText = true,
  size = "md",
}: ProgressBarProps) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  const heightClass = size === "sm" ? "h-2" : size === "lg" ? "h-5" : "h-3";

  return (
    <div>
      {(label || showText) && (
        <div className="flex justify-between items-center mb-1">
          {label && <span className="text-sm text-osrs-text-dim">{label}</span>}
          {showText && (
            <span className="text-xs text-osrs-text-dim">
              {value.toLocaleString()} / {max.toLocaleString()} ({pct.toFixed(1)}%)
            </span>
          )}
        </div>
      )}
      <div className={`w-full bg-osrs-darker rounded-full overflow-hidden ${heightClass}`}>
        <div
          className={`${color} ${heightClass} rounded-full progress-fill transition-all duration-500`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
