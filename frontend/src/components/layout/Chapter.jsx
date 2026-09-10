export const Chapter = ({ num, label, dark = false }) => (
    <div className={`flex items-baseline gap-4 border-t pt-4 ${dark ? "border-white/15" : "border-ink/15"}`}>
        <span className={`eyebrow ${dark ? "text-signalhi" : "text-signal"}`}>{num}</span>
        <span className={`eyebrow ${dark ? "text-white/60" : "text-ink/60"}`}>{label}</span>
    </div>
);
