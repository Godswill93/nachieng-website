import { Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";
import { Seo } from "../components/seo/Seo";
import { Reveal } from "../components/motion/Reveal";
import { Chapter } from "../components/layout/Chapter";
import { EnquiryCta } from "../components/EnquiryCta";
import { WalkthroughMedia } from "../components/tmms/WalkthroughMedia";
import { COMPANY } from "../content/site";
import { DEMO_LAB, DEMO_NOTICE, DEMONSTRATIONS, SHOW_PREVIEW_MEDIA } from "../content/tmms";

const LAB_JSONLD = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${COMPANY.canonicalOrigin}/` },
        { "@type": "ListItem", position: 2, name: "TMMS", item: `${COMPANY.canonicalOrigin}/tmms` },
        { "@type": "ListItem", position: 3, name: "Demonstration Lab", item: `${COMPANY.canonicalOrigin}/demonstrations` },
    ],
};

const StaticFallback = ({ slug }) => (
    <div
        data-testid={`demo-media-fallback-${slug}`}
        className="flex aspect-video w-full flex-col items-start justify-between border border-dashed border-white/30 p-6"
    >
        <span className="eyebrow text-signalhi">Walkthrough recording</span>
        <p className="text-sm text-white/70">Recording pending approval. Open the live simulated demonstration below to explore the interface directly.</p>
    </div>
);

const DemoBlock = ({ demo, index }) => {
    const showMedia = demo.media.published || SHOW_PREVIEW_MEDIA;
    return (
        <article data-testid={`demo-lab-block-${demo.slug}`} className="border-t border-ink/10 py-16 md:py-20">
            <div className="grid gap-10 md:grid-cols-12 md:gap-8">
                <div className="md:col-span-5">
                    <div className="flex flex-wrap items-center gap-3">
                        <span className="font-mono text-xs text-signal">{String(index + 1).padStart(2, "0")}</span>
                        <span className="eyebrow text-ink/70">{demo.category}</span>
                        {demo.future && (
                            <span className="eyebrow border border-ink/25 px-2 py-0.5 text-[10px] text-ink/70">Future target sector</span>
                        )}
                    </div>
                    <h2 className="h-section mt-5">{demo.label}</h2>
                    <p className="mt-5 text-sm leading-6 text-ink/70 md:text-base md:leading-7">{demo.text}</p>
                    <p
                        data-testid={`demo-lab-sim-label-${demo.slug}`}
                        className="mt-5 border-l-2 border-signal pl-5 text-sm leading-6 text-ink/80"
                    >
                        Simulated demonstration — sample data.
                    </p>

                    <p className="eyebrow mt-8 text-ink/70">What this walkthrough will show</p>
                    <ul className="mt-4 space-y-2.5">
                        {demo.interactions.map((it) => (
                            <li key={it} className="flex gap-3 text-sm leading-6 text-ink/75">
                                <Check className="mt-0.5 h-4 w-4 shrink-0 text-signal" aria-hidden="true" />
                                <span>{it}</span>
                            </li>
                        ))}
                    </ul>

                    <Link
                        to={`/tmms/demos/${demo.slug}`}
                        data-testid={`demo-lab-open-${demo.slug}`}
                        className="group mt-8 inline-flex min-h-[48px] items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-medium text-paper transition-colors duration-300 hover:bg-signal hover:text-white"
                    >
                        Open the live simulated demonstration
                        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true" />
                    </Link>
                </div>

                <div className="md:col-span-7">
                    {showMedia ? (
                        <WalkthroughMedia item={demo.media} />
                    ) : (
                        <figure className="bg-ink">
                            <StaticFallback slug={demo.slug} />
                            <figcaption className="border-t border-white/10 px-5 py-4">
                                <p className="font-expanded text-sm font-semibold text-paper">{demo.media.title}</p>
                                <p className="mt-2 text-sm leading-6 text-white/70">{demo.media.caption}</p>
                            </figcaption>
                        </figure>
                    )}
                </div>
            </div>
        </article>
    );
};

export default function DemonstrationLabPage() {
    const previewOnly = DEMONSTRATIONS.some((d) => !d.media.published) && SHOW_PREVIEW_MEDIA;
    return (
        <>
            <Seo
                title="TMMS Demonstration Lab — Maintenance Management System | Nachi Eng Ltd"
                description="The TMMS Demonstration Lab: configurable maintenance management system in the CMMS category, by Nachi Eng Ltd. Four simulated sector demonstrations on sample data, in development."
                path="/demonstrations"
                jsonLd={LAB_JSONLD}
            />

            <section data-testid="demo-lab-intro" className="bg-paper">
                <div className="container-shell pb-16 pt-24 md:pb-20 md:pt-32">
                    <p className="eyebrow flex flex-wrap items-center gap-4 text-signal">
                        <span>{DEMO_LAB.eyebrow}</span>
                        <span className="border border-ink/25 px-2 py-0.5 text-[10px] tracking-[0.18em] text-ink/70">In development</span>
                    </p>
                    <h1 className="h-display mt-8 max-w-4xl">{DEMO_LAB.title}</h1>
                    <Reveal delay={0.1}>
                        <p className="mt-8 max-w-2xl text-base leading-7 text-ink/70 md:text-lg md:leading-8">{DEMO_LAB.lead}</p>
                    </Reveal>
                    <Reveal delay={0.15}>
                        <p className="mt-6 max-w-2xl text-sm leading-6 text-ink/70 md:text-base md:leading-7">{DEMO_LAB.configurable}</p>
                    </Reveal>
                    <Reveal delay={0.2}>
                        <p data-testid="demo-lab-recording-note" className="mt-8 max-w-2xl border-l-2 border-signal pl-5 text-sm leading-6 text-ink/80">
                            {DEMO_LAB.recordingNote}
                        </p>
                    </Reveal>
                    <p data-testid="demo-lab-notice" className="mt-6 max-w-2xl font-mono text-xs leading-6 tracking-[0.08em] text-ink/60">
                        {DEMO_NOTICE}
                    </p>
                </div>
            </section>

            <section data-testid="demo-lab-demos" className="bg-paper">
                <div className="container-shell pb-8">
                    <Reveal>
                        <Chapter num="01" label="Sector demonstrations" />
                    </Reveal>
                    {previewOnly && (
                        <p data-testid="demo-lab-preview-notice" className="mt-8 inline-block border border-signal/40 px-3 py-1.5 font-mono text-xs tracking-[0.12em] text-signal">
                            PREVIEW ONLY — walkthrough recordings are unpublished and hidden in production
                        </p>
                    )}
                    <div className="mt-4">
                        {DEMONSTRATIONS.map((demo, i) => (
                            <DemoBlock key={demo.slug} demo={demo} index={i} />
                        ))}
                    </div>
                </div>
            </section>

            <EnquiryCta num="02" />
        </>
    );
}
