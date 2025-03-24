import { motion } from "framer-motion"
import { ArrowRight } from 'lucide-react'
import { Button } from "../../components/ui/button"

interface CTAButtonProps {
    children: React.ReactNode
    onClick?: () => void
    icon?: React.ReactNode
    className?: string
    size?: "sm" | "lg" | "icon"
}

// Update the button gradient colors to purple/magenta
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
                onClick={onClick}
                className={` ${className}`}
            >
                {children}
                {icon}
            </Button>
        </motion.div>
    )
}
