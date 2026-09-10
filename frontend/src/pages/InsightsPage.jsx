import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { Seo } from "../components/seo/Seo";
import { Reveal } from "../components/motion/Reveal";
import { EnquiryCta } from "../components/EnquiryCta";
import { COMPANY } from "../content/site";
import { INSIGHTS } from "../content/insights";

const INSIGHTS_JSONLD = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Nachi Eng Ltd — Insights",
    url: `${COMPANY.canonicalOrigin}/insights`,
    blogPost: INSIGHTS.map((a) => ({
        "@type": "BlogPosting",
        headline: a.title,
        description: a.description,
        datePublished: a.dateIso,
        url: `${COMPANY.canonicalOrigin}/insights/${a.slug}`,
    })),
};

export default function InsightsPage() {
    return (
        <>
            <Seo
                title="Insights | Nachi Eng Ltd"
                description="Articles on maintenance practice and maintenance technology, written from the maintenance floor."
                path="/insights"
                jsonLd={INSIGHTS_JSONLD}
            />
            <section data-testid="page-insights" className="bg-paper">
                <div className="container-shell py-24 md:py-32">
                    <p className="eyebrow text-signal">Insights</p>
                    <h1 className="h-display mt-6 max-w-3xl">Notes on maintenance practice and technology.</h1>
                    <p className="mt-6 max-w-xl text-sm leading-6 text-ink/70 md:text-base md:leading-7">
                        Articles on maintenance practice and maintenance technology, written from the maintenance floor.
                    </p>

                    <ul className="mt-16 border-t border-ink/10">
                        {INSIGHTS.map((a, i) => (
                            <Reveal key={a.slug} delay={i * 0.05}>
                                <li className="border-b border-ink/10">
                                    <Link
                                        to={`/insights/${a.slug}`}
                                        data-testid={`insights-article-${a.slug}`}
                                        className="group grid gap-4 py-8 md:grid-cols-12 md:gap-8 md:py-10"
                                    >
                                        <div className="md:col-span-3">
                                            <p className="eyebrow text-signal">{a.tag}</p>
                                            <p className="mt-3 font-mono text-xs tracking-[0.12em] text-ink/50">
                                                {a.date} · {a.readingTime}
                                            </p>
                                        </div>
                                        <div className="md:col-span-9">
                                            <h2 className="font-expanded text-2xl font-semibold tracking-tight transition-colors duration-200 group-hover:text-signal md:text-3xl">
                                                {a.title}
                                            </h2>
                                            <p className="mt-3 max-w-2xl text-sm leading-6 text-ink/70 md:text-base md:leading-7">
                                                {a.dek}
                                            </p>
                                            <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-ink">
                                                Read article
                                                <ArrowUpRight
                                                    className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                                                    aria-hidden="true"
                                                />
                                            </span>
                                        </div>
                                    </Link>
                                </li>
                            </Reveal>
                        ))}
                    </ul>
                </div>
            </section>
            <EnquiryCta num="02" />
        </>
    );
}
