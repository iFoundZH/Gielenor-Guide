interface CardProps {
  children: React.ReactNode;
  className?: string;
  glow?: "gold" | "red" | "blue" | "none";
  hover?: boolean;
  onClick?: () => void;
}

export function Card({ children, className = "", glow = "none", hover = false, onClick }: CardProps) {
  const glowClass = glow === "gold" ? "border-glow-gold" : glow === "red" ? "border-glow-red" : glow === "blue" ? "border-glow-blue" : "";
  const hoverClass = hover ? "card-hover cursor-pointer" : "";

  return (
    <div
      className={`bg-osrs-panel border border-osrs-border rounded-xl p-5 ${glowClass} ${hoverClass} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
