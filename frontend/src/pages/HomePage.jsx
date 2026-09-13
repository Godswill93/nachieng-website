import { Link } from "react-router-dom";
import {
    Activity,
    ArrowRight,
    ArrowUpRight,
    Check,
    ClipboardCheck,
    Factory,
    Gauge,
    Search,
    Settings2,
    Wrench,
} from "lucide-react";
import { Seo } from "../components/seo/Seo";
import { Reveal } from "../components/motion/Reveal";
import { PrimaryButton } from "../components/PrimaryButton";
import { EnquiryCta } from "../components/EnquiryCta";
import { COMPANY, CREDENTIALS, FOUNDER, ARTICLES, SECONDARY_CTA } from "../content/site";

const COMPANY_FACTS = [
    { label: "Registered", value: "England & Wales", detail: "Company No. 16567818" },
    { label: "Based", value: "Southend-on-Sea", detail: "Essex, United Kingdom" },
    { label: "Coverage", value: "London · Essex", detail: "The South East" },
];

const SERVICE_CARDS = [
    {
        icon: Activity,
        label: "Keep operations moving",
        title: "Industrial maintenance",
        text: "Planned and reactive support for the electrical and mechanical systems industrial operations depend on.",
        items: ["Electrical & mechanical maintenance", "Motors, drives, pumps & conveyors", "Automated-equipment support"],
    },
    {
        icon: Search,
        label: "Find the real fault",
        title: "Diagnostics & fault-finding",
        text: "Methodical investigation that focuses on evidence, safe restoration and a clear next action.",
        items: ["PLC fault-finding & diagnostics", "Electrical and mechanical faults", "Recurring-failure investigation"],
    },
    {
        icon: Gauge,
        label: "Improve maintenance control",
        title: "Reliability improvement",
        text: "Structured support to strengthen maintenance workflows, asset information and repeat-failure prevention.",
        items: ["Root-cause analysis", "Maintenance workflow design", "CMMS advisory"],
    },
];

const ENGAGEMENTS = [
    {
        num: "01",
        title: "Engineering Support",
        text: "For an active maintenance requirement, equipment fault or planned engineering need.",
        items: ["Planned maintenance", "Reactive support", "Fault-finding & diagnostics"],
        cta: "Discuss an engineering requirement",
        to: "/contact",
    },
    {
        num: "02",
        title: "Maintenance Improvement",
        text: "For organisations that want better control of recurring failures, workflows and maintenance information.",
        items: ["Root-cause analysis", "Workflow improvement", "CMMS advisory"],
        cta: "Discuss an improvement project",
        to: "/contact",
    },
    {
        num: "03",
        title: "Nachi CMMS",
        badge: "In development",
        text: "For maintenance teams exploring a connected way to manage assets, work orders, planned maintenance and parts.",
        items: ["Private demonstration", "Sample-data walkthrough", "Suitability discussion"],
        cta: "Request a private demonstration",
        to: "/demonstrations",
    },
];

const INDUSTRIES = [
    "Factories & manufacturing",
    "Warehouses & distribution",
    "Commercial facilities",
    "Hospitality facilities",
    "Facilities management",
];

const HOME_JSONLD = {
    "@context": "https://schema.org",
    "@graph": [
        {
            "@type": ["Organization", "LocalBusiness"],
            "@id": `${COMPANY.canonicalOrigin}/#org`,
            name: COMPANY.name,
            url: `${COMPANY.canonicalOrigin}/`,
            email: COMPANY.email,
            foundingDate: "2025-07",
            identifier: {
                "@type": "PropertyValue",
                propertyID: "Companies House",
                value: COMPANY.registration,
            },
            address: {
                "@type": "PostalAddress",
                addressLocality: "Southend-on-Sea",
                addressRegion: "Essex",
                addressCountry: "GB",
            },
            areaServed: ["London", "Essex", "South East England"],
            sameAs: [COMPANY.linkedin],
        },
        {
            "@type": "Person",
            name: FOUNDER.name,
            jobTitle: "Founder & Director",
            worksFor: { "@id": `${COMPANY.canonicalOrigin}/#org` },
            memberOf: { "@type": "Organization", name: "Institution of Engineering and Technology" },
        },
    ],
};

