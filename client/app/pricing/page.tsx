"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
import { Check, ArrowRight } from "lucide-react"
import { Switch } from "../../components/ui/switch"
import { AnimatedGradientBlob } from "../../components/homepage/animated-gradient-blob"
import { GradientHeading } from "../../components/homepage/gradient-heading"
import Link from "next/link"

const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6 },
    },
}

const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
        },
    },
}

const scaleUp = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.5 },
    },
    hover: {
        y: -8,
        boxShadow: "0 20px 40px rgba(255, 125, 0, 0.1)",
        transition: { duration: 0.3 },
    },
}

// Pricing plans data
const plans = [
    {
        name: "Starter",
        description: "Perfect for small care agencies just getting started",
        monthlyPrice: 99,
        yearlyPrice: 79,
        features: [
            "Up to 10 care workers",
            "Basic scheduling",
            "Incident reporting",
            "Client management",
            "Mobile app access",
            "Email support",
        ],
        highlighted: false,
        cta: "Start Free Trial",
    },
    {
        name: "Professional",
        description: "Ideal for growing healthcare organizations",
        monthlyPrice: 199,
        yearlyPrice: 159,
        features: [
            "Up to 50 care workers",
            "Advanced scheduling",
            "Custom forms",
            "Medication management",
            "Family portal",
            "API access",
            "Priority support",
            "Data analytics",
        ],
        highlighted: true,
        cta: "Start Free Trial",
        badge: "Most Popular",
    },
    {
        name: "Enterprise",
        description: "For large healthcare providers with complex needs",
        monthlyPrice: 399,
        yearlyPrice: 319,
        features: [
            "Unlimited care workers",
            "White-labeling",
            "Advanced integrations",
            "Custom workflows",
            "Dedicated account manager",
            "24/7 phone support",
            "Advanced security features",
            "Custom reporting",
            "Staff training",
        ],
        highlighted: false,
        cta: "Contact Sales",
    },
]

// FAQ data
const faqs = [
    {
        question: "Do you offer a free trial?",
        answer: "Yes, we offer a 14-day free trial for all our plans. No credit card required to get started.",
    },
    {
        question: "Can I change plans later?",
        answer:
            "You can upgrade or downgrade your plan at any time. Changes take effect at the start of your next billing cycle.",
    },
    {
        question: "Is there a setup fee?",
        answer: "No, there are no setup fees for any of our plans. You only pay the advertised subscription price.",
    },
    {
        question: "Do you offer discounts for non-profits?",
        answer:
            "Yes, we offer special pricing for non-profit healthcare organizations. Please contact our sales team for details.",
    },
    {
        question: "What payment methods do you accept?",
        answer: "We accept all major credit cards, as well as direct bank transfers for annual plans.",
    },
    {
        question: "How secure is my data?",
        answer:
            "We take security seriously. Our platform is HIPAA compliant and uses industry-leading encryption to protect your data.",
    },
]

