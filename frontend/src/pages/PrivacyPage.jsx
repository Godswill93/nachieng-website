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

export default function PrivacyPage() {
    return (
        <section data-testid="page-privacy" className="bg-paper">
            <Seo
                title="Privacy Policy | Nachi Eng Ltd"
                description="How Nachi Eng Ltd handles personal data submitted through the website enquiry form. Draft for owner review."
                path="/privacy"
            />
            <div className="container-shell max-w-3xl py-24 md:py-32">
                <p className="eyebrow text-signal">Legal</p>
                <h1 className="h-display mt-6">Privacy Policy</h1>
                <p className="mt-6 text-sm leading-7 text-ink/70 md:text-base">
                    This policy explains how {COMPANY.name} handles personal data submitted through this website. It reflects
                    only the services this website currently uses.
                </p>

                <div className="mt-12">
                    <DraftBanner />

                    <Section heading="Who we are">
                        <p>
                            {COMPANY.name}, registered in England and Wales (Company No. {COMPANY.registration}), based in {COMPANY.location}.
                            For any question about your personal data, contact <a className="text-signal underline underline-offset-4" href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>.
                        </p>
                    </Section>

                    <Section heading="What this policy covers">
                        <p>
                            It covers personal data you choose to send us through the enquiry form on this website, and any details you
                            provide if you book a call using our external booking link. This website does not require you to create an
                            account and does not run analytics or advertising tracking.
                        </p>
                    </Section>

                    <Section heading="What we collect and why">
                        <p>
                            When you use the enquiry form we collect the details you enter: your name and email address, and optionally
                            your organisation, phone number and the message describing your requirement.
                        </p>
                        <p>
                            We use these details only to read and respond to your enquiry. We do not add you to any marketing list, and
                            you are not subscribed to anything. Our lawful basis is your consent (given when you submit the form) and our
                            legitimate interest in responding to enquiries about our services.
                        </p>
                    </Section>

                    <Section heading="How your enquiry is handled">
                        <p>
                            Enquiries are delivered to us by email using <a className="text-signal underline underline-offset-4" href="https://resend.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">Resend</a>, an email delivery service that transmits the
                            contents of your enquiry to our inbox. The enquiry is not stored in a website database.
                        </p>
                        <p>
                            If you choose to book a call, our booking link takes you to <a className="text-signal underline underline-offset-4" href="https://calendly.com/privacy" target="_blank" rel="noopener noreferrer">Calendly</a>, which processes the booking details you
                            enter on its own platform under its own privacy policy.
                        </p>
                    </Section>

                    <Section heading="How long we keep it">
                        <p>
                            We keep enquiry correspondence only for as long as needed to deal with your enquiry and any resulting
                            work or follow-up, after which it is deleted.
                        </p>
                    </Section>

                    <Section heading="Your rights">
                        <p>
                            Under UK data protection law you have the right to access, correct or ask us to delete the personal data we
                            hold about you, to object to or restrict our use of it, and to complain to the Information Commissioner&rsquo;s
                            Office (ICO). To exercise any of these, contact <a className="text-signal underline underline-offset-4" href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>.
                        </p>
                    </Section>

                    <Section heading="Cookies">
                        <p>
                            This website sets no analytics or advertising cookies. See our <a className="text-signal underline underline-offset-4" href="/cookies">Cookie Policy</a> for details.
                        </p>
                    </Section>

                    <Section heading="Changes to this policy">
                        <p>
                            We may update this policy from time to time. The current version will always be published on this page.
                        </p>
                    </Section>
                </div>
            </div>
        </section>
    );
}