const ProcessVisual = () => {
    const stages = [
        { icon: Activity, label: "Detect", detail: "Operational issue" },
        { icon: Search, label: "Diagnose", detail: "Evidence-led review" },
        { icon: Wrench, label: "Restore", detail: "Controlled action" },
        { icon: ClipboardCheck, label: "Improve", detail: "Learning retained" },
    ];

    return (
        <div className="hero-process" aria-label="Nachi Eng maintenance approach">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                <div>
                    <p className="eyebrow text-white/[0.45]">Maintenance response</p>
                    <p className="mt-1 text-sm font-semibold text-white/90">From issue to lasting action</p>
                </div>
                <span className="status-pulse" aria-hidden="true" />
            </div>
            <div className="relative p-5 md:p-6">
                <div className="process-rail" aria-hidden="true" />
                <ol className="relative space-y-3">
                    {stages.map(({ icon: Icon, label, detail }, index) => (
                        <li key={label} className="process-step">
                            <span className="process-icon" aria-hidden="true">
                                <Icon className="h-4 w-4" />
                            </span>
                            <span className="min-w-0 flex-1">
                                <span className="block text-sm font-semibold text-white">{label}</span>
                                <span className="mt-0.5 block text-xs text-white/50">{detail}</span>
                            </span>
                            <span className="font-mono text-[10px] tracking-[0.14em] text-white/[0.35]">
                                {String(index + 1).padStart(2, "0")}
                            </span>
                        </li>
                    ))}
                </ol>
            </div>
            <div className="grid grid-cols-2 gap-px border-t border-white/10 bg-white/10">
                <div className="bg-[#11141b] px-5 py-4">
                    <p className="eyebrow text-white/40">Focus</p>
                    <p className="mt-1 text-xs text-white/75">Safe, accountable support</p>
                </div>
                <div className="bg-[#11141b] px-5 py-4">
                    <p className="eyebrow text-white/40">Outcome</p>
                    <p className="mt-1 text-xs text-white/75">Clear next action</p>
                </div>
            </div>
        </div>
    );
};

