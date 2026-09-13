import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { COMPANY } from "../../content/site";

const CAPABILITY_LINKS = [
    { label: "Engineering services", to: "/services" },
    { label: "Planned maintenance", to: "/services" },
    { label: "Reactive support", to: "/services" },
    { label: "Fault-finding & diagnostics", to: "/services" },
    { label: "Maintenance improvement", to: "/services" },
];

const TECHNOLOGY_LINKS = [
    { label: "Nachi CMMS", to: "/tmms" },
    { label: "Private demonstrations", to: "/demonstrations" },
    { label: "CMMS advisory", to: "/services" },
    { label: "Insights", to: "/insights" },
];

const COMPANY_LINKS = [
    { label: "About", to: "/about" },
    { label: "Contact", to: "/contact" },
];

const FooterLink = ({ to, children, testId }) => (
    <Link
        to={to}
        data-testid={testId}
        className="inline-flex min-h-[36px] items-center text-sm leading-5 text-white/[0.58] transition-colors hover:text-white focus-visible:text-white"
    >
        {children}
    </Link>
);

export const SiteFooter = () => {
    return (
        <footer data-testid="site-footer" className="relative overflow-hidden bg-[#0b0e14] text-paper">
            <div className="pointer-events-none absolute right-[-10rem] top-[-12rem] h-[32rem] w-[32rem] rounded-full bg-signal/10 blur-[130px]" aria-hidden="true" />
            <div className="container-shell relative py-16 md:py-20">
                <div className="grid gap-12 border-b border-white/10 pb-14 lg:grid-cols-12 lg:gap-8">
                    <div className="lg:col-span-5">
                        <img src="/brand/nachi-eng-wordmark-paper.svg" alt="Nachi Eng Ltd" className="h-[24px] w-auto" />
                        <p className="mt-6 max-w-md text-sm leading-6 text-white/[0.55] md:text-base md:leading-7">
                            Industrial engineering, maintenance improvement and engineering technology for factories,
                            warehouses and commercial facilities across London, Essex and the South East.
                        </p>
                        <a
                            data-testid="footer-email-link"
                            href={`mailto:${COMPANY.email}`}
                            className="group mt-7 inline-flex min-h-[44px] items-center gap-2 text-sm font-semibold text-white"
                        >
                            {COMPANY.email}
                            <ArrowUpRight className="h-4 w-4 text-signalhi transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                        </a>
                    </div>

                    <nav aria-label="Footer" className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4 lg:col-span-7">
                        <div>
                            <h2 className="eyebrow text-white/[0.35]">Engineering</h2>
                            <ul className="mt-5 space-y-1">
                                {CAPABILITY_LINKS.map((item, index) => (
                                    <li key={`${item.label}-${index}`}><FooterLink to={item.to}>{item.label}</FooterLink></li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h2 className="eyebrow text-white/[0.35]">Technology</h2>
                            <ul className="mt-5 space-y-1">
                                {TECHNOLOGY_LINKS.map((item) => (
                                    <li key={item.label}><FooterLink to={item.to}>{item.label}</FooterLink></li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h2 className="eyebrow text-white/[0.35]">Company</h2>
                            <ul className="mt-5 space-y-1">
                                {COMPANY_LINKS.map((item) => (
                                    <li key={item.label}><FooterLink to={item.to}>{item.label}</FooterLink></li>
                                ))}
                                <li>
                                    <a data-testid="footer-calendly-link" href={COMPANY.calendly} target="_blank" rel="noopener noreferrer" className="group inline-flex min-h-[36px] items-center gap-1.5 text-sm leading-5 text-white/[0.58] transition-colors hover:text-white focus-visible:text-white">
                                        Book a 30-minute call<ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                                    </a>
                                </li>
                                <li>
                                    <a data-testid="footer-linkedin-link" href={COMPANY.linkedin} target="_blank" rel="noopener noreferrer" className="group inline-flex min-h-[36px] items-center gap-1.5 text-sm leading-5 text-white/[0.58] transition-colors hover:text-white focus-visible:text-white">
                                        LinkedIn<ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h2 className="eyebrow text-white/[0.35]">Legal</h2>
                            <ul className="mt-5 space-y-1">
                                <li><FooterLink to="/privacy" testId="footer-privacy-link">Privacy policy</FooterLink></li>
                                <li><FooterLink to="/cookies" testId="footer-cookies-link">Cookie policy</FooterLink></li>
                            </ul>
                        </div>
                    </nav>
                </div>

                <div className="grid gap-6 border-b border-white/10 py-8 md:grid-cols-2 md:items-center">
                    <p className="text-sm leading-6 text-white/[0.48]">
                        Registered in England and Wales · Company No. {COMPANY.registration}<br />
                        {COMPANY.location}
                    </p>
                    <p className="text-sm leading-6 text-white/[0.48] md:text-right">We aim to respond to enquiries {COMPANY.responseCommitment}.</p>
                </div>

                <div className="flex flex-col gap-4 pt-7 text-xs text-white/[0.38] sm:flex-row sm:items-center sm:justify-between">
                    <p data-testid="footer-copyright">© 2025 Nachi Eng Ltd. All rights reserved.</p>
                    <div className="flex flex-wrap gap-x-5 gap-y-2">
                        <Link to="/privacy" className="min-h-[32px] transition-colors hover:text-white">Privacy</Link>
                        <Link to="/cookies" className="min-h-[32px] transition-colors hover:text-white">Cookies</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};
