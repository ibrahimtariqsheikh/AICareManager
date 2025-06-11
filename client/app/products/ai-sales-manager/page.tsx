"use client";

import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import Image from "next/image";

export default function AISalesManagerPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
                <div className="text-center">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 mb-6 tracking-tight">
                        Book More Clients. With Fewer Staff.
                    </h1>
                    <p className="text-xl md:text-2xl text-neutral-600 mb-8 max-w-3xl mx-auto">
                        Use AI to follow up, book calls, qualify leads, and manage your pipeline — 24/7, without hiring a sales team.
                    </p>
                    <Button size="lg" className="text-lg px-8 py-6">
                        See How AI Books for You
                    </Button>
                </div>
            </div>

            {/* Problem Section */}
            <div className="bg-neutral-50 py-16 md:py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-6">
                            The Problem
                        </h2>
                        <p className="text-lg text-neutral-600">
                            Care agencies lose leads every week due to missed follow-ups, manual tracking, and overwhelmed front desks.
                        </p>
                    </div>
                </div>
            </div>

            {/* What We Solve Section */}
            <div className="py-16 md:py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-8 text-center">
                            What We Solve
                        </h2>
                        <ul className="space-y-4">
                            {[
                                "Leads slipping through the cracks",
                                "No-shows and unbooked assessments",
                                "Lack of visibility in the sales pipeline"
                            ].map((item, index) => (
                                <li key={index} className="flex items-start gap-3">
                                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                                        <Check className="h-4 w-4 text-blue-600" />
                                    </div>
                                    <span className="text-lg text-neutral-600">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* How AIM Solves It Section */}
            <div className="bg-neutral-50 py-16 md:py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-8 text-center">
                            How AIM Solves It
                        </h2>
                        <ul className="space-y-4">
                            {[
                                "AI books consultations through your site, ads, or messages",
                                "Auto-follows up via SMS, email, and calls",
                                "Qualifies leads and updates your CRM automatically"
                            ].map((item, index) => (
                                <li key={index} className="flex items-start gap-3">
                                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                                        <Check className="h-4 w-4 text-blue-600" />
                                    </div>
                                    <span className="text-lg text-neutral-600">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Core Features Section */}
            <div className="py-16 md:py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-8 text-center">
                            Core Features
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[
                                "Central CRM dashboard",
                                "AI call agents for booking and follow-up",
                                "Consultation reminders and lead nurture",
                                "Pipeline visualizer from enquiry to client onboarded"
                            ].map((feature, index) => (
                                <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
                                    <h3 className="text-lg font-semibold text-neutral-900 mb-2">{feature}</h3>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 