import { m, useReducedMotion } from "framer-motion";

export const Reveal = ({ children, delay = 0, className = "", amount = 0.3, duration = 0.7 }) => {
    const reduce = useReducedMotion();
    return (
        <m.div
            className={className}
            initial={reduce ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px", amount }}
            transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
        >
            {children}
        </m.div>
    );
};
