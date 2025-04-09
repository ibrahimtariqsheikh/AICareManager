"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import type { ButtonProps } from "@/components/ui/button"
import type { ReactNode } from "react"

interface AnimatedButtonProps extends ButtonProps {
    children: ReactNode
    onClick?: () => void
    className?: string
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
}

export function AnimatedButton({ children, onClick, className, variant = "default", ...props }: AnimatedButtonProps) {
    return (
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button onClick={onClick} className={className} variant={variant} {...props}>
                {children}
            </Button>
        </motion.div>
    )
}
