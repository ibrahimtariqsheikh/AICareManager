"use client"

import type React from "react"

import { motion } from "framer-motion"

interface GradientHeadingProps {
    children: React.ReactNode
    className?: string
    as?: "h1" | "h2" | "h3" | "h4"
    variants?: any
}

export function GradientHeading({ children, className = "", as = "h2", variants }: GradientHeadingProps) {
    const baseClasses =
        "bg-gradient-to-r from-orange-500 to-orange-400 dark:from-orange-400 dark:to-orange-300 bg-clip-text text-transparent"
    const combinedClasses = `${baseClasses} ${className}`

    const Component = motion[as]

    return (
        <Component className={combinedClasses} variants={variants}>
            {children}
        </Component>
    )
}

export default GradientHeading;