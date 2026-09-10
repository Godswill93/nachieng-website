import { useEffect } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { LazyMotion, domAnimation } from "framer-motion";
import Lenis from "lenis";
import { Layout } from "@/components/layout/Layout";
import HomePage from "@/pages/HomePage";
import ServicesPage from "@/pages/ServicesPage";
import { StubPage } from "@/pages/StubPage";
import NotFound from "@/pages/NotFound";
import { COMPANY, ARTICLES } from "@/content/site";

const SmoothScroll = () => {
    useEffect(() => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
        const lenis = new Lenis({ duration: 1.05 });
        let rafId;
        const raf = (time) => {
            lenis.raf(time);
            rafId = requestAnimationFrame(raf);
        };
        rafId = requestAnimationFrame(raf);
        return () => {
            cancelAnimationFrame(rafId);
            lenis.destroy();
        };
    }, []);
    return null;
};

const ScrollToTop = () => {
    const { pathname } = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    return null;
};

const ContactStub = () => (
    <StubPage
        title="Contact"
        eyebrow="Phase 8 — enquiry form in the build queue"
        path="/contact"
        testId="page-contact"
        description="The asynchronous enquiry form is built and tested end to end in Phase 8. Until then, every direct route below is live."
    >
        <ul className="mt-10 max-w-xl divide-y divide-ink/10 border-y border-ink/10">
            <li className="flex flex-wrap items-baseline justify-between gap-2 py-4">
                <span className="eyebrow text-ink/50">Email</span>
                <a data-testid="contact-email-link" className="text-sm underline-offset-4 hover:underline" href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>
            </li>
            <li className="flex flex-wrap items-baseline justify-between gap-2 py-4">
                <span className="eyebrow text-ink/50">Phone</span>
                <a data-testid="contact-phone-link" className="text-sm underline-offset-4 hover:underline" href={COMPANY.phoneHref}>{COMPANY.phoneDisplay}</a>
            </li>
            <li className="flex flex-wrap items-baseline justify-between gap-2 py-4">
                <span className="eyebrow text-ink/50">Book a call</span>
                <a data-testid="contact-calendly-link" className="text-sm underline-offset-4 hover:underline" href={COMPANY.calendly} target="_blank" rel="noopener noreferrer">30 minutes, via Calendly</a>
            </li>
        </ul>
        <p className="mt-6 font-mono text-xs tracking-[0.12em] text-ink/50">
            Response {COMPANY.responseCommitment} · {COMPANY.location}
        </p>
    </StubPage>
);

const InsightsStub = () => (
    <StubPage
        title="Insights"
        eyebrow="Phase 9 — articles being carried across"
        path="/insights"
        testId="page-insights"
        description="Two long-form articles return here in Phase 9, with byline, date, reading time and every statistic individually sourced."
    >
        <ul className="mt-10 max-w-xl divide-y divide-ink/10 border-y border-ink/10">
            {ARTICLES.map((a) => (
                <li key={a.title} className="flex items-baseline justify-between gap-4 py-4">
                    <span className="text-sm">{a.title}</span>
                    <span className="eyebrow text-ink/50">Article</span>
                </li>
            ))}
        </ul>
    </StubPage>
);

function App() {
    return (
        <LazyMotion features={domAnimation}>
            <BrowserRouter>
                <SmoothScroll />
                <ScrollToTop />
                <Routes>
                    <Route element={<Layout />}>
                        <Route index element={<HomePage />} />
                        <Route path="/services" element={<ServicesPage />} />
                        <Route
                            path="/tmms"
                            element={
                                <StubPage
                                    title="TMMS"
                                    eyebrow="Phase 6 — in the build queue"
                                    path="/tmms"
                                    testId="page-tmms"
                                    description="TMMS is a Maintenance Management System currently in development — a real product, demonstrated privately by enquiry. Its page and four simulated sector demos arrive in Phase 6."
                                />
                            }
                        />
                        <Route
                            path="/about"
                            element={
                                <StubPage
                                    title="About"
                                    eyebrow="Phase 7 — in the build queue"
                                    path="/about"
                                    testId="page-about"
                                    description="The founder story, credentials and company approach arrive in Phase 7."
                                />
                            }
                        />
                        <Route path="/insights" element={<InsightsStub />} />
                        <Route path="/contact" element={<ContactStub />} />
                        <Route
                            path="/privacy"
                            element={
                                <StubPage
                                    title="Privacy Policy"
                                    eyebrow="Phase 10 — draft for owner review"
                                    path="/privacy"
                                    testId="page-privacy"
                                    description="A structured draft privacy policy, based only on the actual processors and data flows selected during this build, is published for owner review in Phase 10."
                                />
                            }
                        />
                        <Route
                            path="/cookies"
                            element={
                                <StubPage
                                    title="Cookie Policy"
                                    eyebrow="Phase 10 — draft for owner review"
                                    path="/cookies"
                                    testId="page-cookies"
                                    description="A structured draft cookie policy with a named-cookie table is published for owner review in Phase 10."
                                />
                            }
                        />
                        <Route path="*" element={<NotFound />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </LazyMotion>
    );
}

export default App;
