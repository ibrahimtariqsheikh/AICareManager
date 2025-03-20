"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { ArrowRight, Check, CalendarDays } from "lucide-react"
import { toast } from "sonner"
import { useTheme } from "next-themes"

const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5 },
    },
}

// Update the BookDemoSection to be more subtle in light mode
export function BookDemoSection() {
    const { theme } = useTheme()
    const [mounted, setMounted] = useState(false)
    const [formState, setFormState] = useState({
        name: "",
        email: "",
        organization: "",
        size: "",
        message: "",
        submitted: false,
    })

    useEffect(() => {
        setMounted(true)
    }, [])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        console.log("Form submitted:", formState)
        toast.success("Demo request submitted! We'll contact you shortly.")

        setFormState({
            name: "",
            email: "",
            organization: "",
            size: "",
            message: "",
            submitted: true,
        })

        setTimeout(() => {
            setFormState((prev) => ({ ...prev, submitted: false }))
        }, 5000)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormState({
            ...formState,
            [e.target.name]: e.target.value,
        })
    }

    if (!mounted) return null

    return (
        <section id="book-demo" className="py-20 relative overflow-hidden">
            {/* Background blurs - more subtle, especially in light mode */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div
                    className={`absolute top-0 right-0 w-[500px] h-[500px] ${theme === "dark" ? "bg-slate-700/10" : "bg-slate-200/20"} rounded-full blur-3xl`}
                ></div>
                <div
                    className={`absolute -bottom-20 left-0 w-[600px] h-[600px] ${theme === "dark" ? "bg-slate-800/10" : "bg-slate-100/20"} rounded-full blur-3xl`}
                ></div>
                <div
                    className={`absolute top-1/3 left-1/4 w-[300px] h-[300px] ${theme === "dark" ? "bg-orange-900/5" : "bg-orange-100/10"} rounded-full blur-3xl`}
                ></div>
            </div>

            <div className="container px-4 relative z-10 max-w-5xl mx-auto">
                <motion.div
                    className="text-center mb-12"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    variants={fadeIn}
                >
                    <span
                        className={`inline-block px-4 py-1 rounded-full ${theme === "dark" ? "bg-slate-800/50 text-slate-300" : "bg-slate-100 text-slate-600"} text-sm font-medium mb-4`}
                    >
                        Book a Demo
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">See Our Platform in Action</h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Schedule a personalized demo to see how our platform can transform your healthcare operations
                    </p>
                </motion.div>

                <motion.div
                    className={`${theme === "dark" ? "bg-black/60" : "bg-white"} backdrop-blur-xl rounded-3xl overflow-hidden border ${theme === "dark" ? "border-slate-800/20" : "border-slate-200/50"} ${theme === "dark" ? "shadow-lg" : "shadow-sm"}`}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                    variants={fadeIn}
                >
                    <div className="p-8 md:p-12">
                        {formState.submitted ? (
                            <motion.div
                                className="flex flex-col items-center justify-center py-16 text-center"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.4 }}
                            >
                                <div
                                    className={`w-20 h-20 ${theme === "dark" ? "bg-green-900/30" : "bg-green-50"} rounded-full flex items-center justify-center mb-6`}
                                >
                                    <Check className={`w-10 h-10 ${theme === "dark" ? "text-green-400" : "text-green-500"}`} />
                                </div>
                                <h3 className="text-2xl font-semibold mb-3">Thank You!</h3>
                                <p className="text-muted-foreground max-w-md mb-2">
                                    We've received your request and will contact you shortly to schedule your personalized demo.
                                </p>
                            </motion.div>
                        ) : (
                            <div className="grid md:grid-cols-2 gap-8 items-start">
                                {/* Left side - Form */}
                                <div>
                                    <div className="mb-6">
                                        <h3 className="text-xl font-semibold mb-2">Book Your Free Demo</h3>
                                        <p className="text-muted-foreground text-sm">
                                            Fill out the form below and we'll get back to you within 24 hours
                                        </p>
                                    </div>

                                    <form onSubmit={handleSubmit} className="space-y-5">
                                        <div className="space-y-2">
                                            <label htmlFor="name" className="block text-sm font-medium">
                                                Your Name
                                            </label>
                                            <Input
                                                id="name"
                                                name="name"
                                                value={formState.name}
                                                onChange={handleChange}
                                                placeholder="John Smith"
                                                required
                                                className={`h-11 ${theme === "dark" ? "bg-gray-900/20 border-gray-800" : "bg-gray-50/50 border-gray-200"} focus:border-slate-400 dark:focus:border-slate-600 transition-all rounded-xl`}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label htmlFor="email" className="block text-sm font-medium">
                                                Email Address
                                            </label>
                                            <Input
                                                id="email"
                                                name="email"
                                                type="email"
                                                value={formState.email}
                                                onChange={handleChange}
                                                placeholder="john@example.com"
                                                required
                                                className={`h-11 ${theme === "dark" ? "bg-gray-900/20 border-gray-800" : "bg-gray-50/50 border-gray-200"} focus:border-slate-400 dark:focus:border-slate-600 transition-all rounded-xl`}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label htmlFor="organization" className="block text-sm font-medium">
                                                Organization
                                            </label>
                                            <Input
                                                id="organization"
                                                name="organization"
                                                value={formState.organization}
                                                onChange={handleChange}
                                                placeholder="Your healthcare organization"
                                                required
                                                className={`h-11 ${theme === "dark" ? "bg-gray-900/20 border-gray-800" : "bg-gray-50/50 border-gray-200"} focus:border-slate-400 dark:focus:border-slate-600 transition-all rounded-xl`}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label htmlFor="size" className="block text-sm font-medium">
                                                Organization Size
                                            </label>
                                            <Select
                                                value={formState.size}
                                                onValueChange={(value) => setFormState({ ...formState, size: value })}
                                            >
                                                <SelectTrigger
                                                    className={`h-11 ${theme === "dark" ? "bg-gray-900/20 border-gray-800" : "bg-gray-50/50 border-gray-200"} focus:border-slate-400 dark:focus:border-slate-600 transition-all rounded-xl`}
                                                >
                                                    <SelectValue placeholder="Select organization size" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="1-10">1-10 employees</SelectItem>
                                                    <SelectItem value="11-50">11-50 employees</SelectItem>
                                                    <SelectItem value="51-200">51-200 employees</SelectItem>
                                                    <SelectItem value="201-500">201-500 employees</SelectItem>
                                                    <SelectItem value="501+">501+ employees</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="pt-2">
                                            <Button
                                                type="submit"
                                                className={`w-full ${theme === "dark" ? "bg-gradient-to-r from-slate-600 to-slate-500 hover:from-slate-700 hover:to-slate-600" : "bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-600 hover:to-orange-500"} text-white ${theme === "dark" ? "shadow-md hover:shadow-slate-400/20" : "shadow-sm hover:shadow-orange-400/10"} transition-all rounded-xl h-11`}
                                            >
                                                Book Your Demo
                                                <ArrowRight className="ml-2 h-4 w-4" />
                                            </Button>
                                        </div>
                                    </form>
                                </div>

                                {/* Right side - Benefits - with more subtle gradient */}
                                <div
                                    className={`${theme === "dark" ? "bg-gradient-to-br from-slate-900/30 to-black/40" : "bg-gradient-to-br from-slate-50 to-white"} rounded-2xl p-8 border ${theme === "dark" ? "border-slate-800/20" : "border-slate-100"} ${theme === "dark" ? "shadow-sm" : "shadow-none"}`}
                                >
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className={`${theme === "dark" ? "bg-slate-800/50" : "bg-slate-100"} p-2 rounded-lg`}>
                                            <CalendarDays className={`h-5 w-5 ${theme === "dark" ? "text-slate-300" : "text-slate-600"}`} />
                                        </div>
                                        <h3 className="text-lg font-semibold">What to expect</h3>
                                    </div>

                                    <ul className="space-y-4">
                                        <li className="flex gap-3">
                                            <div
                                                className={`w-5 h-5 rounded-full ${theme === "dark" ? "bg-slate-800/50" : "bg-slate-100"} flex items-center justify-center flex-shrink-0 mt-0.5`}
                                            >
                                                <span className={`${theme === "dark" ? "text-slate-300" : "text-slate-600"} text-xs font-bold`}>
                                                    1
                                                </span>
                                            </div>
                                            <div>
                                                <p className="font-medium">Personalized walkthrough</p>
                                                <p className="text-sm text-muted-foreground">Tailored to your specific healthcare needs</p>
                                            </div>
                                        </li>

                                        <li className="flex gap-3">
                                            <div
                                                className={`w-5 h-5 rounded-full ${theme === "dark" ? "bg-slate-800/50" : "bg-slate-100"} flex items-center justify-center flex-shrink-0 mt-0.5`}
                                            >
                                                <span className={`${theme === "dark" ? "text-slate-300" : "text-slate-600"} text-xs font-bold`}>
                                                    2
                                                </span>
                                            </div>
                                            <div>
                                                <p className="font-medium">30-minute focused session</p>
                                                <p className="text-sm text-muted-foreground">With time for all your questions</p>
                                            </div>
                                        </li>

                                        <li className="flex gap-3">
                                            <div
                                                className={`w-5 h-5 rounded-full ${theme === "dark" ? "bg-slate-800/50" : "bg-slate-100"} flex items-center justify-center flex-shrink-0 mt-0.5`}
                                            >
                                                <span className={`${theme === "dark" ? "text-slate-300" : "text-slate-600"} text-xs font-bold`}>
                                                    3
                                                </span>
                                            </div>
                                            <div>
                                                <p className="font-medium">No pressure or obligation</p>
                                                <p className="text-sm text-muted-foreground">Just helpful information for your decision</p>
                                            </div>
                                        </li>
                                    </ul>

                                    <div
                                        className={`mt-8 pt-6 border-t ${theme === "dark" ? "border-slate-700/30" : "border-slate-200/30"}`}
                                    >
                                        <p className="text-sm italic text-muted-foreground">
                                            "The demo was incredibly helpful. We saw exactly how the platform would work for our specific care
                                            scenarios."
                                        </p>
                                        <p className="text-sm font-medium mt-2">— Emma Rodriguez, Operations Manager</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </section>
    )
}

