import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import { X, ArrowRight, ArrowLeft } from "lucide-react";

const STEPS = [
    {
        title: "Start on the dashboard",
        text: "The dashboard brings open work, overdue tasks and asset condition onto one screen — the quickest way to see the state of things.",
    },
    {
        title: "Raise a work order",
        text: "Open Work Orders and raise a new one. Watch how a job is created, given a priority and tracked through to completion.",
    },
    {
        title: "Follow the planned work",
        text: "Look at the PPM schedule and the reports to see how routine maintenance is planned, recorded and summarised over time.",
    },
];

const storageKey = (sector) => `nachi-demo-tour-${sector}`;

export const DemoTour = ({ sector }) => {
    const reduce = useReducedMotion();
    const [open, setOpen] = useState(false);
    const [step, setStep] = useState(0);
    const dialogRef = useRef(null);
    const closeBtnRef = useRef(null);

    useEffect(() => {
        // Suppressed entirely when reduced motion is enabled (per requirement).
        if (reduce) return;
        let dismissed = false;
        try {
            dismissed = window.localStorage.getItem(storageKey(sector)) === "1";
        } catch (e) {
            dismissed = false;
        }
        if (dismissed) return;
        const timer = window.setTimeout(() => setOpen(true), 550);
        return () => window.clearTimeout(timer);
    }, [reduce, sector]);

    const dismiss = useCallback(() => {
        setOpen(false);
        try {
            window.localStorage.setItem(storageKey(sector), "1");
        } catch (e) {
            /* ignore */
        }
    }, [sector]);

    useEffect(() => {
        if (!open) return undefined;
        closeBtnRef.current?.focus();
        const onKey = (e) => {
            if (e.key === "Escape") {
                dismiss();
                return;
            }
            if (e.key !== "Tab") return;
            const el = dialogRef.current;
            if (!el) return;
            const items = Array.from(el.querySelectorAll("a[href], button:not([disabled])"));
            if (items.length === 0) return;
            const first = items[0];
            const last = items[items.length - 1];
            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        };
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [open, dismiss]);

    const isLast = step === STEPS.length - 1;

    return (
        <AnimatePresence>
            {open && (
                <m.div
                    className="fixed inset-0 z-[80] flex items-end justify-center p-4 sm:items-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    data-testid="demo-tour-overlay"
                >
                    <div className="absolute inset-0 bg-ink/40 backdrop-blur-[2px]" onClick={dismiss} aria-hidden="true" />
                    <m.div
                        ref={dialogRef}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="demo-tour-title"
                        aria-describedby="demo-tour-desc"
                        data-testid="demo-tour-card"
                        className="relative w-full max-w-md border border-ink/15 bg-paper p-6 shadow-2xl sm:p-8"
                        initial={{ opacity: 0, y: 24, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 16, scale: 0.98 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <div className="flex items-start justify-between gap-4">
                            <p className="eyebrow text-signal">Simulated demonstration — a quick tour</p>
                            <button
                                type="button"
                                ref={closeBtnRef}
                                onClick={dismiss}
                                data-testid="demo-tour-close"
                                aria-label="Close tour"
                                className="-mr-1 -mt-1 flex h-9 w-9 shrink-0 items-center justify-center text-ink/70 transition-colors hover:text-ink"
                            >
                                <X className="h-5 w-5" aria-hidden="true" />
                            </button>
                        </div>

                        <p className="mt-2 font-mono text-[11px] tracking-[0.12em] text-ink/70">
                            Sample data only — nothing here is a live or real system.
                        </p>

                        <h2 id="demo-tour-title" data-testid="demo-tour-step-title" className="font-expanded mt-6 text-xl font-semibold tracking-tight">
                            {STEPS[step].title}
                        </h2>
                        <p id="demo-tour-desc" className="mt-3 text-sm leading-6 text-ink/70">
                            {STEPS[step].text}
                        </p>

                        <div className="mt-6 flex items-center gap-2" aria-hidden="true">
                            {STEPS.map((s, i) => (
                                <span key={s.title} className={`h-1 w-8 transition-colors ${i === step ? "bg-signal" : "bg-ink/15"}`} />
                            ))}
                        </div>

                        <div className="mt-8 flex items-center justify-between gap-4">
                            <button
                                type="button"
                                onClick={dismiss}
                                data-testid="demo-tour-skip"
                                className="text-sm text-ink/70 underline-offset-4 transition-colors hover:text-ink hover:underline"
                            >
                                Skip tour
                            </button>
                            <div className="flex items-center gap-2">
                                {step > 0 && (
                                    <button
                                        type="button"
                                        onClick={() => setStep((s) => s - 1)}
                                        data-testid="demo-tour-back"
                                        className="inline-flex min-h-[44px] items-center gap-2 border border-ink/20 px-4 text-sm transition-colors hover:border-ink"
                                    >
                                        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                                        Back
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={() => (isLast ? dismiss() : setStep((s) => s + 1))}
                                    data-testid="demo-tour-next"
                                    className="group inline-flex min-h-[44px] items-center gap-2 rounded-full bg-ink px-5 text-sm font-medium text-paper transition-colors duration-300 hover:bg-signal hover:text-white"
                                >
                                    {isLast ? "Start exploring" : "Next"}
                                    {!isLast && <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true" />}
                                </button>
                            </div>
                        </div>
                    </m.div>
                </m.div>
            )}
        </AnimatePresence>
    );
};
