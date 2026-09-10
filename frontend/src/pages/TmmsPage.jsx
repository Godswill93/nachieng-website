import { Seo } from "../components/seo/Seo";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Reveal } from "../components/motion/Reveal";
import { Chapter } from "../components/layout/Chapter";
import { EnquiryCta } from "../components/EnquiryCta";
import { DemoGrid } from "../components/tmms/DemoGrid";
import { WalkthroughSection } from "../components/tmms/WalkthroughSection";
import { COMPANY } from "../content/site";
import { DEMO_NOTICE, TMMS, TMMS_MODULES } from "../content/tmms";

const TMMS_JSONLD = {
    "@context": "https://schema.org",
    "@graph": [
        {
            "@type": "SoftwareApplication",
            name: TMMS.longName,
            applicationCategory: "BusinessApplication",
            operatingSystem: "Web",
            url: `${COMPANY.canonicalOrigin}/tmms`,
            description: TMMS.lead,
            author: { "@id": `${COMPANY.canonicalOrigin}/#org` },
        },
        {
            "@type": "BreadcrumbList",
            itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: `${COMPANY.canonicalOrigin}/` },
                { "@type": "ListItem", position: 2, name: "TMMS", item: `${COMPANY.canonicalOrigin}/tmms` },
            ],
        },
    ],
};

const Intro = () => (
    <section data-testid="tmms-intro" className="bg-paper">
        <div className="container-shell pb-16 pt-24 md:pb-20 md:pt-32">
            <p className="eyebrow flex flex-wrap items-center gap-4 text-signal">
                <span>TMMS</span>
                <span className="border border-ink/25 px-2 py-0.5 text-[10px] tracking-[0.18em] text-ink/70">In development</span>
            </p>
            <h1 className="h-display mt-8 max-w-4xl">A maintenance management system, designed from the maintenance floor.</h1>
            <Reveal delay={0.15}>
                <p className="mt-8 max-w-xl text-base leading-7 text-ink/70 md:text-lg md:leading-8">{TMMS.lead}</p>
            </Reveal>
        </div>
    </section>
);

const Problem = () => (
    <section data-testid="tmms-problem" className="bg-paper">
        <div className="container-shell pb-24">
            <Reveal>
                <Chapter num="01" label="Why it is being built" />
            </Reveal>
            <div className="mt-12 grid gap-10 md:grid-cols-12 md:gap-8">
                <Reveal className="md:col-span-6">
                    <h2 className="h-section">Reactive maintenance carries costs that rarely appear on one invoice.</h2>
                </Reveal>
                <Reveal delay={0.1} className="md:col-span-6">
                    <p className="text-sm leading-6 text-ink/70 md:text-base md:leading-7">{TMMS.problem}</p>
                    <p className="mt-5 border-l-2 border-signal pl-5 text-sm leading-6 text-ink/80 md:text-base md:leading-7">{TMMS.intent}</p>
                </Reveal>
            </div>
        </div>
    </section>
);

const Modules = () => (
    <section data-testid="tmms-modules" className="bg-paper">
        <div className="container-shell pb-24">
            <Reveal>
                <Chapter num="02" label="What the demonstrations cover" />
            </Reveal>
            <Reveal delay={0.05}>
                <ol className="mt-12 grid gap-px border border-ink/10 bg-ink/10 sm:grid-cols-2 lg:grid-cols-3">
                    {TMMS_MODULES.map((m, i) => (
                        <li key={m.name} className="bg-paper p-6">
                            <span className="font-mono text-xs text-signal">{String(i + 1).padStart(2, "0")}</span>
                            <h3 className="font-expanded mt-3 text-base font-semibold tracking-tight md:text-lg">{m.name}</h3>
                            <p className="mt-2 text-sm leading-6 text-ink/70">{m.text}</p>
                        </li>
                    ))}
                </ol>
            </Reveal>
        </div>
    </section>
);

const Demos = () => (
    <section data-testid="tmms-demos" className="bg-paper">
        <div className="container-shell py-24">
            <Reveal>
                <Chapter num="04" label="Simulated sector demonstrations" />
            </Reveal>
            <div className="mt-12 grid gap-10 md:grid-cols-12 md:gap-8">
                <Reveal className="md:col-span-5">
                    <h2 className="h-section">Four sector demonstrations, running on sample data.</h2>
                    <p className="mt-5 text-sm leading-6 text-ink/70 md:text-base md:leading-7">
                        Each demonstration runs in your browser inside this website. Raise a work order, move between
                        assets, schedules, inventory and reports, and see how the record follows the work.
                    </p>
                    <p data-testid="tmms-demo-notice" className="mt-5 border-l-2 border-signal pl-5 text-sm leading-6 text-ink/80">
                        {DEMO_NOTICE}
                    </p>
                    <Link
                        to="/demonstrations"
                        data-testid="tmms-demo-lab-link"
                        className="group mt-6 inline-flex items-center gap-2 text-sm font-medium text-ink underline-offset-4 hover:text-signal hover:underline"
                    >
                        Visit the Demonstration Lab
                        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true" />
                    </Link>
                </Reveal>
                <Reveal delay={0.1} className="md:col-span-7">
                    <DemoGrid />
                </Reveal>
            </div>
        </div>
    </section>
);

const Status = () => (
    <section data-testid="tmms-status" className="bg-paper">
        <div className="container-shell pb-24 md:pb-32">
            <Reveal>
                <Chapter num="05" label="Development status" />
            </Reveal>
            <Reveal delay={0.05}>
                <dl className="mt-12 grid gap-px border border-ink/10 bg-ink/10 sm:grid-cols-2 lg:grid-cols-4">
                    {[
                        ["Status", TMMS.status],
                        ["Availability", TMMS.availability],
                        ["Sectors in scope", TMMS.sectors.join(", ")],
                        ["Future target sector", TMMS.futureSectors.join(", ")],
                    ].map(([k, v]) => (
                        <div key={k} className="bg-paper p-6">
                            <dt className="eyebrow text-ink/70">{k}</dt>
                            <dd className="font-expanded mt-3 text-base font-semibold leading-6">{v}</dd>
                        </div>
                    ))}
                </dl>
            </Reveal>
            <Reveal delay={0.1}>
                <p className="mt-8 max-w-2xl text-sm leading-6 text-ink/70 md:text-base md:leading-7">
                    These are the types of structured maintenance workflows TMMS is being developed to support across
                    manufacturing, logistics, commercial facilities, hospitality and, in future, healthcare estates.
                    TMMS is not presented as a released product, and no customer deployment is claimed.
                </p>
            </Reveal>
        </div>
    </section>
);

export default function TmmsPage() {
    return (
        <>
            <Seo
                title="TMMS — Maintenance Management System | Nachi Eng Ltd"
                description="TMMS is a Maintenance Management System in development by Nachi Eng Ltd, with four simulated sector demonstrations on sample data. Private demonstration by enquiry."
                path="/tmms"
                jsonLd={TMMS_JSONLD}
            />
            <Intro />
            <Problem />
            <Modules />
            <WalkthroughSection num="03" />
            <Demos />
            <Status />
            <EnquiryCta num="06" />
        </>
    );
}
