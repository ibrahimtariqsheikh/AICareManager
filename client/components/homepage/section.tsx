import { motion } from "framer-motion";

export const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
        },
    },
}



export const Section = ({
    children,
    className = "",
    animate = true,
    id = ""
}: {
    children: React.ReactNode;
    className?: string;
    animate?: boolean;
    id?: string;
}) => {
    const baseClasses = "container px-4 py-16 md:py-24 mx-auto";
    const combinedClasses = `${baseClasses} ${className}`;

    if (animate) {
        return (
            <motion.section
                id={id}
                className={combinedClasses}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerChildren}
            >
                {children}
            </motion.section>
        );
    }

    return (
        <section id={id} className={combinedClasses}>
            {children}
        </section>
    );
};