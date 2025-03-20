"use client"

import { useRef } from "react"

interface AnimatedGradientBlobProps {
    className?: string
    delay?: number
    size?: "sm" | "md" | "lg" | "xl"
    position?: "top-left" | "top-right" | "bottom-left" | "bottom-right" | "center"
    intensity?: "low" | "medium" | "high"
}

export function AnimatedGradientBlob({
    className = "",
    delay = 0,
    size = "lg",
    position = "center",
    intensity = "medium",
}: AnimatedGradientBlobProps) {
    const blobRef = useRef<HTMLDivElement>(null)

    // Size classes
    const sizeClasses = {
        sm: "w-32 h-32",
        md: "w-64 h-64",
        lg: "w-96 h-96",
        xl: "w-[32rem] h-[32rem]",
    }

    // Position classes
    const positionClasses = {
        "top-left": "-top-20 -left-20",
        "top-right": "-top-20 -right-20",
        "bottom-left": "-bottom-20 -left-20",
        "bottom-right": "-bottom-20 -right-20",
        center: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
    }

    // Intensity classes (opacity)
    const intensityClasses = {
        low: "opacity-20",
        medium: "opacity-40",
        high: "opacity-60",
    }

    // Animation delay
    const delayStyle = { animationDelay: `${delay}s` }

    return (
        <div className="overflow-visible">
            <div
                ref={blobRef}
                className={`absolute rounded-full bg-gradient-radial from-orange-500/40 to-orange-500/0 blur-[80px] animate-blob ${sizeClasses[size]} ${positionClasses[position]} ${intensityClasses[intensity]} ${className}`}
                style={delayStyle}
            />
        </div>
    )
}

export default AnimatedGradientBlob;