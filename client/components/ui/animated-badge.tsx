"use client"
import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

interface AnimatedBadgeProps {
    text: string
    href?: string
    className?: string
}

export function AnimatedBadge({ text, href, className = "" }: AnimatedBadgeProps) {
    const BadgeContent = () => (
        <motion.div
            className={`group relative flex w-fit items-center gap-4 rounded-full border p-1 pl-4 bg-muted hover:bg-background shadow-md shadow-zinc-950/5 transition-colors duration-300 dark:border-t-white/5 dark:shadow-zinc-950 ${className}`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
        >
            <span className="text-foreground text-sm">{text}</span>
            <span className="dark:border-background block h-4 w-0.5 border-l bg-white dark:bg-zinc-700"></span>

            <div className="bg-background group-hover:bg-muted size-6 overflow-hidden rounded-full duration-300">
                <motion.div
                    className="flex w-12"
                    initial={{ x: "-33%" }}
                    animate={{ x: 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    whileHover={{ x: 0 }}
                >
                    <span className="flex size-6">
                        <ArrowRight className="m-auto size-3" />
                    </span>
                    <span className="flex size-6">
                        <ArrowRight className="m-auto size-3" />
                    </span>
                </motion.div>
            </div>
        </motion.div>
    )

    if (href) {
        return (
            <Link href={href}>
                <BadgeContent />
            </Link>
        )
    }

    return <BadgeContent />
}
