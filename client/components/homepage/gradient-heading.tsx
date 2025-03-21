import { motion } from "framer-motion"

// Update the gradient heading colors to purple/magenta

interface GradientHeadingProps {
    children: React.ReactNode
    className?: string
    as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "div"
    variants?: any
}

export function GradientHeading({ children, className = "", as = "h2", variants }: GradientHeadingProps) {
    const baseClasses =
        "bg-gradient-to-r from-purple-500 to-fuchsia-400 dark:from-purple-400 dark:to-fuchsia-300 bg-clip-text text-transparent"
    const combinedClasses = `${baseClasses} ${className}`

    const Component = motion[as]

    return (
        <Component className={combinedClasses} variants={variants}>
            {children}
        </Component>
    )
}
