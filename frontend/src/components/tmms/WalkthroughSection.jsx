import { Chapter } from "../layout/Chapter";
import { Reveal } from "../motion/Reveal";
import { WalkthroughMedia } from "./WalkthroughMedia";
import { SHOW_PREVIEW_MEDIA, WALKTHROUGH } from "../../content/tmms";

export const WalkthroughSection = ({ num }) => {
    const items = WALKTHROUGH.items.filter((i) => i.published || SHOW_PREVIEW_MEDIA);
    if (items.length === 0) return null;
    const previewOnly = items.some((i) => !i.published);
    return (
        <section data-testid="tmms-walkthrough" className="bg-ink text-paper">
            <div className="container-shell py-24 md:py-32">
                <Reveal>
                    <Chapter num={num} label="Walkthrough" dark />
                </Reveal>
                <Reveal delay={0.05}>
                    <h2 className="h-section mt-12 max-w-2xl">{WALKTHROUGH.title}</h2>
                    <p className="mt-5 max-w-xl text-sm leading-6 text-white/70 md:text-base md:leading-7">{WALKTHROUGH.intro}</p>
                </Reveal>
                {previewOnly && (
                    <p data-testid="tmms-walkthrough-preview-notice" className="mt-6 inline-block border border-signalhi/50 px-3 py-1.5 font-mono text-xs tracking-[0.12em] text-signalhi">
                        PREVIEW ONLY — unpublished items are hidden in production
                    </p>
                )}
                <div className="mt-12 grid gap-px bg-white/10 sm:grid-cols-2">
                    {items.map((item, i) => (
                        <Reveal key={item.id} delay={0.05 * i} className="bg-ink">
                            <WalkthroughMedia item={item} />
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
};
