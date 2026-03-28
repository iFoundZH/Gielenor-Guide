interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "gold" | "red" | "green" | "blue" | "purple";
  size?: "sm" | "md";
}

const variants = {
  default: "bg-osrs-border text-osrs-text-dim",
  gold: "bg-osrs-gold/20 text-osrs-gold border border-osrs-gold/30",
  red: "bg-demon-glow/20 text-demon-glow border border-demon-glow/30",
  green: "bg-osrs-green/20 text-osrs-green border border-osrs-green/30",
  blue: "bg-osrs-blue/20 text-osrs-blue border border-osrs-blue/30",
  purple: "bg-osrs-purple/20 text-osrs-purple border border-osrs-purple/30",
};

export function Badge({ children, variant = "default", size = "sm" }: BadgeProps) {
  const sizeClass = size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm";

  return (
    <span className={`inline-flex items-center rounded-full font-medium ${variants[variant]} ${sizeClass}`}>
      {children}
    </span>
  );
}
