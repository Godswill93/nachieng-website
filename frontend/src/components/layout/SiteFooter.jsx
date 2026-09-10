import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { COMPANY, NAV_LINKS } from "../../content/site";

export const SiteFooter = () => {
    const year = new Date().getFullYear();
    return (
        <footer data-testid="site-footer" className="bg-ink text-paper">
            <div className="container-shell grid gap-12 py-16 md:grid-cols-12 md:py-20">
                <div className="md:col-span-5">
                    <img src="/brand/nachi-eng-wordmark-paper.svg" alt="Nachi Eng Ltd" className="h-[22px] w-auto" />
                    <p className="mt-4 max-w-sm text-sm leading-6 text-white/60">
                        Industrial engineering and engineering technology, based in {COMPANY.location}.
                    </p>
                    <p className="mt-6 font-mono text-xs leading-6 tracking-[0.12em] text-white/60">
                        Registered in England and Wales
                        <br />
                        Company No. {COMPANY.registration}
                    </p>
                </div>
                <div className="md:col-span-3">
                    <h2 className="eyebrow text-white/60">Contact</h2>
                    <ul className="mt-5 space-y-3 text-sm">
                        <li>
                            <a data-testid="footer-email-link" href={`mailto:${COMPANY.email}`} className="text-white/80 underline-offset-4 transition-colors hover:text-white hover:underline">
                                {COMPANY.email}
                            </a>
                        </li>
                        <li>
                            <a data-testid="footer-phone-link" href={COMPANY.phoneHref} className="text-white/80 underline-offset-4 transition-colors hover:text-white hover:underline">
                                {COMPANY.phoneDisplay}
                            </a>
                        </li>
                        <li>
                            <a data-testid="footer-linkedin-link" href={COMPANY.linkedin} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-1.5 text-white/80 underline-offset-4 transition-colors hover:text-white hover:underline">
                                LinkedIn
                                <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                            </a>
                        </li>
                        <li>
                            <a data-testid="footer-calendly-link" href={COMPANY.calendly} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-1.5 text-white/80 underline-offset-4 transition-colors hover:text-white hover:underline">
                                Book a 30-minute call
                                <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                            </a>
                        </li>
                    </ul>
                </div>
                <div className="md:col-span-2">
                    <h2 className="eyebrow text-white/60">Site</h2>
                    <ul className="mt-5 space-y-3 text-sm">
                        {NAV_LINKS.map((l) => (
                            <li key={l.to}>
                                <Link data-testid={`footer-${l.testId}`} to={l.to} className="text-white/80 underline-offset-4 transition-colors hover:text-white hover:underline">
                                    {l.label}
                                </Link>
                            </li>
                        ))}
                        <li>
                            <Link data-testid="footer-nav-contact" to="/contact" className="text-white/80 underline-offset-4 transition-colors hover:text-white hover:underline">
                                Contact
                            </Link>
                        </li>
                    </ul>
                </div>
                <div className="md:col-span-2">
                    <h2 className="eyebrow text-white/60">Legal</h2>
                    <ul className="mt-5 space-y-3 text-sm">
                        <li>
                            <Link data-testid="footer-privacy-link" to="/privacy" className="text-white/80 underline-offset-4 transition-colors hover:text-white hover:underline">
                                Privacy Policy
                            </Link>
                        </li>
                        <li>
                            <Link data-testid="footer-cookies-link" to="/cookies" className="text-white/80 underline-offset-4 transition-colors hover:text-white hover:underline">
                                Cookie Policy
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="border-t border-white/10">
                <div className="container-shell flex flex-wrap items-center justify-between gap-2 py-6">
                    <p data-testid="footer-copyright" className="font-mono text-xs tracking-[0.12em] text-white/60">
                        © 2025–{year} Nachi Eng Ltd
                    </p>
                    <p className="font-mono text-xs tracking-[0.12em] text-white/60">
                        Response {COMPANY.responseCommitment}
                    </p>
                </div>
            </div>
        </footer>
    );
};
