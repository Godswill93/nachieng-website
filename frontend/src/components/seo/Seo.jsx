import { useEffect } from "react";
import { COMPANY } from "../../content/site";
import { DEFAULT_OG_ALT, DEFAULT_OG_IMAGE, OG_IMAGE_HEIGHT, OG_IMAGE_WIDTH } from "../../content/routeMeta";

const upsertMeta = (attr, key, content) => {
    let el = document.head.querySelector(`meta[${attr}="${key}"]`);
    if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, key);
        document.head.appendChild(el);
    }
    el.setAttribute("content", content);
};

export const Seo = ({
    title,
    description,
    path = "/",
    jsonLd = null,
    noindex = false,
    image = DEFAULT_OG_IMAGE,
    imageAlt = DEFAULT_OG_ALT,
}) => {
    const jsonLdString = jsonLd ? JSON.stringify(jsonLd) : null;
    useEffect(() => {
        const imageUrl = image.startsWith("http") ? image : `${COMPANY.canonicalOrigin}${image}`;
        document.title = title;
        upsertMeta("name", "description", description);
        upsertMeta("name", "robots", noindex ? "noindex, nofollow" : "index, follow");
        upsertMeta("property", "og:title", title);
        upsertMeta("property", "og:description", description);
        upsertMeta("property", "og:url", `${COMPANY.canonicalOrigin}${path}`);
        upsertMeta("property", "og:image", imageUrl);
        upsertMeta("property", "og:image:width", OG_IMAGE_WIDTH);
        upsertMeta("property", "og:image:height", OG_IMAGE_HEIGHT);
        upsertMeta("property", "og:image:alt", imageAlt);
        upsertMeta("name", "twitter:card", "summary_large_image");
        upsertMeta("name", "twitter:title", title);
        upsertMeta("name", "twitter:description", description);
        upsertMeta("name", "twitter:image", imageUrl);
        let canonical = document.head.querySelector('link[rel="canonical"]');
        if (!canonical) {
            canonical = document.createElement("link");
            canonical.setAttribute("rel", "canonical");
            document.head.appendChild(canonical);
        }
        canonical.setAttribute("href", `${COMPANY.canonicalOrigin}${path}`);
        let script;        if (jsonLdString) {
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
    }, [title, description, path, jsonLdString, noindex, image, imageAlt]);
    return null;
};
