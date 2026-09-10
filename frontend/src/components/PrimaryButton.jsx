import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { PRIMARY_CTA } from "../content/site";

export const PrimaryButton = ({ dark = false }) => (
    <Link
        to={PRIMARY_CTA.to}
        data-testid={PRIMARY_CTA.testId}
        className={`group inline-flex min-h-[48px] items-center gap-2 rounded-full px-7 py-3 text-sm font-medium transition-colors duration-300 ${
            dark
                ? "bg-signal text-white hover:bg-paper hover:text-ink"
                : "bg-ink text-paper hover:bg-signal hover:text-white"
        }`}
    >
        {PRIMARY_CTA.label}
        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true" />
    </Link>
);
