import { Outlet } from "react-router-dom";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";

export const Layout = () => (
    <div className="flex min-h-screen flex-col bg-paper text-ink">
        <a
            href="#main-content"
            data-testid="skip-to-content"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-signal focus:px-4 focus:py-3 focus:text-sm focus:text-white"
        >
            Skip to content
        </a>
        <SiteHeader />
        <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
            <Outlet />
        </main>
        <SiteFooter />
    </div>
);
