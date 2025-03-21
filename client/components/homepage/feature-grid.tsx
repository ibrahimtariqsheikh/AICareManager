// Update feature grid accent colors to purple/magenta
import { motion } from "framer-motion"
import { ArrowRight } from 'lucide-react'

interface Feature {
    icon: React.ReactNode
    title: string
    description: string
    link?: string
}

interface FeatureGridProps {
    features: Feature[]
}

const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
}

const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.4,
        },
    },
}

export function FeatureGrid({ features }: FeatureGridProps) {
    return (
        <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
            variants={staggerChildren}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
        >
            {features.map((feature, index) => (
                <motion.div
                    key={index}
                    className="bg-white dark:bg-black/40 rounded-xl p-6 border border-gray-100 dark:border-white/10 hover:border-purple-200 transition-all relative overflow-hidden group"
                    variants={fadeIn}
                    whileHover={{
                        y: -5,
                        transition: { duration: 0.2 },
                    }}
                >
                    {/* Subtle accent in top right */}
                    <div className="absolute -right-10 -top-10 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl transition-all duration-500 group-hover:bg-purple-500/10" />

                    {/* Icon with accent background */}
                    <div className="mb-5 relative z-10">
                        <div className="w-12 h-12 bg-purple-50 dark:bg-purple-950/20 rounded-lg flex items-center justify-center">
                            <div className="text-purple-500">{feature.icon}</div>
                        </div>
                    </div>

                    {/* Content */}
                    <h3 className="text-lg font-semibold mb-2 relative z-10">{feature.title}</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm relative z-10">{feature.description}</p>

                    {/* Learn more link with arrow */}
                    {feature.link && (
                        <div className="mt-4 relative z-10">
                            <a
                                href={feature.link}
                                className="inline-flex items-center text-sm font-medium text-purple-500 transition-colors group/link"
                            >
                                Learn more
                                <motion.div className="ml-1" initial={{ x: 0 }} whileHover={{ x: 4 }} transition={{ duration: 0.2 }}>
                                    <ArrowRight className="h-4 w-4" />
                                </motion.div>
                            </a>
                        </div>
                    )}

                    {/* Subtle hover indicator */}
                    <motion.div
                        className="absolute bottom-0 left-0 h-1 w-0 bg-purple-500/20 group-hover:w-full transition-all duration-300"
                        initial={{ width: 0 }}
                        whileHover={{ width: "100%" }}
                    />
                </motion.div>
            ))}
        </motion.div>
    )
}
