import meta from "./routeMeta.json";

export const CANONICAL_ORIGIN = meta.origin;
export const DEFAULT_OG_IMAGE = meta.defaultImage;
export const DEFAULT_OG_ALT = meta.defaultImageAlt;
export const OG_IMAGE_WIDTH = String(meta.imageWidth);
export const OG_IMAGE_HEIGHT = String(meta.imageHeight);

export function routeSeo(path) {
    const route = meta.routes.find((item) => item.path === path);
    if (!route) {
        throw new Error(`No SEO metadata for ${path}`);
    }
    return {
        title: route.title,
        description: route.description,
        path: route.path,
        noindex: Boolean(route.noindex),
        image: route.image || meta.defaultImage,
        imageAlt: route.imageAlt || meta.defaultImageAlt,
    };
}
