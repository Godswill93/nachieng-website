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
import InsightsPage from "@/pages/InsightsPage";
import ArticlePage from "@/pages/ArticlePage";
import ContactPage from "@/pages/ContactPage";
import { StubPage } from "@/pages/StubPage";
import NotFound from "@/pages/NotFound";

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
                        <Route path="/insights" element={<InsightsPage />} />
                        <Route path="/insights/:slug" element={<ArticlePage />} />
                        <Route path="/contact" element={<ContactPage />} />
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
