/**
 * After the CRA build, write one HTML file per public route so the first response
 * (before JavaScript) carries that page's title, description, canonical and social tags.
 * The files are the built shell with the head swapped — the same JS bundle still
 * mounts the SPA, so client routing, /api/enquiry and the demo iframes are unchanged.
 */

const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const buildDir = path.join(root, "build");
const meta = require("../src/content/routeMeta.json");

function escapeAttr(value) {
    return String(value).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}

function escapeText(value) {
    return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;");
}

function replaceTitle(html, value) {
    let found = false;
    const next = html.replace(/(<title\b[^>]*>)[\s\S]*?(<\/title>)/i, (_, open, close) => {
        found = true;
        return `${open}${escapeText(value)}${close}`;
    });
    if (!found) throw new Error("Could not replace <title>");
    return next;
}

function replaceAttr(html, seoKey, attr, value) {
    const key = seoKey.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const re = new RegExp(`<([a-zA-Z0-9:-]+)((?:[^>]*?)data-seo=["']${key}["'](?:[^>]*))>`, "g");
    let found = false;
    const next = html.replace(re, (full) => {
        found = true;
        const attrRe = new RegExp(`(\\s${attr}\\s*=\\s*["'])[^"']*(["'])`);
        if (!attrRe.test(full)) throw new Error(`Tag for ${seoKey} has no ${attr}`);
        return full.replace(attrRe, `$1${escapeAttr(value)}$2`);
    });
    if (!found) throw new Error(`Missing data-seo="${seoKey}"`);
    return next;
}

function canonicalUrl(routePath) {
    return routePath === "/" ? `${meta.origin}/` : `${meta.origin}${routePath}`;
}

function absoluteImage(imagePath) {
    return imagePath.startsWith("http") ? imagePath : `${meta.origin}${imagePath}`;
}

function applyRoute(html, route) {
    const image = absoluteImage(route.image || meta.defaultImage);
    const imageAlt = route.imageAlt || meta.defaultImageAlt;
    const url = canonicalUrl(route.path);
    let next = replaceTitle(html, route.title);
    next = replaceAttr(next, "description", "content", route.description);
    next = replaceAttr(next, "robots", "content", route.noindex ? "noindex, nofollow" : "index, follow");
    next = replaceAttr(next, "canonical", "href", url);
    next = replaceAttr(next, "og:title", "content", route.title);
    next = replaceAttr(next, "og:description", "content", route.description);
    next = replaceAttr(next, "og:url", "content", url);
    next = replaceAttr(next, "og:image", "content", image);
    next = replaceAttr(next, "og:image:alt", "content", imageAlt);
    next = replaceAttr(next, "twitter:title", "content", route.title);
    next = replaceAttr(next, "twitter:description", "content", route.description);
    next = replaceAttr(next, "twitter:image", "content", image);
    if (next.includes("emergent-main.js")) {
        throw new Error(`Emergent script still present in ${route.path}`);
    }
    return next;
}

function renderSitemap(routes) {
    const urls = routes
        .filter((route) => route.sitemap)
        .map((route) => {
            if (!route.lastmod || !route.changefreq || !route.priority) {
                throw new Error(`Sitemap fields missing for ${route.path}`);
            }
            return [
                "  <url>",
                `    <loc>${canonicalUrl(route.path)}</loc>`,
                `    <lastmod>${route.lastmod}</lastmod>`,
                `    <changefreq>${route.changefreq}</changefreq>`,
                `    <priority>${route.priority}</priority>`,
                "  </url>",
            ].join("\n");
        })
        .join("\n");
    return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

function main() {
    const templatePath = path.join(buildDir, "index.html");
    const template = fs.readFileSync(templatePath, "utf8");
    if (template.includes("emergent-main.js")) {
        throw new Error("Refusing to publish build/index.html: emergent-main.js is still included.");
    }
    if (!template.includes("/static/js/")) {
        throw new Error("build/index.html has no CRA bundle. Run this after craco build.");
    }

    for (const route of meta.routes) {
        const html = applyRoute(template, route);
        const dest = route.path === "/" ? templatePath : path.join(buildDir, route.path.slice(1), "index.html");
        fs.mkdirSync(path.dirname(dest), { recursive: true });
        fs.writeFileSync(dest, html);
        const written = fs.readFileSync(dest, "utf8");
        const expectedTitle = escapeText(route.title);
        if (!written.includes(`<title`) || !written.includes(expectedTitle)) {
            throw new Error(`Title missing after write: ${route.path}`);
        }
        if (!written.includes(canonicalUrl(route.path))) {
            throw new Error(`Canonical missing after write: ${route.path}`);
        }
        if (!written.includes("og:image")) {
            throw new Error(`og:image missing after write: ${route.path}`);
        }
        console.log(`prerender ${route.path} -> ${path.relative(buildDir, dest)}`);
    }

    const sitemap = renderSitemap(meta.routes);
    fs.writeFileSync(path.join(buildDir, "sitemap.xml"), sitemap);
    fs.writeFileSync(path.join(root, "public", "sitemap.xml"), sitemap);
    console.log(`sitemap ${meta.routes.filter((route) => route.sitemap).length} urls`);
}

main();
