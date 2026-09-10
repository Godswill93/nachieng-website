import { Seo } from "../components/seo/Seo";
import { Reveal } from "../components/motion/Reveal";
import { Chapter } from "../components/layout/Chapter";
import { IndustryGrid } from "../components/IndustryGrid";
import { EnquiryCta } from "../components/EnquiryCta";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../components/ui/accordion";
import { COMPANY } from "../content/site";
import { SERVICE_BLOCKS, ENQUIRY_STEPS, FAQS } from "../content/services";

const SERVICES_JSONLD = {
    "@context": "https://schema.org",
    "@graph": [
        {
            "@type": "Service",
            name: "Industrial engineering and maintenance services",
            provider: { "@id": `${COMPANY.canonicalOrigin}/#org` },
            areaServed: ["London", "Essex", "South East England"],
            serviceType: [
                "Industrial electrical maintenance",
                "Industrial mechanical maintenance",
                "Fault-finding and diagnostics",
                "Planned preventive maintenance",
                "Maintenance improvement",
                "Maintenance consultancy",
            ],
        },
        {
            "@type": "FAQPage",
            mainEntity: FAQS.map((f) => ({
                "@type": "Question",
                name: f.q,
                acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
        },
        {
            "@type": "BreadcrumbList",
            itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: `${COMPANY.canonicalOrigin}/` },
                { "@type": "ListItem", position: 2, name: "Services", item: `${COMPANY.canonicalOrigin}/services` },
            ],
        },
    ],
};

const PageIntro = () => (
    <section data-testid="services-intro" className="bg-paper">
        <div className="container-shell pb-16 pt-24 md:pb-20 md:pt-32">
            <p className="eyebrow text-signal">Services</p>
            <h1 className="h-display mt-8 max-w-4xl">Industrial engineering &amp; maintenance, scoped precisely.</h1>
            <Reveal delay={0.15}>
                <p className="mt-8 max-w-xl text-base leading-7 text-ink/70 md:text-lg md:leading-8">
                    Five areas of work. Each starts from the same position: defined scope, demonstrated
                    competence, and a clear record of what is — and is not — covered.
                </p>
            </Reveal>
        </div>
    </section>
);

const ServiceBlock = ({ block, index }) => {
    const num = String(index + 1).padStart(2, "0");
    return (
        <section data-testid={`service-${block.slug}`} className="bg-paper">
            <div className="container-shell pb-20 md:pb-24">
                <Reveal>
                    <Chapter num={num} label={block.title} />
                </Reveal>
                <div className="mt-12 grid gap-12 md:grid-cols-12 md:gap-8">
                    <Reveal className="md:col-span-5">
                        <h2 className="h-section">{block.title}</h2>
                        <p className="mt-6 max-w-md text-sm leading-6 text-ink/70 md:text-base md:leading-7">
                            {block.summary}
                        </p>
                    </Reveal>
                    <Reveal delay={0.1} className="md:col-span-7">
                        <ul>
                            {block.items.map((item, i) => (
                                <li key={item} className="flex items-baseline gap-3 border-t border-ink/10 py-4">
                                    <span className="font-mono text-xs text-signal">
                                        {num}.{i + 1}
                                    </span>
                                    <span className="text-sm leading-6">{item}</span>
                                </li>
                            ))}
                        </ul>
                        <div className="mt-8 border-l-2 border-signal pl-5">
                            <p className="eyebrow text-ink/60">Scope boundary</p>
                            <p className="mt-2 max-w-lg text-sm leading-6 text-ink/80">{block.boundary}</p>
                        </div>
                    </Reveal>
                </div>
            </div>
        </section>
    );
};

const Targets = () => (
    <section data-testid="services-targets" className="bg-paper">
        <div className="container-shell pb-24">
            <Reveal>
                <Chapter num="06" label="Target environments" />
            </Reveal>
            <Reveal delay={0.05}>
                <p className="mt-12 max-w-2xl text-sm leading-6 text-ink/70 md:text-base md:leading-7">
                    Industrial environments whose maintenance challenges Nachi Eng understands and intends to
                    support.
                </p>
            </Reveal>
            <Reveal delay={0.1}>
                <div className="mt-10">
                    <IndustryGrid />
                </div>
            </Reveal>
        </div>
    </section>
);

const EnquiryProcess = () => (
    <section data-testid="services-enquiry-process" className="bg-paper">
        <div className="container-shell pb-24">
            <Reveal>
                <Chapter num="07" label="What happens when you enquire" />
            </Reveal>
            <Reveal delay={0.05}>
                <ol className="mt-12 grid gap-px border border-ink/10 bg-ink/10 md:grid-cols-3">
                    {ENQUIRY_STEPS.map((s, i) => (
                        <li key={s.title} className="bg-paper p-6 md:p-8">
                            <p className="font-mono text-xs text-signal">{String(i + 1).padStart(2, "0")}</p>
                            <h3 className="font-expanded mt-4 text-lg font-semibold tracking-tight">{s.title}</h3>
                            <p className="mt-3 text-sm leading-6 text-ink/70">{s.text}</p>
                        </li>
                    ))}
                </ol>
            </Reveal>
        </div>
    </section>
);

const Faq = () => (
    <section data-testid="services-faq" className="bg-paper">
        <div className="container-shell pb-24 md:pb-32">
            <Reveal>
                <Chapter num="08" label="Questions" />
            </Reveal>
            <Reveal delay={0.05}>
                <div className="mt-12 max-w-3xl border-t border-ink/10">
                    <Accordion type="single" collapsible>
                        {FAQS.map((f, i) => (
                            <AccordionItem key={f.q} value={`faq-${i}`} className="border-ink/10">
                                <AccordionTrigger
                                    data-testid={`faq-trigger-${i}`}
                                    className="min-h-[56px] py-5 text-base font-medium transition-colors hover:text-signal hover:no-underline"
                                >
                                    {f.q}
                                </AccordionTrigger>
                                <AccordionContent className="max-w-2xl text-sm leading-6 text-ink/70">
                                    {f.a}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </Reveal>
        </div>
    </section>
);

export default function ServicesPage() {
    return (
        <>
            <Seo
                title="Services | Industrial Maintenance & Engineering | Nachi Eng"
                description="Industrial electrical and mechanical maintenance, fault-finding, controls support and maintenance improvement across London, Essex and the South East."
                path="/services"
                jsonLd={SERVICES_JSONLD}
            />
            <PageIntro />
            {SERVICE_BLOCKS.map((block, i) => (
                <ServiceBlock key={block.slug} block={block} index={i} />
            ))}
            <Targets />
            <EnquiryProcess />
            <Faq />
            <EnquiryCta num="09" />
        </>
    );
}
