import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Seo } from "../components/seo/Seo";
import { COMPANY } from "../content/site";

export default function NotFound() {
    return (
        <section data-testid="page-not-found" className="bg-paper">
            <Seo
                title="Page not found | Nachi Eng Ltd"
                description="The page you requested does not exist."
                path="/404"
            />
            <div className="container-shell py-28 md:py-40">
                <p className="eyebrow text-signal">404</p>
                <h1 className="h-display mt-6 max-w-2xl">This page does not exist.</h1>
                <p className="mt-6 max-w-md text-sm leading-6 text-ink/70 md:text-base md:leading-7">
                    It may have moved during the rebuild. For anything engineering-related,{" "}
                    <a href={`mailto:${COMPANY.email}`} className="underline underline-offset-4">
                        {COMPANY.email}
                    </a>{" "}
                    reaches us directly.
                </p>
                <Link
                    to="/"
                    data-testid="not-found-home-link"
                    className="group mt-10 inline-flex min-h-[48px] items-center gap-2 rounded-full bg-ink px-7 py-3 text-sm font-medium text-paper transition-colors duration-300 hover:bg-signal hover:text-white"
                >
                    Back to the homepage
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true" />
                </Link>
            </div>
        </section>
    );
}