const Hero = () => (
    <section data-testid="home-hero" className="hero-surface relative overflow-hidden text-paper">
        <div className="hero-blueprint" aria-hidden="true" />
        <div className="container-shell relative grid min-h-[720px] items-center gap-14 py-20 lg:grid-cols-12 lg:gap-12 lg:py-24">
            <div className="lg:col-span-7">
                <p className="eyebrow hero-enter text-white/[0.55]">Industrial engineering &amp; maintenance technology</p>
                <h1 className="h-display hero-enter hero-enter-delay-1 mt-7 max-w-[760px]">
                    Engineering reliability into every operation.
                </h1>
                <p className="hero-enter hero-enter-delay-2 mt-7 max-w-2xl text-base leading-7 text-white/[0.68] md:text-lg md:leading-8">
                    Practical electrical and mechanical maintenance, fault-finding and reliability improvement for
                    factories, warehouses and commercial facilities across London, Essex and the South East.
                </p>
                <div className="hero-enter hero-enter-delay-3 mt-9 flex flex-wrap items-center gap-x-6 gap-y-3">
                    <PrimaryButton dark />
                    <Link
                        to={SECONDARY_CTA.to}
                        data-testid={SECONDARY_CTA.testId}
                        className="group inline-flex min-h-[48px] items-center gap-2 px-2 py-3 text-sm font-semibold text-white/80 transition-colors duration-200 hover:text-white"
                    >
                        {SECONDARY_CTA.label}
                        <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                    </Link>
                </div>
                <div className="hero-enter hero-enter-delay-3 mt-8 flex flex-wrap gap-x-6 gap-y-2 text-xs text-white/50">
                    <span className="inline-flex items-center gap-2"><Check className="h-3.5 w-3.5 text-signalhi" />Industrial maintenance expertise</span>
                    <span className="inline-flex items-center gap-2"><Check className="h-3.5 w-3.5 text-signalhi" />Response {COMPANY.responseCommitment}</span>
                </div>
            </div>
            <div className="hero-enter hero-enter-delay-2 lg:col-span-5">
                <ProcessVisual />
            </div>
        </div>
        <div className="border-t border-white/10 bg-black/10">
            <div className="container-shell grid grid-cols-2 gap-px py-0 lg:grid-cols-4">
                {["Electrical & mechanical", "Planned & reactive", "Evidence-led diagnostics", "Maintenance improvement"].map((item, index) => (
                    <div key={item} className="flex min-h-[72px] items-center gap-3 border-white/10 px-4 first:pl-0 even:border-l lg:border-l lg:px-6 lg:first:border-l-0 lg:first:pl-0">
                        <span className="font-mono text-[10px] text-signalhi">{String(index + 1).padStart(2, "0")}</span>
                        <span className="text-xs font-medium text-white/[0.65] md:text-sm">{item}</span>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const Services = () => (
    <section data-testid="home-tier-engineering" className="bg-paper">
        <div className="container-shell py-20 md:py-28">
            <Reveal>
                <div className="grid gap-8 lg:grid-cols-12">
                    <div className="lg:col-span-4">
                        <p className="eyebrow text-signal">What we solve</p>
                        <h2 className="h-section mt-5">Engineering support built around operational reality.</h2>
                    </div>
                    <div className="lg:col-span-6 lg:col-start-7">
                        <p className="text-base leading-7 text-ink/[0.65] md:text-lg md:leading-8">
                            When equipment, maintenance information or recurring failures become a constraint, Nachi Eng
                            brings hands-on engineering judgement and a structured route forward.
                        </p>
                    </div>
                </div>
            </Reveal>
            <div className="mt-12 grid gap-4 lg:grid-cols-3">
                {SERVICE_CARDS.map(({ icon: Icon, label, title, text, items }, index) => (
                    <Reveal key={title} delay={index * 0.06}>
                        <article className="service-card h-full">
                            <div className="flex items-center justify-between">
                                <span className="service-card-icon"><Icon className="h-5 w-5" aria-hidden="true" /></span>
                                <span className="font-mono text-[10px] tracking-[0.16em] text-ink/[0.35]">0{index + 1}</span>
                            </div>
                            <p className="eyebrow mt-8 text-signal">{label}</p>
                            <h3 className="mt-3 text-xl font-semibold tracking-[-0.02em] text-ink">{title}</h3>
                            <p className="mt-4 text-sm leading-6 text-ink/60">{text}</p>
                            <ul className="mt-7 space-y-3 border-t border-ink/10 pt-6">
                                {items.map((item) => (
                                    <li key={item} className="flex items-start gap-3 text-sm leading-5 text-ink/75">
                                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-signal" aria-hidden="true" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </article>
                    </Reveal>
                ))}
            </div>
            <Reveal delay={0.08}>
                <Link to="/services" data-testid="home-services-link" className="group mt-10 inline-flex min-h-[44px] items-center gap-2 text-sm font-semibold text-signal">
                    Explore our engineering services
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                </Link>
            </Reveal>
        </div>
    </section>
);

const WaysToWork = () => (
    <section data-testid="home-ways-to-work" className="border-y border-ink/10 bg-[#eeece7]">
        <div className="container-shell py-20 md:py-28">
            <Reveal>
                <p className="eyebrow text-signal">Ways to work with us</p>
                <div className="mt-5 grid gap-6 lg:grid-cols-12">
                    <h2 className="h-section lg:col-span-5">Choose the right starting point.</h2>
                    <p className="text-base leading-7 text-ink/[0.65] lg:col-span-6 lg:col-start-7">
                        Every engagement begins by understanding the operation, the requirement and the most useful next step.
                    </p>
                </div>
            </Reveal>
            <div className="mt-12 grid gap-4 lg:grid-cols-3">
                {ENGAGEMENTS.map((item, index) => (
                    <Reveal key={item.title} delay={index * 0.06}>
                        <article className={`engagement-card h-full ${index === 2 ? "engagement-card-featured" : ""}`}>
                            <div className="flex items-center justify-between">
                                <span className="font-mono text-xs text-signal">{item.num}</span>
                                {item.badge && <span className="rounded-full border border-signal/25 bg-signal/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-signal">{item.badge}</span>}
                            </div>
                            <h3 className="mt-8 text-2xl font-semibold tracking-[-0.025em]">{item.title}</h3>
                            <p className="mt-4 text-sm leading-6 text-ink/60">{item.text}</p>
                            <ul className="mt-7 space-y-3">
                                {item.items.map((point) => (
                                    <li key={point} className="flex items-center gap-3 text-sm text-ink/75"><Check className="h-4 w-4 shrink-0 text-signal" aria-hidden="true" />{point}</li>
                                ))}
                            </ul>
                            <Link to={item.to} className="group mt-9 inline-flex min-h-[44px] items-center gap-2 text-sm font-semibold text-signal">
                                {item.cta}
                                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                            </Link>
                        </article>
                    </Reveal>
                ))}
            </div>
        </div>
    </section>
);

const CmmsTeaser = () => (
    <section data-testid="home-tmms-teaser" className="relative overflow-hidden bg-ink text-paper">
        <div className="cmms-glow" aria-hidden="true" />
        <div className="container-shell relative grid items-center gap-14 py-20 lg:grid-cols-12 lg:py-28">
            <Reveal className="lg:col-span-6">
                <div className="flex flex-wrap items-center gap-4">
                    <p className="eyebrow text-signalhi">Nachi CMMS</p>
                    <span className="rounded-full border border-white/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/[0.55]">In development</span>
                </div>
                <h2 className="h-section mt-6 max-w-2xl">Maintenance information should drive the next decision—not disappear into another spreadsheet.</h2>
                <p className="mt-6 max-w-xl text-base leading-7 text-white/[0.62]">
                    Nachi CMMS is a computerised maintenance management system being developed to connect asset records,
                    work orders, planned maintenance and spare-parts information in one controlled workflow.
                </p>
                <Link to={SECONDARY_CTA.to} data-testid="cta-explore-tmms-teaser" className="group mt-8 inline-flex min-h-[44px] items-center gap-2 text-sm font-semibold text-signalhi hover:text-white">
                    Explore Nachi CMMS
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                </Link>
            </Reveal>
            <Reveal delay={0.08} className="lg:col-span-5 lg:col-start-8">
                <div className="cmms-panel">
                    <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                        <span className="text-sm font-semibold text-white">A connected maintenance picture</span>
                        <Settings2 className="h-4 w-4 text-signalhi" aria-hidden="true" />
                    </div>
                    <div className="grid gap-px bg-white/10 sm:grid-cols-2">
                        {[
                            [Factory, "Assets", "Structured records"],
                            [Wrench, "Work orders", "Planned & reactive"],
                            [ClipboardCheck, "Maintenance", "History retained"],
                            [Gauge, "Inventory", "Parts visibility"],
                        ].map(([Icon, title, detail]) => (
                            <div key={title} className="bg-[#151820] p-5">
                                <Icon className="h-5 w-5 text-signalhi" aria-hidden="true" />
                                <p className="mt-5 text-sm font-semibold text-white">{title}</p>
                                <p className="mt-1 text-xs text-white/[0.45]">{detail}</p>
                            </div>
                        ))}
                    </div>
                    <p className="border-t border-white/10 px-5 py-4 text-xs leading-5 text-white/[0.45]">Private demonstrations use sample data. No released product or customer deployment is claimed.</p>
                </div>
            </Reveal>
        </div>
    </section>
);

const Credibility = () => (
    <section data-testid="home-credibility" className="bg-paper">
        <div className="container-shell py-20 md:py-28">
            <Reveal>
                <p className="eyebrow text-signal">Built on engineering practice</p>
                <div className="mt-5 grid gap-8 lg:grid-cols-12">
                    <h2 className="h-section lg:col-span-5">Technical credibility, stated plainly.</h2>
                    <div className="lg:col-span-6 lg:col-start-7">
                        <p className="text-base leading-7 text-ink/[0.65]">Nachi Eng combines hands-on industrial maintenance experience with disciplined engineering and maintenance-technology thinking.</p>
                        <ul className="mt-7 space-y-3">
                            {CREDENTIALS.map((credential) => (
                                <li key={credential} className="flex items-start gap-3 text-sm leading-6 text-ink/75"><Check className="mt-1 h-4 w-4 shrink-0 text-signal" aria-hidden="true" />{credential}</li>
                            ))}
                        </ul>
                        <Link to="/about" className="group mt-7 inline-flex min-h-[44px] items-center gap-2 text-sm font-semibold text-signal">About Nachi Eng<ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" /></Link>
                    </div>
                </div>
            </Reveal>
            <Reveal delay={0.08}>
                <dl className="mt-14 grid gap-px border border-ink/10 bg-ink/10 sm:grid-cols-3">
                    {COMPANY_FACTS.map((fact) => (
                        <div key={fact.label} className="bg-paper p-6 md:p-8">
                            <dt className="eyebrow text-ink/[0.45]">{fact.label}</dt>
                            <dd className="mt-4 text-lg font-semibold tracking-[-0.02em]">{fact.value}</dd>
                            <dd className="mt-1 text-sm text-ink/[0.55]">{fact.detail}</dd>
                        </div>
                    ))}
                </dl>
            </Reveal>
        </div>
    </section>
);

const Industries = () => (
    <section data-testid="home-industries" className="border-t border-ink/10 bg-paper">
        <div className="container-shell py-16 md:py-20">
            <Reveal>
                <div className="grid items-start gap-8 lg:grid-cols-12">
                    <div className="lg:col-span-4">
                        <p className="eyebrow text-signal">Environments we understand</p>
                        <h2 className="mt-5 text-2xl font-semibold tracking-[-0.025em] md:text-3xl">Industrial operations where maintenance matters.</h2>
                    </div>
                    <ul className="grid gap-2 sm:grid-cols-2 lg:col-span-7 lg:col-start-6">
                        {INDUSTRIES.map((industry) => (
                            <li key={industry} className="flex min-h-[54px] items-center gap-3 border border-ink/10 bg-white/[0.35] px-4 text-sm font-medium text-ink/75"><span className="h-1.5 w-1.5 rounded-full bg-signal" aria-hidden="true" />{industry}</li>
                        ))}
                    </ul>
                </div>
            </Reveal>
        </div>
    </section>
);

const Insights = () => (
    <section data-testid="home-insights" className="bg-[#eeece7]">
        <div className="container-shell py-20 md:py-24">
            <Reveal>
                <div className="flex flex-wrap items-end justify-between gap-6">
                    <div>
                        <p className="eyebrow text-signal">Practical thinking</p>
                        <h2 className="h-section mt-5">Insights from the maintenance floor.</h2>
                    </div>
                    <Link to="/insights" className="group inline-flex min-h-[44px] items-center gap-2 text-sm font-semibold text-signal">View all insights<ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" /></Link>
                </div>
            </Reveal>
            <div className="mt-10 grid gap-4 md:grid-cols-2">
                {ARTICLES.map((article, index) => (
                    <Reveal key={article.title} delay={index * 0.06}>
                        <Link to={article.to} data-testid={`home-article-${article.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 30)}`} className="insight-card group">
                            <span className="eyebrow text-ink/40">Article · 0{index + 1}</span>
                            <span className="mt-8 block text-xl font-semibold leading-7 tracking-[-0.025em] md:text-2xl">{article.title}</span>
                            <span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-signal">Read article<ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" /></span>
                        </Link>
                    </Reveal>
                ))}
            </div>
        </div>
    </section>
);

export default function HomePage() {
    return (
        <>
            <Seo
                title="Nachi Eng Ltd | Industrial Engineering & Maintenance, Essex"
                description="Industrial maintenance, fault-finding and engineering support for factories, warehouses and facilities across London, Essex and the South East."
                path="/"
                jsonLd={HOME_JSONLD}
            />
            <Hero />
            <Services />
            <WaysToWork />
            <CmmsTeaser />
            <Credibility />
            <Industries />
            <Insights />
            <EnquiryCta num="07" />
        </>
    );
}
