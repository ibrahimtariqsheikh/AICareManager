"use client"

import { motion } from "framer-motion"
import type { ReactNode } from "react"

interface AnimatedListItemProps {
    children: ReactNode
    index: number
    onClick?: () => void
}

export function AnimatedListItem({ children, index, onClick }: AnimatedListItemProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            whileHover={{ scale: 1.01, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
            className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-md hover:bg-accent/50 transition-colors cursor-pointer"
            onClick={onClick}
        >
            {children}
        </motion.div>
    )
}
