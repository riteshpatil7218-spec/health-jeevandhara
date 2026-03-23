interface RiskBadgeProps {
  level: "Low" | "Moderate" | "High";
  large?: boolean;
}

export default function RiskBadge({ level, large = false }: RiskBadgeProps) {
  const colors = {
    Low: "bg-health-green/10 text-health-green border-health-green/30",
    Moderate: "bg-health-amber/10 text-health-amber border-health-amber/30",
    High: "bg-health-red/10 text-health-red border-health-red/30",
  };

  return (
    <span className={`inline-flex items-center gap-1.5 border rounded-full font-semibold ${colors[level]} ${large ? "px-4 py-2 text-base" : "px-3 py-1 text-sm"}`}>
      <span className={`w-2 h-2 rounded-full ${level === "Low" ? "bg-health-green" : level === "Moderate" ? "bg-health-amber" : "bg-health-red animate-pulse"}`} />
      {level} Risk
    </span>
  );
}
