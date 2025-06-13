"use client";

import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import Image from "next/image";
import { AnimatedSection } from "@/components/ui/animated-section";

export default function AICareManagerPage() {
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
                <AnimatedSection>
                    <div className="text-center">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 mb-6 tracking-tight leading-tight md:leading-relaxed">
                            Run Your Entire Care Operation from One Tab
                        </h1>
                        <p className="text-base md:text-lg text-neutral-500 max-w-3xl mx-auto tracking-tight leading-relaxed font-medium mb-8">
                            From onboarding and scheduling to care plans, reports, and payroll — automate everything with one AI assistant.
                        </p>
                        <Button size="lg" className="text-lg px-8 py-6">
                            See AI Care Manager in Action
                        </Button>
                    </div>
                </AnimatedSection>
            </div>

            {/* Problem Section */}
            <div className="bg-neutral-50 py-16 md:py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <AnimatedSection delay={200}>
                        <div className="max-w-3xl mx-auto text-center">
                            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-neutral-900 mb-4 tracking-tight leading-tight md:leading-relaxed">
                                The Problem
                            </h2>
                            <p className="text-base md:text-lg text-neutral-500 tracking-tight leading-relaxed font-medium">
                                Most care agencies manage operations through scattered systems, spreadsheets, and constant manual input. Staff waste hours on scheduling, compliance checks, note formatting, and document creation — leading to burnout, mistakes, and unnecessary admin costs.
                            </p>
                        </div>
                    </AnimatedSection>
                </div>
            </div>

            {/* What We Solve Section */}
            <div className="py-16 md:py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <AnimatedSection delay={400}>
                        <div className="max-w-3xl mx-auto">
                            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-neutral-900 mb-8 text-center tracking-tight leading-tight md:leading-relaxed">
                                What We Solve
                            </h2>
                            <ul className="space-y-4">
                                {[
                                    "High admin overhead",
                                    "Manual errors in care plans and scheduling",
                                    "Poor staff/client onboarding processes",
                                    "Delayed payroll and invoice generation",
                                    "Lack of real-time care insights"
                                ].map((item, index) => (
                                    <li key={index} className="flex items-start gap-3">
                                        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                                            <Check className="h-4 w-4 text-blue-600" />
                                        </div>
                                        <span className="text-base md:text-lg text-neutral-500 tracking-tight leading-relaxed font-medium">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </AnimatedSection>
                </div>
            </div>

            {/* How AIM Solves It Section */}
            <div className="bg-neutral-50 py-16 md:py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <AnimatedSection delay={600}>
                        <div className="max-w-3xl mx-auto">
                            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-neutral-900 mb-8 text-center tracking-tight leading-tight md:leading-relaxed">
                                How AIM Solves It
                            </h2>
                            <p className="text-base md:text-lg text-neutral-500 mb-8 text-center tracking-tight leading-relaxed font-medium">
                                AIM Care Manager uses one AI interface to centralize and automate:
                            </p>
                            <ul className="space-y-4">
                                {[
                                    "Staff & client onboarding via text prompts",
                                    "Smart rota creation with real-time scheduling suggestions",
                                    "AI-generated care plans from consultation notes",
                                    "Medication alert tracking and resolution",
                                    "Visit note formatting with compliance-friendly output",
                                    "Instant payroll and invoice generation",
                                    "Dynamic dashboards for alerts, compliance, and performance"
                                ].map((item, index) => (
                                    <li key={index} className="flex items-start gap-3">
                                        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                                            <Check className="h-4 w-4 text-blue-600" />
                                        </div>
                                        <span className="text-base md:text-lg text-neutral-500 tracking-tight leading-relaxed font-medium">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </AnimatedSection>
                </div>
            </div>

            {/* Core Features Section */}
            <div className="py-16 md:py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <AnimatedSection delay={800}>
                        <div className="max-w-3xl mx-auto">
                            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-neutral-900 mb-8 text-center tracking-tight leading-tight md:leading-relaxed">
                                Core Features
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {[
                                    "AI-powered scheduling & continuity matching",
                                    "Smart care plan generator with approval workflows",
                                    "Instant alert resolution and task prioritization",
                                    "Visit reporting assistant for carers",
                                    "Auto-generated invoices and payslips",
                                    "Real-time dashboards for finance, compliance, and care delivery"
                                ].map((feature, index) => (
                                    <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
                                        <h3 className="text-base md:text-lg font-medium text-neutral-900 tracking-tight leading-relaxed">{feature}</h3>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </AnimatedSection>
                </div>
            </div>
        </div>
    );
} 