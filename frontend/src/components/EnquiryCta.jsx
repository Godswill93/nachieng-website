import { ArrowUpRight } from "lucide-react";
import { COMPANY } from "../content/site";
import { Chapter } from "./layout/Chapter";
import { Reveal } from "./motion/Reveal";
import { PrimaryButton } from "./PrimaryButton";

export const EnquiryCta = ({ num }) => (
    <section data-testid="enquiry-cta" className="bg-ink text-paper">
        <div className="container-shell py-24 md:py-32">
            <Reveal>
                <Chapter num={num} label="Enquiry" dark />
            </Reveal>
            <Reveal delay={0.05}>
                <h2 className="h-display mt-12 max-w-3xl">Discuss an engineering requirement.</h2>
            </Reveal>
            <Reveal delay={0.15}>
                <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
                    <PrimaryButton dark />
                    <a
                        href={COMPANY.calendly}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-testid="cta-book-call"
                        className="group inline-flex min-h-[48px] items-center gap-2 px-2 py-3 text-sm text-white/80 transition-colors duration-200 hover:text-white"
                    >
                        Book a 30-minute call
                        <ArrowUpRight
                            className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                            aria-hidden="true"
                        />
                    </a>
                </div>
                <p className="mt-10 font-mono text-xs leading-6 tracking-[0.12em] text-white/60">
                    {COMPANY.email} · {COMPANY.phoneDisplay}
                    <br />
                    Response {COMPANY.responseCommitment}
                </p>
            </Reveal>
        </div>
    </section>
);
