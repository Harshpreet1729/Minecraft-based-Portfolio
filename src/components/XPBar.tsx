export function XPBar({ value = 78, label = "Developer XP" }: { value?: number; label?: string }) {
  return (
    <div className="xp-wrap" aria-label={`${label}: ${value} percent`}>
      <div className="xp-meta">
        <span>{label}</span>
        <strong>{value}%</strong>
      </div>
      <div className="xp-bar">
        <span style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
      </div>
    </div>
  );
}
