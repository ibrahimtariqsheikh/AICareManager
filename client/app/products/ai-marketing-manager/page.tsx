"use client";

import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import Image from "next/image";
import { AnimatedSection } from "@/components/ui/animated-section";

export default function AIMarketingManagerPage() {
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
                <AnimatedSection>
                    <div className="text-center">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 mb-6 tracking-tight leading-tight md:leading-relaxed">
                            Grow Your Care Business with AI Marketing
                        </h1>
                        <p className="text-base md:text-lg text-neutral-500 max-w-3xl mx-auto tracking-tight leading-relaxed font-medium mb-8">
                            From content creation to campaign management — automate your entire marketing process with one AI assistant.
                        </p>
                        <Button size="lg" className="text-lg px-8 py-6">
                            See AI Marketing Manager in Action
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
                                Most care agencies struggle with creating engaging content, managing campaigns, and measuring ROI. Marketing teams waste time on manual tasks, inconsistent messaging, and scattered tools — leading to poor results and wasted budget.
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
                                    "Manual content creation and scheduling",
                                    "Inconsistent brand messaging",
                                    "Poor campaign performance",
                                    "Lack of marketing insights",
                                    "Scattered marketing tools"
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
                                AIM Marketing Manager uses one AI interface to centralize and automate:
                            </p>
                            <ul className="space-y-4">
                                {[
                                    "AI-powered content creation",
                                    "Smart campaign scheduling",
                                    "Personalized messaging",
                                    "Multi-channel campaign management",
                                    "Automated social media posting",
                                    "Real-time performance analytics",
                                    "Dynamic marketing dashboards"
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
                                    "AI content generation & optimization",
                                    "Smart campaign scheduling",
                                    "Multi-channel management",
                                    "Social media automation",
                                    "Performance analytics",
                                    "Marketing ROI tracking"
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