"use client"

// Update testimonial colors to purple/magenta
import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { motion, AnimatePresence } from "framer-motion"
import { Star } from "lucide-react"

interface Testimonial {
    quote: string
    author: string
    role: string
    rating: number
}

interface TestimonialCarouselProps {
    testimonials: Testimonial[]
    autoPlay?: boolean
    interval?: number
}

export function TestimonialCarousel({ testimonials, autoPlay = true, interval = 5000 }: TestimonialCarouselProps) {
    const [currentTestimonial, setCurrentTestimonial] = useState(0)
    const { theme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        if (!autoPlay) return

        const intervalId = setInterval(() => {
            setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
        }, interval)

        return () => clearInterval(intervalId)
    }, [autoPlay, interval, testimonials.length])

    if (!mounted) return null

    return (
        <div className="max-w-4xl mx-auto relative h-64">
            <AnimatePresence mode="wait">
                {testimonials.map(
                    (testimonial, index) =>
                        index === currentTestimonial && (
                            <motion.div
                                key={index}
                                className={`absolute inset-0 ${theme === "dark" ? "testimonial-card" : "bg-white"} backdrop-blur-md rounded-2xl p-8 border ${theme === "dark" ? "border-purple-500/10" : "border-gray-100"} ${theme === "dark" ? "shadow-xl" : "shadow-sm"}`}
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                transition={{ duration: 0.5 }}
                            >
                                <div className="flex flex-col h-full justify-between">
                                    <div>
                                        <div className="flex mb-4">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`h-5 w-5 ${i < testimonial.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
                                                />
                                            ))}
                                        </div>
                                        <p className="text-lg italic mb-6">"{testimonial.quote}"</p>
                                    </div>
                                    <div>
                                        <p className="font-semibold">{testimonial.author}</p>
                                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ),
                )}
            </AnimatePresence>

            <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {testimonials.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentTestimonial(index)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentTestimonial
                                ? "bg-purple-500 w-6"
                                : `${theme === "dark" ? "bg-purple-500/30" : "bg-purple-300/50"}`
                            }`}
                        aria-label={`Go to testimonial ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    )
}

