import { useEffect } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { LazyMotion, domAnimation } from "framer-motion";
import Lenis from "lenis";
import { Layout } from "@/components/layout/Layout";
import HomePage from "@/pages/HomePage";
import ServicesPage from "@/pages/ServicesPage";
import AboutPage from "@/pages/AboutPage";
import TmmsPage from "@/pages/TmmsPage";
import TmmsDemoPage from "@/pages/TmmsDemoPage";
import BrandPreviewPage from "@/pages/BrandPreviewPage";
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
        eyebrow="Contact"
        path="/contact"
        testId="page-contact"
        description="Every route below reaches the engineer directly. Describe the site, the equipment and the problem, and you will receive a considered response."
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
        eyebrow="Insights"
        path="/insights"
        testId="page-insights"
        description="Articles on maintenance practice and maintenance technology, written from the maintenance floor."
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
                        <Route path="/tmms" element={<TmmsPage />} />
                        <Route path="/tmms/demos/:sector" element={<TmmsDemoPage />} />
                        <Route path="/brand-preview" element={<BrandPreviewPage />} />
                        <Route path="/about" element={<AboutPage />} />
                        <Route path="/insights" element={<InsightsStub />} />
                        <Route path="/contact" element={<ContactStub />} />
                        <Route
                            path="/privacy"
                            element={
                                <StubPage
                                    title="Privacy Policy"
                                    eyebrow="Legal"
                                    path="/privacy"
                                    testId="page-privacy"
                                    description="The privacy policy for this website is being prepared and will be published here. For any question about personal data, contact info@nachieng.co.uk."
                                />
                            }
                        />
                        <Route
                            path="/cookies"
                            element={
                                <StubPage
                                    title="Cookie Policy"
                                    eyebrow="Legal"
                                    path="/cookies"
                                    testId="page-cookies"
                                    description="The cookie policy for this website is being prepared and will be published here. This website currently sets no analytics or advertising cookies."
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