export default function PricingPage() {
    const [isYearly, setIsYearly] = useState(true)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    return (
        <div className="min-h-screen w-full overflow-hidden bg-gradient-to-b from-orange-50 to-white dark:from-stone-950 dark:to-stone-900 pt-32 pb-20">
            {/* Background blobs */}
            <div className="relative">
                <AnimatedGradientBlob position="top-right" size="xl" intensity="low" />
                <AnimatedGradientBlob position="bottom-left" size="xl" intensity="low" delay={2} />
            </div>

            <div className="container px-4 relative z-10">
                {/* Header */}
                <motion.div
                    className="text-center max-w-3xl mx-auto mb-16"
                    initial="hidden"
                    animate="visible"
                    variants={fadeIn}
                >
                    <motion.div
                        className="inline-block px-4 py-1 rounded-full bg-orange-500/10 backdrop-blur-sm text-orange-500 text-sm font-medium mb-4"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        Simple, Transparent Pricing
                    </motion.div>

                    <GradientHeading as="h1" className="text-4xl md:text-5xl font-bold mb-4">
                        Choose the Perfect Plan for Your Healthcare Needs
                    </GradientHeading>

                    <p className="text-muted-foreground text-lg">
                        All plans include a 14-day free trial. No credit card required.
                    </p>
                </motion.div>

                {/* Billing toggle */}
                <motion.div
                    className="flex justify-center items-center mb-12"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <div className="flex items-center gap-4 bg-white/70 dark:bg-black/40 backdrop-blur-md p-2 rounded-full border border-white/50 dark:border-white/10">
                        <span
                            className={`text-sm font-medium px-3 py-1 rounded-full transition-colors ${!isYearly ? "bg-orange-500/10 text-orange-500" : "text-muted-foreground"}`}
                        >
                            Monthly
                        </span>

                        <Switch checked={isYearly} onCheckedChange={setIsYearly} className="data-[state=checked]:bg-orange-500" />

                        <span
                            className={`text-sm font-medium px-3 py-1 rounded-full transition-colors flex items-center gap-1 ${isYearly ? "bg-orange-500/10 text-orange-500" : "text-muted-foreground"}`}
                        >
                            Yearly
                            <span className="bg-green-500/10 text-green-500 text-xs px-2 py-0.5 rounded-full">Save 20%</span>
                        </span>
                    </div>
                </motion.div>

                {/* Pricing cards */}
                <motion.div
                    className="grid md:grid-cols-3 gap-8 mb-20"
                    variants={staggerChildren}
                    initial="hidden"
                    animate="visible"
                >
                    {plans.map((plan, index) => (
                        <motion.div
                            key={plan.name}
                            variants={scaleUp}
                            whileHover={plan.highlighted ? "hover" : {}}
                            className={`relative ${plan.highlighted ? "md:-mt-4 md:mb-4" : ""}`}
                        >
                            <Card
                                className={`h-full backdrop-blur-md overflow-hidden ${plan.highlighted
                                    ? "bg-gradient-to-b from-white/90 to-orange-50/90 dark:from-black/90 dark:to-stone-900/90 border-orange-500/30 shadow-xl"
                                    : "bg-white/70 dark:bg-black/40 border-white/50 dark:border-white/10"
                                    } rounded-3xl`}
                            >
                                {plan.badge && (
                                    <div className="absolute top-0 right-0">
                                        <div className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-xl">
                                            {plan.badge}
                                        </div>
                                    </div>
                                )}

                                <CardHeader>
                                    <CardTitle className={`text-2xl ${plan.highlighted ? "text-orange-500" : ""}`}>{plan.name}</CardTitle>
                                    <CardDescription className="min-h-[40px]">{plan.description}</CardDescription>
                                </CardHeader>

                                <CardContent>
                                    <div className="mb-6">
                                        <span className="text-4xl font-bold">${isYearly ? plan.yearlyPrice : plan.monthlyPrice}</span>
                                        <span className="text-muted-foreground ml-1">/month</span>

                                        {isYearly && (
                                            <div className="text-sm text-muted-foreground mt-1">
                                                Billed annually (${plan.yearlyPrice * 12}/year)
                                            </div>
                                        )}
                                    </div>

                                    <ul className="space-y-3 mb-6">
                                        {plan.features.map((feature, i) => (
                                            <li key={i} className="flex items-start">
                                                <Check
                                                    className={`h-5 w-5 mr-2 flex-shrink-0 ${plan.highlighted ? "text-orange-500" : "text-green-500"}`}
                                                />
                                                <span className="text-sm">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>

                                <CardFooter>
                                    <Button
                                        className={`w-full rounded-xl ${plan.highlighted
                                            ? "bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-400 hover:to-orange-500 text-white"
                                            : "bg-white dark:bg-black border border-orange-500/50 text-orange-500 hover:bg-orange-500/10"
                                            }`}
                                        asChild
                                    >
                                        <Link href={plan.cta === "Contact Sales" ? "/contact" : "#book-demo"}>
                                            {plan.cta}
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>

                {/* FAQs */}
                <motion.div
                    className="max-w-3xl mx-auto"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    variants={fadeIn}
                >
                    <div className="text-center mb-12">
                        <GradientHeading as="h2" className="text-3xl font-bold mb-4">
                            Frequently Asked Questions
                        </GradientHeading>
                        <p className="text-muted-foreground">
                            Have more questions?{" "}
                            <a href="/contact" className="text-orange-500 hover:underline">
                                Contact our team
                            </a>
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {faqs.map((faq, index) => (
                            <motion.div
                                key={index}
                                className="bg-white/70 dark:bg-black/40 backdrop-blur-md p-6 rounded-2xl border border-white/50 dark:border-white/10"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <h3 className="text-lg font-medium mb-2">{faq.question}</h3>
                                <p className="text-muted-foreground">{faq.answer}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* CTA */}
                <motion.div
                    className="mt-20 text-center"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    variants={fadeIn}
                >
                    <GradientHeading as="h2" className="text-2xl md:text-3xl font-bold mb-4">
                        Ready to transform your healthcare operations?
                    </GradientHeading>

                    <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                        Join care providers who are using our platform to improve communication, ensure compliance, and deliver
                        better care.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                            size="lg"
                            className="bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-400 hover:to-orange-500 text-white shadow-lg hover:shadow-orange-500/20 rounded-xl"
                            asChild
                        >
                            <Link href="#book-demo">
                                Book a Free Demo
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>

                        <Button
                            variant="outline"
                            size="lg"
                            className="border-orange-500/50 text-orange-500 hover:bg-orange-500/10 rounded-xl"
                            asChild
                        >
                            <Link href="/contact">Contact Sales</Link>
                        </Button>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

