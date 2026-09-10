import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { NAV_LINKS, COMPANY } from "../../content/site";

const Wordmark = ({ light = false }) => (
    <Link
        to="/"
        data-testid="site-wordmark-link"
        aria-label="Nachi Eng Ltd — home"
        className="inline-flex items-center"
    >
        <img
            src={light ? "/brand/nachi-eng-wordmark-paper.svg" : "/brand/nachi-eng-wordmark-ink.svg"}
            alt="Nachi Eng Ltd"
            className="h-5 w-auto md:h-[22px]"
        />
    </Link>
);

const MobileMenu = ({ onClose, closeRef }) => (
    <div
        id="site-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        data-testid="mobile-menu"
        ref={closeRef.dialogRef}
        className="fixed inset-0 z-[70] flex flex-col overflow-y-auto bg-ink text-paper lg:hidden"
    >
        <div className="container-shell flex h-16 items-center justify-between md:h-20">
            <Wordmark light />
            <button
                type="button"
                onClick={onClose}
                ref={closeRef.firstRef}
                data-testid="mobile-menu-close"
                aria-label="Close menu"
                className="flex min-h-11 min-w-11 items-center justify-center text-paper"
            >
                <X className="h-6 w-6" aria-hidden="true" />
            </button>
        </div>
        <nav aria-label="Mobile" className="container-shell mt-8 flex flex-col">
            {[...NAV_LINKS, { label: "Contact", to: "/contact", testId: "nav-contact" }].map((l, i) => (
                <Link
                    key={l.to}
                    to={l.to}
                    data-testid={l.testId ? l.testId.replace("nav-", "mobile-nav-") : `mobile-nav-${i}`}
                    className="group flex min-h-[56px] items-baseline gap-4 border-t border-white/10 py-5"
                >
                    <span className="font-mono text-xs text-signalhi">0{i + 1}</span>
                    <span className="font-expanded text-3xl font-semibold tracking-tight transition-colors duration-200 group-hover:text-signalhi">
                        {l.label}
                    </span>
                </Link>
            ))}
        </nav>
        <div className="container-shell mb-10 mt-auto border-t border-white/10 pt-6">
            <p className="font-mono text-xs leading-6 tracking-[0.12em] text-white/60">
                {COMPANY.email}
                <br />
                {COMPANY.phoneDisplay}
            </p>
        </div>
    </div>
);

export const SiteHeader = () => {
    const [open, setOpen] = useState(false);
    const { pathname } = useLocation();
    const toggleRef = useRef(null);
    const dialogRef = useRef(null);
    const firstRef = useRef(null);

    useEffect(() => {
        setOpen(false);
    }, [pathname]);

    useEffect(() => {
        if (!open) return undefined;
        const el = dialogRef.current;
        const getFocusables = () => el.querySelectorAll('a[href], button:not([disabled])');
        firstRef.current?.focus();
        const onKey = (e) => {
            if (e.key === "Escape") {
                setOpen(false);
                return;
            }
            if (e.key !== "Tab") return;
            const items = Array.from(getFocusables());
            const first = items[0];
            const last = items[items.length - 1];
            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        };
        document.addEventListener("keydown", onKey);
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", onKey);
            document.body.style.overflow = "";
            toggleRef.current?.focus();
        };
    }, [open]);

    return (
        <>
            <header
                data-testid="site-header"
                className="sticky top-0 z-50 border-b border-ink/10 bg-paper/85 backdrop-blur-md"
            >
            <div className="container-shell flex h-16 items-center justify-between md:h-20">
                <Wordmark />
                <nav aria-label="Primary" className="hidden items-center gap-8 lg:flex">
                    {NAV_LINKS.map((l) => (
                        <NavLink
                            key={l.to}
                            to={l.to}
                            data-testid={l.testId}
                            className={({ isActive }) =>
                                `text-sm transition-colors duration-200 ${
                                    isActive ? "text-ink" : "text-ink/70 hover:text-ink"
                                }`
                            }
                        >
                            {l.label}
                        </NavLink>
                    ))}
                    <Link
                        to="/contact"
                        data-testid="nav-contact-cta"
                        className="inline-flex min-h-[44px] items-center rounded-full bg-ink px-5 text-sm font-medium text-paper transition-colors duration-300 hover:bg-signal hover:text-white"
                    >
                        Contact
                    </Link>
                </nav>
                <button
                    type="button"
                    ref={toggleRef}
                    onClick={() => setOpen(true)}
                    aria-expanded={open}
                    aria-controls="site-menu"
                    aria-label="Open menu"
                    data-testid="mobile-menu-button"
                    className="flex min-h-11 min-w-11 items-center justify-center lg:hidden"
                >
                    <Menu className="h-6 w-6" aria-hidden="true" />
                </button>
            </div>
            </header>
            {open && <MobileMenu onClose={() => setOpen(false)} closeRef={{ dialogRef, firstRef }} />}
        </>
    );
};
