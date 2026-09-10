import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, Link2, Check } from "lucide-react";
import { Seo } from "../components/seo/Seo";
import { Reveal } from "../components/motion/Reveal";
import { PrimaryButton } from "../components/PrimaryButton";
import { COMPANY, FOUNDER } from "../content/site";
import { getArticle, INSIGHTS } from "../content/insights";
import NotFound from "./NotFound";

// Minimal inline renderer for **bold** and [label](/path) internal links. No raw HTML.
const renderInline = (text) => {
    const parts = [];
    const regex = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g;
    let last = 0;
    let m;
    let i = 0;
    while ((m = regex.exec(text)) !== null) {
        if (m.index > last) parts.push(text.slice(last, m.index));
        const token = m[0];
        if (token.startsWith("**")) {
            parts.push(<strong key={i++} className="font-semibold text-ink">{token.slice(2, -2)}</strong>);
        } else {
            const lm = /\[([^\]]+)\]\(([^)]+)\)/.exec(token);
            parts.push(
                <Link key={i++} to={lm[2]} className="font-medium text-signal underline underline-offset-4 transition-colors hover:text-ink">
                    {lm[1]}
                </Link>
            );
        }
        last = regex.lastIndex;
    }
    if (last < text.length) parts.push(text.slice(last));
    return parts;
};

