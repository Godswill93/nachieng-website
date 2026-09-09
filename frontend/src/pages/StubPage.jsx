import { Seo } from "../components/seo/Seo";

export const StubPage = ({ title, eyebrow, description, path, testId, children }) => (
    <section data-testid={testId} className="bg-paper">
        <Seo title={`${title} | Nachi Eng Ltd`} description={description} path={path} />
        <div className="container-shell py-24 md:py-36">
            <p className="eyebrow text-signal">{eyebrow}</p>
            <h1 className="h-display mt-6 max-w-3xl">{title}</h1>
            <p className="mt-6 max-w-xl text-sm leading-6 text-ink/70 md:text-base md:leading-7">{description}</p>
            {children}
        </div>
    </section>
);
