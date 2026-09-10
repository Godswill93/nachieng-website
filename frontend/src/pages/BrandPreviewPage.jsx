import { Seo } from "../components/seo/Seo";

const Swatch = ({ dark, children, label }) => (
    <div className={`${dark ? "bg-ink text-paper" : "border border-ink/10 bg-paper text-ink"} p-10`}>
        <p className={`eyebrow ${dark ? "text-white/50" : "text-ink/70"}`}>{label}</p>
        <div className="mt-8 flex flex-wrap items-center gap-10">{children}</div>
    </div>
);

export default function BrandPreviewPage() {
    return (
        <section data-testid="page-brand-preview" className="bg-paper">
            <Seo title="Brand preview | Nachi Eng Ltd" description="Internal brand preview." path="/brand-preview" noindex />
            <div className="container-shell py-20 md:py-28">
                <p className="eyebrow text-signal">Brand — applied to the live site (internal reference, not linked)</p>
                <h1 className="h-display mt-6 max-w-3xl">Wordmark and N mark.</h1>
                <div className="mt-14 grid gap-px bg-ink/10 md:grid-cols-2">
                    <Swatch label="Primary lockup — light background">
                        <img src="/brand/nachi-eng-wordmark-ink.svg" alt="Nachi Eng Ltd wordmark, ink" className="h-8 md:h-10" />
                    </Swatch>
                    <Swatch dark label="Primary lockup — dark background">
                        <img src="/brand/nachi-eng-wordmark-paper.svg" alt="Nachi Eng Ltd wordmark, paper" className="h-8 md:h-10" />
                    </Swatch>
                    <Swatch label="Stacked — tight spaces only">
                        <img src="/brand/nachi-eng-wordmark-stacked-ink.svg" alt="Stacked wordmark, ink" className="h-16" />
                    </Swatch>
                    <Swatch dark label="Stacked — dark background">
                        <img src="/brand/nachi-eng-wordmark-stacked-paper.svg" alt="Stacked wordmark, paper" className="h-16" />
                    </Swatch>
                    <Swatch label="N mark / favicon — paper tile">
                        <img src="/brand/nachi-eng-mark-paper.svg" alt="N mark on paper" className="h-24 w-24 border border-ink/10" />
                        <img src="/brand/nachi-eng-mark-paper.svg" alt="" className="h-8 w-8 border border-ink/10" />
                        <img src="/brand/nachi-eng-mark-paper.svg" alt="" className="h-4 w-4 border border-ink/10" />
                    </Swatch>
                    <Swatch dark label="N mark / favicon — ink tile">
                        <img src="/brand/nachi-eng-mark-ink.svg" alt="N mark on ink" className="h-24 w-24 border border-white/15" />
                        <img src="/brand/nachi-eng-mark-ink.svg" alt="" className="h-8 w-8 border border-white/15" />
                        <img src="/brand/nachi-eng-mark-ink.svg" alt="" className="h-4 w-4 border border-white/15" />
                    </Swatch>
                </div>
                <div className="mt-14 grid gap-px bg-ink/10 md:grid-cols-2">
                    <div className="border border-ink/10 bg-paper p-6">
                        <p className="eyebrow text-ink/70">Header — as applied</p>
                        <div className="mt-6 flex h-16 items-center justify-between border-b border-ink/10">
                            <img src="/brand/nachi-eng-wordmark-ink.svg" alt="" className="h-[18px]" />
                            <span className="text-sm text-ink/60">Services · TMMS · About · Insights</span>
                        </div>
                    </div>
                    <div className="bg-ink p-6 text-paper">
                        <p className="eyebrow text-white/50">Footer — as applied</p>
                        <div className="mt-6 flex h-16 items-center justify-between">
                            <img src="/brand/nachi-eng-wordmark-paper.svg" alt="" className="h-[18px]" />
                            <span className="font-mono text-xs tracking-[0.12em] text-white/60">© 2025–2026 Nachi Eng Ltd</span>
                        </div>
                    </div>
                </div>
                <ul className="mt-10 max-w-2xl space-y-2 text-sm leading-6 text-ink/70">
                    <li>Files: /brand/ — SVG (ink, paper, stacked ×2, mark ×2, favicon.svg with automatic dark-mode swap, apple-touch-icon) + transparent PNG exports at 2400 px, 1600 px, 1024 px, 512, 192, 180 and 32 px.</li>
                    <li>Type is converted to outlines — no font dependency. Archivo 700 / width 118 for NACHI ENG; IBM Plex Mono 500 at 55% with 0.18 em tracking for LTD.</li>
                    <li>Applied to the live header, footer and favicon (and Apple touch icon).</li>
                </ul>
            </div>
        </section>
    );
}
