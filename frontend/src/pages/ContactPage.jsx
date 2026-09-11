import { useRef, useState } from "react";
import { ArrowUpRight, Check } from "lucide-react";
import { Seo } from "../components/seo/Seo";
import { COMPANY } from "../content/site";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const initialValues = { name: "", email: "", organisation: "", phone: "", message: "", consent: false, company_website: "" };

const Field = ({ id, label, optional, error, children, hint }) => (
    <div>
        <label htmlFor={id} className="eyebrow flex items-baseline gap-2 text-ink/70">
            {label}
            {optional && <span className="font-mono text-[10px] normal-case tracking-normal text-ink/60">optional</span>}
        </label>
        {hint && <p className="mt-1 text-xs text-ink/60">{hint}</p>}
        <div className="mt-2">{children}</div>
        {error && (
            <p id={`${id}-error`} role="alert" data-testid={`enquiry-error-${id}`} className="mt-2 text-xs text-signal">
                {error}
            </p>
        )}
    </div>
);

const inputClass =
    "w-full border border-ink/20 bg-transparent px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-ink/60 focus:border-signal focus-visible:ring-2 focus-visible:ring-signal/50";

export default function ContactPage() {
    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState({});
    const [status, setStatus] = useState("idle"); // idle | submitting | success | error
    const [serverError, setServerError] = useState("");
    const startedAt = useRef(Date.now());

    const set = (key) => (e) => {
        const val = key === "consent" ? e.target.checked : e.target.value;
        setValues((v) => ({ ...v, [key]: val }));
    };

    const validate = () => {
        const next = {};
        if (!values.name.trim()) next.name = "Please enter your name.";
        if (!values.email.trim()) next.email = "Please enter your email address.";
        else if (!EMAIL_RE.test(values.email.trim())) next.email = "Please enter a valid email address.";
        if (!values.message.trim()) next.message = "Please describe your requirement.";
        else if (values.message.trim().length < 20) next.message = "Please give a little more detail (at least 20 characters).";
        if (!values.consent) next.consent = "Please confirm you are happy for us to use your details to reply.";
        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setServerError("");
        if (!validate()) return;
        setStatus("submitting");
        try {
            const res = await fetch(`/api/enquiry`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: values.name.trim(),
                    email: values.email.trim(),
                    organisation: values.organisation.trim(),
                    phone: values.phone.trim(),
                    message: values.message.trim(),
                    company_website: values.company_website,
                    elapsed_ms: Date.now() - startedAt.current,
                }),
            });
            if (!res.ok) throw new Error("bad_status");
            const data = await res.json();
            if (data.status !== "ok") throw new Error("bad_body");
            setStatus("success");
        } catch (err) {
            setStatus("error");
            setServerError("We couldn't send your enquiry just now. Please try again in a moment, or email us directly at " + COMPANY.email + " and we will pick it up.");
        }
    };

    return (
        <section data-testid="page-contact" className="bg-paper">
            <Seo
                title="Contact | Nachi Eng Ltd"
                description="Contact Nachi Eng Ltd about an industrial engineering or maintenance requirement. Describe the site, the equipment and the problem for a considered response."
                path="/contact"
            />
            <div className="container-shell grid gap-16 py-24 md:grid-cols-12 md:gap-8 md:py-32">
                <div className="md:col-span-5">
                    <p className="eyebrow text-signal">Contact</p>
                    <h1 className="h-display mt-6 max-w-md">Discuss an engineering requirement.</h1>
                    <p className="mt-6 max-w-md text-sm leading-6 text-ink/70 md:text-base md:leading-7">
                        Describe the site, the equipment and the problem, and you will receive a considered response. You deal directly with the engineer responsible for the work.
                    </p>

                    <ul className="mt-10 divide-y divide-ink/10 border-y border-ink/10">
                        <li className="flex flex-wrap items-baseline justify-between gap-2 py-4">
                            <span className="eyebrow text-ink/70">Email</span>
                            <a data-testid="contact-email-link" className="text-sm underline-offset-4 hover:underline" href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>
                        </li>
                        <li className="flex flex-wrap items-baseline justify-between gap-2 py-4">
                            <span className="eyebrow text-ink/70">Book a call</span>
                            <a data-testid="contact-calendly-link" className="group inline-flex items-center gap-1.5 text-sm underline-offset-4 hover:underline" href={COMPANY.calendly} target="_blank" rel="noopener noreferrer">
                                30 minutes, via Calendly
                                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                            </a>
                        </li>
                    </ul>
                    <p className="mt-6 font-mono text-xs leading-6 tracking-[0.12em] text-ink/70">
                        Response {COMPANY.responseCommitment} · {COMPANY.location}
                    </p>
                </div>

                <div className="md:col-span-6 md:col-start-7">
                    {status === "success" ? (
                        <div data-testid="enquiry-success" role="status" className="border border-ink/15 bg-ink/[0.03] p-8 md:p-10">
                            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-signal text-white">
                                <Check className="h-5 w-5" aria-hidden="true" />
                            </span>
                            <h2 className="font-expanded mt-6 text-2xl font-semibold tracking-tight">Thank you — your enquiry has been received.</h2>
                            <p className="mt-4 text-sm leading-6 text-ink/70 md:text-base md:leading-7">
                                We will read it carefully and respond {COMPANY.responseCommitment}. There is no automated reply — a real response will follow from the engineer.
                            </p>
                            <p className="mt-6 font-mono text-xs tracking-[0.12em] text-ink/70">
                                Need to add something? Email {COMPANY.email}.
                            </p>
                        </div>
                    ) : (
                        <form data-testid="enquiry-form" onSubmit={onSubmit} noValidate className="space-y-8">
                            {/* Honeypot — visually hidden, must stay empty */}
                            <div aria-hidden="true" className="absolute h-px w-px overflow-hidden opacity-0" style={{ left: "-9999px" }}>
                                <label htmlFor="company_website">Company website</label>
                                <input id="company_website" name="company_website" type="text" tabIndex={-1} autoComplete="off" value={values.company_website} onChange={set("company_website")} />
                            </div>

                            <Field id="name" label="Name" error={errors.name}>
                                <input id="name" type="text" autoComplete="name" className={inputClass} value={values.name} onChange={set("name")}
                                    aria-invalid={!!errors.name} aria-describedby={errors.name ? "name-error" : undefined} data-testid="enquiry-input-name" />
                            </Field>

                            <Field id="email" label="Email" error={errors.email}>
                                <input id="email" type="email" autoComplete="email" className={inputClass} value={values.email} onChange={set("email")}
                                    aria-invalid={!!errors.email} aria-describedby={errors.email ? "email-error" : undefined} data-testid="enquiry-input-email" />
                            </Field>

                            <div className="grid gap-8 sm:grid-cols-2">
                                <Field id="organisation" label="Organisation" optional>
                                    <input id="organisation" type="text" autoComplete="organization" className={inputClass} value={values.organisation} onChange={set("organisation")} data-testid="enquiry-input-organisation" />
                                </Field>
                                <Field id="phone" label="Phone" optional>
                                    <input id="phone" type="tel" autoComplete="tel" className={inputClass} value={values.phone} onChange={set("phone")} data-testid="enquiry-input-phone" />
                                </Field>
                            </div>

                            <Field id="message" label="Your requirement" error={errors.message} hint="The site, the equipment and the problem — as much detail as helps.">
                                <textarea id="message" rows={6} className={`${inputClass} resize-y`} value={values.message} onChange={set("message")}
                                    aria-invalid={!!errors.message} aria-describedby={errors.message ? "message-error" : undefined} data-testid="enquiry-input-message" />
                            </Field>

                            <div>
                                <label htmlFor="consent" className="flex cursor-pointer items-start gap-3 text-sm leading-6 text-ink/70">
                                    <input id="consent" type="checkbox" className="mt-1 h-4 w-4 shrink-0 accent-signal" checked={values.consent} onChange={set("consent")}
                                        aria-invalid={!!errors.consent} aria-describedby={errors.consent ? "consent-error" : "privacy-note"} data-testid="enquiry-input-consent" />
                                    <span>I am happy for Nachi Eng Ltd to use these details to respond to my enquiry.</span>
                                </label>
                                {errors.consent && (
                                    <p id="consent-error" role="alert" data-testid="enquiry-error-consent" className="mt-2 text-xs text-signal">{errors.consent}</p>
                                )}
                            </div>

                            <p id="privacy-note" data-testid="enquiry-privacy-note" className="border-l-2 border-ink/15 pl-4 text-xs leading-5 text-ink/70">
                                Privacy: your details are used only to respond to this enquiry. They are emailed to us and are not added to any database or marketing list, and you will not be subscribed to anything. See our{" "}
                                <a href="/privacy" className="underline underline-offset-4 hover:text-ink">Privacy Policy</a>.
                            </p>

                            {status === "error" && (
                                <p role="alert" data-testid="enquiry-server-error" className="border border-signal/40 bg-signal/5 px-4 py-3 text-sm text-signal">
                                    {serverError}
                                </p>
                            )}

                            <button
                                type="submit"
                                disabled={status === "submitting"}
                                data-testid="enquiry-submit-button"
                                className="group inline-flex min-h-[48px] items-center gap-2 rounded-full bg-ink px-7 py-3 text-sm font-medium text-paper transition-colors duration-300 hover:bg-signal hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {status === "submitting" ? "Sending…" : "Send enquiry"}
                                {status !== "submitting" && (
                                    <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                                )}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </section>
    );
}
