import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { TMMS_DEMOS } from "../../content/tmms";

export const DemoGrid = ({ exclude }) => (
    <ul className="grid gap-px border border-ink/10 bg-ink/10 sm:grid-cols-2">
        {TMMS_DEMOS.filter((d) => d.slug !== exclude).map((d) => (
            <li key={d.slug} className="bg-paper">
                <Link
                    to={`/tmms/demos/${d.slug}`}
                    data-testid={`demo-link-${d.slug}`}
                    className="group flex h-full flex-col p-6 transition-colors duration-300 hover:bg-ink hover:text-paper md:p-8"
                >
                    <div className="flex flex-wrap items-center gap-3">
                        <span className="eyebrow text-signal group-hover:text-signalhi">Simulated demo</span>
                        {d.future && (
                            <span className="eyebrow border border-current px-2 py-0.5 text-[10px] opacity-70">Future target sector</span>
                        )}
                    </div>
                    <h3 className="font-expanded mt-4 text-xl font-semibold tracking-tight">{d.label}</h3>
                    <p className="mt-2 max-w-sm text-sm leading-6 opacity-70">{d.text}</p>
                    <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium">
                        Open demonstration
                        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true" />
                    </span>
                </Link>
            </li>
        ))}
    </ul>
);
