import { m, useReducedMotion } from "framer-motion";

export const KineticLines = ({ lines, className = "" }) => {
    const reduce = useReducedMotion();
    return (
        <span className={`block ${className}`}>
            {lines.map((line, i) => (
                <span key={line} className="-mb-[0.08em] block overflow-hidden pb-[0.08em]">
                    <m.span
                        className="block"
                        initial={reduce ? false : { y: "112%" }}
                        animate={{ y: "0%" }}
                        transition={{ duration: 0.95, delay: 0.2 + i * 0.13, ease: [0.22, 1, 0.36, 1] }}
                    >
                        {line}
                    </m.span>
                </span>
            ))}
        </span>
    );
};
