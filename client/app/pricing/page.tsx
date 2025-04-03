"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Check } from "lucide-react"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
import { Switch } from "../../components/ui/switch"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../components/ui/accordian"
import { cn } from "../../lib/utils"

export default function PricingPage() {
    const [annual, setAnnual] = useState(false)

    // Define plans outside of the component to avoid hydration errors
    const plansData = [
        {
            name: "Starter",
            priceMonthly: "$99",
            priceAnnual: "$79",
            description: "Perfect for small care agencies just getting started",
            features: [
                "Up to 10 care workers",
                "Basic schedule management",
                "Client management",
                "Simple incident reporting",
                "Mobile app access",
                "Email support",
                "Basic dashboard",
            ],
            popular: false,
            buttonText: "Start Free Trial",
            buttonVariant: "outline" as const,
            href: "#book-demo",
        },
        {
            name: "Professional",
            priceMonthly: "$199",
            priceAnnual: "$159",
            description: "Ideal for growing healthcare organizations",
            features: [
                "Up to 50 care workers",
                "Advanced schedule management",
                "Electronic medication records (EMAR)",
                "Revenue tracking dashboard",
                "Custom forms and assessments",
                "Week view of all schedules",
                "Family chat bot",
                "Priority support",
                "Advanced reporting",
            ],
            popular: true,
            buttonText: "Start Free Trial",
            buttonVariant: "default" as const,
            href: "#book-demo",
        },
        {
            name: "Enterprise",
            priceMonthly: "$399",
            priceAnnual: "$319",
            description: "For large healthcare providers with complex needs",
            features: [
                "Unlimited care workers",
                "Multi-facility management",
                "Advanced AI chat bot",
                "Custom dashboards",
                "White-labeling options",
                "Enterprise-grade security",
                "24/7 priority support",
                "Staff training included",
                "API access",
                "Custom integrations",
            ],
            popular: false,
            buttonText: "Contact Sales",
            buttonVariant: "outline" as const,
            href: "/contact",
        },
    ]

    // Use the static data to create plans with the current pricing
    const plans = plansData.map(plan => ({
        ...plan,
        price: annual ? plan.priceAnnual : plan.priceMonthly,
        period: "/ mo"
    }))

    const faqs = [
        {
            question: "How long is the free trial?",
            answer: "Our free trial lasts for 14 days with full access to all features. No credit card required to start.",
        },
        {
            question: "Can I change plans later?",
            answer: "Yes, you can upgrade or downgrade your plan at any time as your needs change.",
        },
        {
            question: "Is my data secure?",
            answer: "Yes, we use healthcare-grade security to protect all your sensitive information and comply with healthcare data regulations.",
        },
        {
            question: "Do you offer training?",
            answer: "Yes, we provide training for all plans. Professional plans include group training sessions, and Enterprise plans include personalized training.",
        },
        {
            question: "How does the family chat bot work?",
            answer: "The chat bot helps families get quick answers about their loved one's care, schedule, and medication, reducing calls to your office staff.",
        },
        {
            question: "What payment methods do you accept?",
            answer: "We accept all major credit cards, bank transfers, and can accommodate purchase orders for Enterprise plans.",
        },
    ]

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    }

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100,
            },
        },
    }

    return (
        <section className="py-16 md:py-32 bg-gradient-to-b from-background to-background/80">
            <div className="mx-auto max-w-6xl px-6">
                <div className="mx-auto max-w-2xl space-y-6 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-center text-4xl font-semibold lg:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70"
                    >
                        Simple Pricing for Better Care
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-muted-foreground text-lg"
                    >
                        AI Care Manager helps you deliver better care with less paperwork. Choose the plan that works for you.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="flex items-center justify-center space-x-3 pt-4"
                    >
                        <span className={cn("text-sm", !annual && "text-primary font-medium")}>Monthly</span>
                        <Switch checked={annual} onCheckedChange={setAnnual} className="data-[state=checked]:bg-primary" />
                        <span className={cn("text-sm flex items-center gap-1.5", annual && "text-primary font-medium")}>
                            Annual
                            <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full font-medium">Save 20%</span>
                        </span>
                    </motion.div>
                </div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="mt-8 grid gap-6 md:mt-16 md:grid-cols-3"
                >
                    {plans.map((plan, index) => (
                        <motion.div key={index} variants={itemVariants}>
                            <Card
                                className={cn(
                                    "flex flex-col h-full transition-all duration-200 hover:shadow-lg",
                                    plan.popular && "border-primary/50 shadow-md relative",
                                )}
                            >
                                {plan.popular && (
                                    <span className="absolute inset-x-0 -top-3 mx-auto flex h-6 w-fit items-center rounded-full bg-gradient-to-r from-primary/80 to-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                                        Most Popular
                                    </span>
                                )}

                                <div className="flex flex-col h-full">
                                    <CardHeader>
                                        <CardTitle className="font-medium text-xl">{plan.name}</CardTitle>
                                        <div className="my-3 flex items-end">
                                            <span className="text-3xl font-bold">{plan.price}</span>
                                            <span className="text-sm text-muted-foreground ml-1">{plan.period}</span>
                                        </div>
                                        <CardDescription className="text-sm">{plan.description}</CardDescription>
                                    </CardHeader>

                                    <CardContent className="space-y-4 flex-grow">
                                        <div className="h-px bg-border/50 w-full" />

                                        <ul className="space-y-3 text-base">
                                            {plan.features.map((feature, featureIndex) => (
                                                <li key={featureIndex} className="flex items-start gap-2">
                                                    <Check className="size-5 text-primary mt-0.5 shrink-0" />
                                                    <span>{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>

                                    <CardFooter className="mt-auto pt-4">
                                        <Button
                                            asChild
                                            variant={plan.buttonVariant}
                                            className={cn(
                                                "w-full text-base py-6",
                                                plan.popular && plan.buttonVariant === "default" && "bg-primary hover:bg-primary/90",
                                            )}
                                        >
                                            <Link href={plan.href}>{plan.buttonText}</Link>
                                        </Button>
                                    </CardFooter>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                    className="mt-20 mx-auto max-w-3xl"
                >
                    <h2 className="text-2xl font-semibold text-center mb-8">Common Questions</h2>

                    <Accordion type="single" collapsible className="w-full">
                        {faqs.map((faq, index) => (
                            <AccordionItem key={index} value={`item-${index}`}>
                                <AccordionTrigger className="text-left text-lg py-4">{faq.question}</AccordionTrigger>
                                <AccordionContent className="text-base">{faq.answer}</AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1 }}
                    className="mt-16 text-center"
                >
                    <div className="p-6 rounded-lg bg-muted/50 inline-block mx-auto">
                        <h3 className="text-xl font-medium mb-2">Need a custom solution?</h3>
                        <p className="text-muted-foreground mb-4 text-base">We can create a plan that fits your exact needs.</p>
                        <Button asChild size="lg" className="text-base py-6">
                            <Link href="/contact">Talk to Our Team</Link>
                        </Button>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}

