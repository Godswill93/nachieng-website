import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Seo } from "../components/seo/Seo";
import { Reveal } from "../components/motion/Reveal";
import { KineticLines } from "../components/motion/KineticLines";
import { Chapter } from "../components/layout/Chapter";
import { IndustryGrid } from "../components/IndustryGrid";
import { PrimaryButton } from "../components/PrimaryButton";
import { EnquiryCta } from "../components/EnquiryCta";
import {
    COMPANY,
    CREDENTIALS,
    EXPERIENCE_STATEMENT,
    FOUNDER,
    FOUNDER_BIO,
    ARTICLES,
    SECONDARY_CTA,
} from "../content/site";

const TIER_ONE_ITEMS = [
    "Industrial electrical maintenance & fault-finding",
    "Industrial mechanical maintenance & fault-finding",
    "Planned preventive maintenance",
    "Reactive maintenance support",
    "PLC fault-finding & diagnostics",
    "Motors & variable-frequency drives",
    "Conveyor & automated-equipment maintenance",
    "Pumps & industrial equipment support",
];

const TIER_TWO_ITEMS = [
    "Root-cause analysis",
    "Maintenance improvement",
    "Maintenance workflow & data design",
    "CMMS advisory",
    "Engineering technical support",
];

const COMPANY_FACTS = [
    { label: "Registered", value: "England & Wales — No. 16567818" },
    { label: "Incorporated", value: "July 2025 — Active" },
    { label: "Based", value: "Southend-on-Sea, Essex" },
    { label: "Coverage", value: "London, Essex & the South East" },
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
            telephone: "+44 7480 286 830",
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

const HeroDecor = () => (
    <svg
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-0 hidden h-full w-1/2 md:block"
        viewBox="0 0 600 800"
        fill="none"
        preserveAspectRatio="xMaxYMid slice"
    >
        <line x1="120" y1="0" x2="120" y2="800" stroke="white" strokeOpacity="0.07" />
        <line x1="300" y1="0" x2="300" y2="800" stroke="white" strokeOpacity="0.05" />
        <line x1="480" y1="0" x2="480" y2="800" stroke="white" strokeOpacity="0.07" />
        <line x1="120" y1="240" x2="480" y2="240" stroke="white" strokeOpacity="0.12" />
        <line x1="120" y1="230" x2="120" y2="250" stroke="white" strokeOpacity="0.3" />
        <line x1="480" y1="230" x2="480" y2="250" stroke="white" strokeOpacity="0.3" />
        <line x1="150" y1="560" x2="330" y2="380" stroke="#6E86F0" strokeOpacity="0.6" />
        <circle cx="330" cy="380" r="3.5" fill="#6E86F0" />
        <path d="M300 640 h84 M300 632 v16 M384 632 v16" stroke="white" strokeOpacity="0.18" />
        <path d="M470 116 v20 M460 126 h20" stroke="white" strokeOpacity="0.22" />
        <path d="M150 60 v14 M143 67 h14" stroke="white" strokeOpacity="0.15" />
    </svg>
);

const Hero = () => (
    <section data-testid="home-hero" className="relative overflow-hidden bg-ink text-paper">
        <HeroDecor />
        <div className="container-shell relative pb-24 pt-28 md:pb-36 md:pt-44">
            <p className="eyebrow text-white/60">Industrial engineering &amp; technology · Southend-on-Sea, Essex</p>
            <h1 className="h-display mt-8 max-w-4xl">
                <KineticLines lines={["When production equipment stops,", "everything else stops with it."]} />
            </h1>
            <Reveal delay={0.55}>
                <p className="mt-8 max-w-xl text-base leading-7 text-white/70 md:text-lg md:leading-8">
                    Nachi Eng Ltd provides industrial electrical and mechanical maintenance, fault-finding and
                    maintenance improvement for factories, warehouses and commercial facilities across London,
                    Essex and the South East.
                </p>
            </Reveal>
            <Reveal delay={0.7}>
                <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
                    <PrimaryButton dark />
                    <Link
                        to={SECONDARY_CTA.to}
                        data-testid={SECONDARY_CTA.testId}
                        className="group inline-flex min-h-[48px] items-center gap-2 px-2 py-3 text-sm text-white/80 transition-colors duration-200 hover:text-white"
                    >
                        {SECONDARY_CTA.label}
                        <ArrowUpRight
                            className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                            aria-hidden="true"
                        />
                    </Link>
                </div>
                <p className="mt-8 font-mono text-xs tracking-[0.12em] text-white/60">
                    Response {COMPANY.responseCommitment}
                </p>
            </Reveal>
        </div>
    </section>
);

const TierOne = () => (
    <section data-testid="home-tier-engineering" className="bg-paper">
        <div className="container-shell py-24 md:py-32">
            <Reveal>
                <Chapter num="01" label="Industrial engineering & maintenance" />
            </Reveal>
            <div className="mt-12 grid gap-12 md:grid-cols-12 md:gap-8">
                <Reveal className="md:col-span-5">
                    <h2 className="h-section">The core offer — engineering and maintenance expertise you can engage today.</h2>
                    <p className="mt-6 max-w-md text-sm leading-6 text-ink/70 md:text-base md:leading-7">
                        Planned and reactive support for the electrical and mechanical systems industrial
                        operations run on, within demonstrated competence.
                    </p>
                    <Link
                        to="/services"
                        data-testid="home-services-link"
                        className="group mt-8 inline-flex min-h-[44px] items-center gap-2 text-sm font-medium text-signal"
                    >
                        Full service scope
                        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true" />
                    </Link>
                </Reveal>
                <Reveal delay={0.1} className="md:col-span-7">
                    <ul className="grid gap-x-10 sm:grid-cols-2">
                        {TIER_ONE_ITEMS.map((item, i) => (
                            <li key={item} className="flex items-baseline gap-3 border-t border-ink/10 py-4">
                                <span className="font-mono text-xs text-signal">{String(i + 1).padStart(2, "0")}</span>
                                <span className="text-sm leading-6">{item}</span>
                            </li>
                        ))}
                    </ul>
                </Reveal>
            </div>
        </div>
    </section>
);

const TierTwo = () => (
    <section data-testid="home-tier-improvement" className="bg-paper">
        <div className="container-shell pb-24 md:pb-32">
            <Reveal>
                <Chapter num="02" label="Technology & maintenance improvement" />
            </Reveal>
            <div className="mt-12 grid gap-12 md:grid-cols-12 md:gap-8">
                <Reveal className="md:col-span-5">
                    <h2 className="h-section">Reliability, treated as a discipline — not an aspiration.</h2>
                    <p className="mt-6 max-w-md text-sm leading-6 text-ink/70 md:text-base md:leading-7">
                        Structured improvement work: finding why failures happen, and designing the workflows
                        and data that stop them repeating.
                    </p>
                </Reveal>
                <Reveal delay={0.1} className="md:col-span-7">
                    <ul className="grid gap-x-10 sm:grid-cols-2">
                        {TIER_TWO_ITEMS.map((item, i) => (
                            <li key={item} className="flex items-baseline gap-3 border-t border-ink/10 py-4">
                                <span className="font-mono text-xs text-signal">{String(i + 1).padStart(2, "0")}</span>
                                <span className="text-sm leading-6">{item}</span>
                            </li>
                        ))}
                    </ul>
                </Reveal>
            </div>
        </div>
    </section>
);

const TmmsTeaser = () => (
    <section data-testid="home-tmms-teaser" className="bg-ink text-paper">
        <div className="container-shell grid items-end gap-10 py-16 md:grid-cols-12 md:py-20">
            <Reveal className="md:col-span-8">
                <p className="eyebrow flex flex-wrap items-center gap-4 text-white/60">
                    <span>
                        <span className="text-signalhi">03</span> — TMMS
                    </span>
                    <span className="border border-white/25 px-2 py-0.5 text-[10px] tracking-[0.18em] text-white/70">
                        IN DEVELOPMENT
                    </span>
                </p>
                <h2 className="h-section mt-6 max-w-2xl">TMMS — a Maintenance Management System, designed from the maintenance floor.</h2>
                <p className="mt-5 max-w-xl text-sm leading-6 text-white/70 md:text-base md:leading-7">
                    A real product currently in development, informed by hands-on experience in industrial
                    maintenance and manufacturing operations. Private demonstration available by enquiry.
                </p>
            </Reveal>
            <Reveal delay={0.1} className="md:col-span-4 md:text-right">
                <Link
                    to={SECONDARY_CTA.to}
                    data-testid="cta-explore-tmms-teaser"
                    className="group inline-flex min-h-[44px] items-center gap-2 text-sm font-medium text-signalhi transition-colors duration-200 hover:text-white"
                >
                    {SECONDARY_CTA.label}
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                </Link>
            </Reveal>
        </div>
    </section>
);

const Credibility = () => (
    <section data-testid="home-credibility" className="bg-paper">
        <div className="container-shell py-24 md:py-32">
            <Reveal>
                <Chapter num="04" label="The company, on the record" />
            </Reveal>
            <Reveal delay={0.05}>
                <dl className="mt-12 grid gap-px border border-ink/10 bg-ink/10 sm:grid-cols-2 lg:grid-cols-4">
                    {COMPANY_FACTS.map((f) => (
                        <div key={f.label} className="bg-paper p-6">
                            <dt className="eyebrow text-ink/70">{f.label}</dt>
                            <dd className="font-expanded mt-3 text-base font-semibold leading-6">{f.value}</dd>
                        </div>
                    ))}
                </dl>
            </Reveal>
            <div className="mt-16 grid gap-12 md:grid-cols-12 md:gap-8">
                <Reveal className="md:col-span-6">
                    <h3 className="eyebrow text-ink/60">Credentials</h3>
                    <ul className="mt-6 space-y-4">
                        {CREDENTIALS.map((c) => (
                            <li key={c} className="flex items-start gap-3">
                                <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-signal" aria-hidden="true" />
                                <span className="text-sm leading-6 md:text-base">{c}</span>
                            </li>
                        ))}
                    </ul>
                </Reveal>
                <Reveal delay={0.1} className="md:col-span-6">
                    <h3 className="eyebrow text-ink/60">Supporting experience</h3>
                    <p className="mt-6 border-l-2 border-signal pl-5 text-sm leading-6 text-ink/80 md:text-base md:leading-7">
                        {EXPERIENCE_STATEMENT}
                    </p>
                </Reveal>
            </div>
        </div>
    </section>
);

const Industries = () => (
    <section data-testid="home-industries" className="bg-paper">
        <div className="container-shell pb-24 md:pb-32">
            <Reveal>
                <Chapter num="05" label="Target environments" />
            </Reveal>
            <Reveal delay={0.05}>
                <div className="mt-12 max-w-2xl">
                    <h2 className="h-section">Environments whose maintenance challenges Nachi Eng understands — and intends to support.</h2>
                </div>
            </Reveal>
            <Reveal delay={0.1}>
                <div className="mt-12">
                    <IndustryGrid />
                </div>
            </Reveal>
        </div>
    </section>
);

const Founder = () => (
    <section data-testid="home-founder" className="bg-paper">
        <div className="container-shell pb-24 md:pb-32">
            <Reveal>
                <Chapter num="06" label="Founder" />
            </Reveal>
            <div className="mt-12 grid gap-12 md:grid-cols-12 md:gap-8">
                <Reveal className="md:col-span-5">
                    <h2 className="h-section">{FOUNDER.name}</h2>
                    <p className="eyebrow mt-4 text-ink/60">{FOUNDER.role}</p>
                    <p className="mt-6 max-w-md text-sm leading-6 text-ink/70 md:text-base md:leading-7">
                        {FOUNDER_BIO}
                    </p>
                </Reveal>
                <Reveal delay={0.1} className="md:col-span-7">
                    <h3 className="eyebrow text-ink/60">Credentials</h3>
                    <ul className="mt-6 space-y-4">
                        {CREDENTIALS.map((c) => (
                            <li key={c} className="flex items-start gap-3">
                                <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-signal" aria-hidden="true" />
                                <span className="text-sm leading-6 md:text-base">{c}</span>
                            </li>
                        ))}
                    </ul>
                    <h3 className="eyebrow mt-10 text-ink/60">Supporting experience</h3>
                    <p className="mt-5 border-l-2 border-signal pl-5 text-sm leading-6 text-ink/80 md:text-base md:leading-7">
                        {EXPERIENCE_STATEMENT}
                    </p>
                </Reveal>
            </div>
        </div>
    </section>
);

const Insights = () => (
    <section data-testid="home-insights" className="bg-paper">
        <div className="container-shell pb-24 md:pb-32">
            <Reveal>
                <Chapter num="07" label="Insights" />
            </Reveal>
            <Reveal delay={0.05}>
                <ul className="mt-12">
                    {ARTICLES.map((a) => (
                        <li key={a.title} className="border-t border-ink/10">
                            <Link
                                to={a.to}
                                data-testid={`home-article-${a.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 30)}`}
                                className="group flex min-h-[56px] items-center justify-between gap-6 py-6"
                            >
                                <span className="font-expanded text-lg font-semibold tracking-tight transition-colors duration-200 group-hover:text-signal md:text-2xl">
                                    {a.title}
                                </span>
                                <span className="flex shrink-0 items-center gap-3">
                                    <span className="eyebrow hidden text-ink/70 sm:inline">Article</span>
                                    <ArrowUpRight className="h-5 w-5 text-ink/60 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-signal" aria-hidden="true" />
                                </span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </Reveal>
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
            <TierOne />
            <TierTwo />
            <TmmsTeaser />
            <Credibility />
            <Industries />
            <Founder />
            <Insights />
            <EnquiryCta num="08" />
        </>
    );
}
