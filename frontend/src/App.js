import { useEffect, lazy, Suspense } from "react";
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
import DemonstrationLabPage from "@/pages/DemonstrationLabPage";
import InsightsPage from "@/pages/InsightsPage";
import ArticlePage from "@/pages/ArticlePage";
import ContactPage from "@/pages/ContactPage";
import PrivacyPage from "@/pages/PrivacyPage";
import CookiePage from "@/pages/CookiePage";
import NotFound from "@/pages/NotFound";

// Internal-only route: registered ONLY in local development, never in production.
// In production builds `IS_DEV` is the literal `false`, so the route below is not
// rendered and its lazy import call-site is dead-code-eliminated from the app bundle.
// /brand-preview therefore falls through to the 404 (NotFound) page in production.
const IS_DEV = process.env.NODE_ENV !== "production";
const BrandPreviewPage = lazy(() => import("@/pages/BrandPreviewPage"));

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
                        <Route path="/demonstrations" element={<DemonstrationLabPage />} />
                        <Route path="/tmms/demos/:sector" element={<TmmsDemoPage />} />
                        {IS_DEV && (
                            <Route
                                path="/brand-preview"
                                element={
                                    <Suspense fallback={null}>
                                        <BrandPreviewPage />
                                    </Suspense>
                                }
                            />
                        )}
                        <Route path="/about" element={<AboutPage />} />
                        <Route path="/insights" element={<InsightsPage />} />
                        <Route path="/insights/:slug" element={<ArticlePage />} />
                        <Route path="/contact" element={<ContactPage />} />
                        <Route path="/privacy" element={<PrivacyPage />} />
                        <Route path="/cookies" element={<CookiePage />} />
                        <Route path="*" element={<NotFound />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </LazyMotion>
    );
}

export default App;
