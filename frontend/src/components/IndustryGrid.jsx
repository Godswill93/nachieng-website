import { INDUSTRIES } from "../content/site";

export const IndustryGrid = () => (
    <ul className="grid gap-x-10 md:grid-cols-2">
        {INDUSTRIES.map((ind, i) => (
            <li key={ind.name} className="flex items-center gap-4 border-t border-ink/10 py-5">
                <span className="font-mono text-xs text-signal">{String(i + 1).padStart(2, "0")}</span>
                <span className="font-expanded text-lg font-semibold tracking-tight md:text-xl">{ind.name}</span>
                {ind.future && (
                    <span className="eyebrow ml-auto shrink-0 border border-signal px-2 py-1 text-[10px] text-signal">
                        Future target sector
                    </span>
                )}
            </li>
        ))}
    </ul>
);
