"use client"

import { motion } from "framer-motion"
import type { ReactNode } from "react"
import { Card } from "@/components/ui/card"

interface AnimatedCardProps {
    children: ReactNode
    delay?: number
    className?: string
}

export function AnimatedCard({ children, delay = 0, className = "" }: AnimatedCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, delay }}
        >
            <Card className={className}>{children}</Card>
        </motion.div>
    )
}
