"use client"

import type React from "react"

import { motion } from "framer-motion"
import { Button } from "../../components/ui/button"
import { ArrowRight } from "lucide-react"

interface CTAButtonProps {
    children: React.ReactNode
    onClick?: () => void
    icon?: React.ReactNode
    className?: string
    size?: "default" | "sm" | "lg"
}

export function CTAButton({
    children,
    onClick,
    icon = <ArrowRight className="ml-2 h-4 w-4" />,
    className = "",
    size = "lg",
}: CTAButtonProps) {
    return (
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={{ duration: 0.2 }}>
            <Button
                size={size}
                onClick={onClick}
                className={`bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-400 hover:to-orange-500 text-white shadow-lg hover:shadow-orange-500/20 ${className}`}
            >
                {children}
                {icon}
            </Button>
        </motion.div>
    )
}

export default CTAButton;