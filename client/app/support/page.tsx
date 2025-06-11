"use client";

import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import Image from "next/image";

export default function SupportPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
                <div className="text-center">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 mb-6 tracking-tight">
                        Get Started in Minutes, Not Days
                    </h1>
                    <p className="text-xl md:text-2xl text-neutral-600 mb-8 max-w-3xl mx-auto">
                        Our team of care experts will help you set up, train your staff, and get you running smoothly.
                    </p>
                    <Button size="lg" className="text-lg px-8 py-6">
                        Book Your Onboarding Call
                    </Button>
                </div>
            </div>

            {/* What We Offer Section */}
            <div className="bg-neutral-50 py-16 md:py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-8 text-center">
                            What We Offer
                        </h2>
                        <ul className="space-y-4">
                            {[
                                "1:1 onboarding sessions",
                                "Staff training workshops",
                                "24/7 support via chat and email",
                                "Regular check-ins to ensure you're getting the most out of AIM"
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
        </div>
    );
} 