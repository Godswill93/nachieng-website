import { useEffect } from "react";
import { COMPANY } from "../../content/site";

const upsertMeta = (attr, key, content) => {
    let el = document.head.querySelector(`meta[${attr}="${key}"]`);
    if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, key);
        document.head.appendChild(el);
    }
    el.setAttribute("content", content);
};

export const Seo = ({ title, description, path = "/", jsonLd = null, noindex = false }) => {
    const jsonLdString = jsonLd ? JSON.stringify(jsonLd) : null;
    useEffect(() => {
        document.title = title;
        upsertMeta("name", "description", description);
        upsertMeta("name", "robots", noindex ? "noindex, nofollow" : "index, follow");
        upsertMeta("property", "og:title", title);
        upsertMeta("property", "og:description", description);
        upsertMeta("property", "og:url", `${COMPANY.canonicalOrigin}${path}`);
        upsertMeta("name", "twitter:title", title);
        upsertMeta("name", "twitter:description", description);
        let canonical = document.head.querySelector('link[rel="canonical"]');
        if (!canonical) {
            canonical = document.createElement("link");
            canonical.setAttribute("rel", "canonical");
            document.head.appendChild(canonical);
        }
        canonical.setAttribute("href", `${COMPANY.canonicalOrigin}${path}`);
        let script;
        if (jsonLdString) {
            document.getElementById("page-jsonld")?.remove();
            script = document.createElement("script");
            script.type = "application/ld+json";
            script.id = "page-jsonld";
            script.text = jsonLdString;
            document.head.appendChild(script);
        }
        return () => {
            script?.remove();
        };
    }, [title, description, path, jsonLdString, noindex]);
    return null;
};
