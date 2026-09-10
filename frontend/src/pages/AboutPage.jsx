import { Seo } from "../components/seo/Seo";
import { Reveal } from "../components/motion/Reveal";
import { Chapter } from "../components/layout/Chapter";
import { EnquiryCta } from "../components/EnquiryCta";
import {
    COMPANY,
    CREDENTIALS,
    EXPERIENCE_STATEMENT,
    FOUNDER,
    FOUNDER_BIO,
} from "../content/site";

const COMPANY_FACTS = [
    { label: "Registered", value: "England & Wales — No. 16567818" },
    { label: "Incorporated", value: "July 2025 — Active" },
    { label: "Based", value: "Southend-on-Sea, Essex" },
    { label: "Coverage", value: "London, Essex & the South East" },
];

const PRINCIPLES = [
    {
        title: "Scope before work",
        text: "Every engagement begins with a defined scope and stated competence boundaries, agreed before any work begins.",
    },
    {
        title: "Direct accountability",
        text: "Nachi Eng Ltd is built around one qualified engineer. You deal directly with the person who does the work.",
    },
    {
        title: "Evidence on request",
        text: "Qualification evidence is provided to serious prospects on request. It is not displayed on this website.",
    },
];

const ABOUT_JSONLD = {
    "@context": "https://schema.org",
    "@graph": [
        {
            "@type": "AboutPage",
            name: "About Nachi Eng Ltd",
            url: `${COMPANY.canonicalOrigin}/about`,
            about: { "@id": `${COMPANY.canonicalOrigin}/#org` },
        },
        {
            "@type": "Person",
            name: FOUNDER.name,
            jobTitle: "Founder & Director",
            worksFor: { "@id": `${COMPANY.canonicalOrigin}/#org` },
            memberOf: { "@type": "Organization", name: "Institution of Engineering and Technology" },
        },
        {
            "@type": "BreadcrumbList",
            itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: `${COMPANY.canonicalOrigin}/` },
                { "@type": "ListItem", position: 2, name: "About", item: `${COMPANY.canonicalOrigin}/about` },
            ],
        },
    ],
};

const PageIntro = () => (
    <section data-testid="about-intro" className="bg-paper">
        <div className="container-shell pb-16 pt-24 md:pb-20 md:pt-32">
            <p className="eyebrow text-signal">About</p>
            <h1 className="h-display mt-8 max-w-4xl">Built around one qualified engineer.</h1>
            <Reveal delay={0.15}>
                <p className="mt-8 max-w-xl text-base leading-7 text-ink/70 md:text-lg md:leading-8">
                    Nachi Eng Ltd is an industrial engineering and engineering-technology company based in
                    Southend-on-Sea, Essex — registered in England and Wales, incorporated in July 2025.
                </p>
            </Reveal>
        </div>
    </section>
);

const FounderSection = () => (
    <section data-testid="about-founder" className="bg-paper">
        <div className="container-shell pb-24">
            <Reveal>
                <Chapter num="01" label="Founder" />
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

const CompanySection = () => (
    <section data-testid="about-company" className="bg-paper">
        <div className="container-shell pb-24">
            <Reveal>
                <Chapter num="02" label="The company" />
            </Reveal>
            <Reveal delay={0.05}>
                <dl className="mt-12 grid gap-px border border-ink/10 bg-ink/10 sm:grid-cols-2 lg:grid-cols-4">
                    {COMPANY_FACTS.map((f) => (
                        <div key={f.label} className="bg-paper p-6">
                            <dt className="eyebrow text-ink/50">{f.label}</dt>
                            <dd className="font-expanded mt-3 text-base font-semibold leading-6">{f.value}</dd>
                        </div>
                    ))}
                </dl>
            </Reveal>
            <Reveal delay={0.1}>
                <p className="mt-8 max-w-2xl text-sm leading-6 text-ink/70 md:text-base md:leading-7">
                    The service area is London, Essex and the wider South East, with projects elsewhere in the
                    UK considered by agreement.
                </p>
            </Reveal>
        </div>
    </section>
);

const ApproachSection = () => (
    <section data-testid="about-approach" className="bg-paper">
        <div className="container-shell pb-24 md:pb-32">
            <Reveal>
                <Chapter num="03" label="Approach" />
            </Reveal>
            <Reveal delay={0.05}>
                <ul className="mt-12 max-w-3xl">
                    {PRINCIPLES.map((p, i) => (
                        <li key={p.title} className="flex items-baseline gap-6 border-t border-ink/10 py-6">
                            <span className="font-mono text-xs text-signal">{String(i + 1).padStart(2, "0")}</span>
                            <div>
                                <h3 className="font-expanded text-lg font-semibold tracking-tight md:text-xl">{p.title}</h3>
                                <p className="mt-2 max-w-xl text-sm leading-6 text-ink/70">{p.text}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            </Reveal>
        </div>
    </section>
);

export default function AboutPage() {
    return (
        <>
            <Seo
                title="About | Nachi Eng Ltd"
                description="Nachi Eng Ltd is an industrial engineering and technology company in Southend-on-Sea, Essex, founded in 2025 by Godswill C. Iweajunwa, BEng (Hons), MIET."
                path="/about"
                jsonLd={ABOUT_JSONLD}
            />
            <PageIntro />
            <FounderSection />
            <CompanySection />
            <ApproachSection />
            <EnquiryCta num="04" />
        </>
    );
}