const Block = ({ block }) => {
    switch (block.t) {
        case "h2":
            return <h2 className="font-expanded mt-14 text-2xl font-semibold tracking-tight text-ink md:text-3xl">{block.text}</h2>;
        case "callout":
            return (
                <div className="my-10 border-l-2 border-signal bg-ink/[0.04] px-6 py-5">
                    <p className="text-sm leading-7 text-ink/80 md:text-base">{renderInline(block.text)}</p>
                </div>
            );
        case "quote":
            return (
                <blockquote className="my-12 border-l-2 border-ink/20 pl-6">
                    <p className="font-expanded text-xl font-medium leading-snug text-ink md:text-2xl">{block.text}</p>
                    <cite className="mt-3 block font-mono text-xs not-italic tracking-[0.12em] text-ink/70">{block.cite}</cite>
                </blockquote>
            );
        case "list":
            return (
                <ul className="my-8 space-y-3">
                    {block.items.map((item, idx) => (
                        <li key={idx} className="flex gap-3 text-sm leading-7 text-ink/75 md:text-base">
                            <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-signal" aria-hidden="true" />
                            <span>{renderInline(item)}</span>
                        </li>
                    ))}
                </ul>
            );
        case "table":
            return (
                <div className="my-10 overflow-x-auto">
                    <table className="w-full border-collapse border border-ink/15 text-left text-sm">
                        <thead>
                            <tr>
                                {block.head.map((h, idx) => (
                                    <th key={idx} scope="col" className="eyebrow border-b border-ink/15 bg-ink/[0.03] px-4 py-3 text-ink/70">
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {block.rows.map((row, ri) => (
                                <tr key={ri} className="border-b border-ink/10 last:border-b-0">
                                    {row.map((cell, ci) =>
                                        ci === 0 ? (
                                            <th key={ci} scope="row" className="px-4 py-3 text-left align-top font-medium text-ink">
                                                {cell}
                                            </th>
                                        ) : (
                                            <td key={ci} className="px-4 py-3 align-top text-ink/70">
                                                {cell}
                                            </td>
                                        )
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            );
        case "divider":
            return <hr className="my-12 border-ink/10" />;
        default:
            return <p className="mt-6 text-sm leading-7 text-ink/75 md:text-base md:leading-8">{renderInline(block.text)}</p>;
    }
};

export default function ArticlePage() {
    const { slug } = useParams();
    const article = getArticle(slug);
    const [copied, setCopied] = useState(false);
    if (!article) return <NotFound />;

    const copyLink = async () => {
        const url = `${COMPANY.canonicalOrigin}/insights/${article.slug}`;
        try {
            await navigator.clipboard.writeText(url);
        } catch (e) {
            const ta = document.createElement("textarea");
            ta.value = url;
            document.body.appendChild(ta);
            ta.select();
            document.execCommand("copy");
            document.body.removeChild(ta);
        }
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2000);
    };

    const related = INSIGHTS.find((a) => a.slug === article.related);

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: article.title,
        description: article.description,
        datePublished: article.dateIso,
        url: `${COMPANY.canonicalOrigin}/insights/${article.slug}`,
        author: { "@type": "Person", name: FOUNDER.name },
        publisher: { "@type": "Organization", name: COMPANY.name },
        mainEntityOfPage: { "@type": "WebPage", "@id": `${COMPANY.canonicalOrigin}/insights/${article.slug}` },
    };

    return (
        <>
            <Seo
                title={`${article.title} | Nachi Eng Ltd`}
                description={article.description}
                path={`/insights/${article.slug}`}
                jsonLd={jsonLd}
                image={article.ogImage}
            />
            <article data-testid={`article-${article.slug}`} className="bg-paper">
                <div className="container-shell pt-10 md:pt-14">
                    <Link
                        to="/insights"
                        data-testid="article-back-link"
                        className="group inline-flex min-h-[44px] items-center gap-2 text-sm text-ink/60 transition-colors hover:text-ink"
                    >
                        <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5" aria-hidden="true" />
                        All insights
                    </Link>
                </div>

                <header className="container-shell pt-8 md:pt-10">
                    <p className="eyebrow text-signal">{article.tag}</p>
                    <h1 className="h-display mt-6 max-w-4xl">{article.title}</h1>
                    <p className="mt-6 max-w-2xl text-base leading-7 text-ink/70 md:text-lg md:leading-8">{article.dek}</p>
                    <p className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-ink/10 pt-6 font-mono text-xs tracking-[0.12em] text-ink/70">
                        <span data-testid="article-author">{FOUNDER.name}</span>
                        <span aria-hidden="true">·</span>
                        <span data-testid="article-date">{article.date}</span>
                        <span aria-hidden="true">·</span>
                        <span data-testid="article-reading-time">{article.readingTime}</span>
                    </p>
                </header>

                <div className="container-shell max-w-3xl pb-8 pt-4">
                    <Reveal>
                        <div>
                            {article.blocks.map((block, idx) => (
                                <Block key={idx} block={block} />
                            ))}
                        </div>
                    </Reveal>
                </div>

                <div className="container-shell max-w-3xl pb-20">
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-4 border-t border-ink/10 pt-10">
                        <PrimaryButton />
                        <button
                            type="button"
                            onClick={copyLink}
                            data-testid="article-copy-link"
                            aria-live="polite"
                            className="group inline-flex min-h-[48px] items-center gap-2 border border-ink/20 px-5 py-3 text-sm text-ink/70 transition-colors hover:border-ink hover:text-ink"
                        >
                            {copied ? <Check className="h-4 w-4 text-signal" aria-hidden="true" /> : <Link2 className="h-4 w-4" aria-hidden="true" />}
                            {copied ? "Link copied" : "Copy link"}
                        </button>
                        <a
                            href={COMPANY.calendly}
                            target="_blank"
                            rel="noopener noreferrer"
                            data-testid="article-calendly-link"
                            className="group inline-flex min-h-[48px] items-center gap-2 px-2 py-3 text-sm text-ink/70 transition-colors hover:text-ink"
                        >
                            Book a 30-minute call
                            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                        </a>
                    </div>

                    {related && (
                        <div className="mt-16 border-t border-ink/10 pt-8">
                            <p className="eyebrow text-ink/70">Read next</p>
                            <Link
                                to={`/insights/${related.slug}`}
                                data-testid={`article-related-${related.slug}`}
                                className="group mt-4 flex items-baseline justify-between gap-6"
                            >
                                <span className="font-expanded text-lg font-semibold tracking-tight transition-colors duration-200 group-hover:text-signal md:text-2xl">
                                    {related.title}
                                </span>
                                <ArrowUpRight className="h-5 w-5 shrink-0 text-ink/60 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-signal" aria-hidden="true" />
                            </Link>
                        </div>
                    )}
                </div>
            </article>
        </>
    );
}
