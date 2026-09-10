import { Seo } from "../components/seo/Seo";
import { COMPANY } from "../content/site";

const DraftBanner = () => (
    <p data-testid="legal-draft-banner" className="mb-10 border-l-2 border-signal bg-signal/[0.06] px-5 py-4 font-mono text-xs leading-6 tracking-[0.08em] text-ink/70">
        DRAFT FOR OWNER REVIEW — not yet legal advice. Please review and confirm before this policy is treated as published.
    </p>
);

const Section = ({ heading, children }) => (
    <section className="border-t border-ink/10 py-8">
        <h2 className="font-expanded text-xl font-semibold tracking-tight text-ink md:text-2xl">{heading}</h2>
        <div className="mt-4 space-y-4 text-sm leading-7 text-ink/75 md:text-base">{children}</div>
    </section>
);

export default function CookiePage() {
    return (
        <section data-testid="page-cookies" className="bg-paper">
            <Seo
                title="Cookie Policy | Nachi Eng Ltd"
                description="This website sets no analytics or advertising cookies. How this website uses browser storage. Draft for owner review."
                path="/cookies"
            />
            <div className="container-shell max-w-3xl py-24 md:py-32">
                <p className="eyebrow text-signal">Legal</p>
                <h1 className="h-display mt-6">Cookie Policy</h1>
                <p className="mt-6 text-sm leading-7 text-ink/70 md:text-base">
                    This policy explains how this website uses cookies and browser storage. It reflects only what this website
                    currently does.
                </p>

                <div className="mt-12">
                    <DraftBanner />

                    <Section heading="No analytics or advertising cookies">
                        <p>
                            This website does not use analytics, advertising or tracking cookies, and it does not build a profile of
                            your activity. We have verified that no such cookies are set by this website. Because no non-essential
                            cookies are set, no cookie consent banner is shown.
                        </p>
                        <p>
                            We have also confirmed that no other local storage, session storage, tracking pixels, analytics scripts or
                            marketing technologies are active on this website, beyond the single essential item described below.
                        </p>
                    </Section>

                    <Section heading="Essential browser storage we do use">
                        <p>
                            When you view a TMMS demonstration, we store a small flag in your browser (using local storage, not a
                            cookie) to remember that you have seen the short introductory tour, so it does not appear again. This is
                            used only for that essential user-interface function: it contains no personal data, is never sent to us and
                            is not used for tracking. You can clear it at any time through your browser settings.
                        </p>
                    </Section>

                    <Section heading="Third-party services">
                        <p>
                            If you follow our booking link, you are taken to <a className="text-signal underline underline-offset-4" href="https://calendly.com/privacy" target="_blank" rel="noopener noreferrer">Calendly</a>. Any Calendly cookies apply only after you leave
                            this website and arrive on Calendly&rsquo;s own platform, under its own cookie policy. They are not set by this
                            website.
                        </p>
                        <p>
                            Enquiries are delivered by email using <a className="text-signal underline underline-offset-4" href="https://resend.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">Resend</a>. This is a server-side email service and does not set
                            cookies in your browser.
                        </p>
                    </Section>

                    <Section heading="Changes to this policy">
                        <p>
                            If this website ever introduces cookies that are not essential, this policy will be updated and appropriate
                            consent will be requested first. For any question, contact <a className="text-signal underline underline-offset-4" href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>.
                        </p>
                    </Section>
                </div>
            </div>
        </section>
    );
}
