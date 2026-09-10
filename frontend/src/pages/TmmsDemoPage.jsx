import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { Seo } from "../components/seo/Seo";
import { DemoGrid } from "../components/tmms/DemoGrid";
import { DemoTour } from "../components/tmms/DemoTour";
import { DEMO_NOTICE, TMMS_DEMOS } from "../content/tmms";
import NotFound from "./NotFound";

export default function TmmsDemoPage() {
    const { sector } = useParams();
    const demo = TMMS_DEMOS.find((d) => d.slug === sector);
    const [key, setKey] = useState(0);
    if (!demo) return <NotFound />;

    return (
        <>
            <Seo
                title={`${demo.label} — TMMS simulated demonstration | Nachi Eng Ltd`}
                description={`Simulated TMMS demonstration for ${demo.label.toLowerCase()} on fictional sample data.`}
                path={`/tmms/demos/${demo.slug}`}
                noindex
            />
            <DemoTour key={demo.slug} sector={demo.slug} />
            <section data-testid={`demo-page-${demo.slug}`} className="bg-paper">
                <div className="container-shell pt-10 md:pt-14">
                    <Link
                        to="/tmms"
                        data-testid="demo-back-link"
                        className="group inline-flex min-h-[44px] items-center gap-2 text-sm text-ink/60 transition-colors hover:text-ink"
                    >
                        <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5" aria-hidden="true" />
                        Back to TMMS
                    </Link>
                    <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
                        <div>
                            <p className="eyebrow flex flex-wrap items-center gap-3 text-signal">
                                <span>Simulated demonstration</span>
                                {demo.future && (
                                    <span className="border border-ink/25 px-2 py-0.5 text-[10px] tracking-[0.18em] text-ink/70">Future target sector</span>
                                )}
                            </p>
                            <h1 className="h-section mt-4">{demo.label}</h1>
                        </div>
                        <button
                            type="button"
                            onClick={() => setKey((k) => k + 1)}
                            data-testid="demo-reset-button"
                            className="inline-flex min-h-[44px] items-center gap-2 border border-ink/20 px-4 text-sm transition-colors duration-200 hover:border-ink"
                        >
                            <RotateCcw className="h-4 w-4" aria-hidden="true" />
                            Reset demonstration
                        </button>
                    </div>
                    <p
                        data-testid="demo-sim-banner"
                        role="note"
                        className="mt-8 border-l-2 border-signal bg-ink/[0.04] px-5 py-4 text-sm leading-6 text-ink/80"
                    >
                        {DEMO_NOTICE}
                    </p>
                </div>
                <div className="container-shell mt-8">
                    <iframe
                        key={key}
                        src={`/demos/${demo.slug}.html`}
                        title={`TMMS simulated demonstration — ${demo.label}`}
                        data-testid="demo-iframe"
                        sandbox="allow-scripts"
                        referrerPolicy="no-referrer"
                        loading="lazy"
                        className="h-[70vh] min-h-[560px] w-full border border-ink/15 bg-ink md:h-[78vh] md:min-h-[680px]"
                    />
                    <p className="mt-3 font-mono text-xs tracking-[0.12em] text-ink/70">
                        Runs in an isolated frame. Nothing entered here is stored or transmitted.
                    </p>
                </div>
                <div className="container-shell py-20 md:py-24">
                    <h2 className="eyebrow text-ink/60">Other demonstrations</h2>
                    <div className="mt-6">
                        <DemoGrid exclude={demo.slug} />
                    </div>
                </div>
            </section>
        </>
    );
}
