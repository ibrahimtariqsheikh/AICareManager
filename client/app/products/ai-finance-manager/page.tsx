"use client";

import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import Image from "next/image";

export default function AIFinanceManagerPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
                <div className="text-center">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 mb-6 tracking-tight">
                        Finance, Payroll, and Invoicing — On Autopilot
                    </h1>
                    <p className="text-xl md:text-2xl text-neutral-600 mb-8 max-w-3xl mx-auto">
                        Track revenue, generate invoices, create payslips, and forecast performance — all with one AI dashboard.
                    </p>
                    <Button size="lg" className="text-lg px-8 py-6">
                        Automate Your Financial Ops
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
                            Care providers often rely on Excel or disconnected systems to manage revenue, payroll, and finance. This causes payment delays, missed billing, and lack of visibility into margins.
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
                                "Manual invoicing and payroll work",
                                "Unclear financial forecasting",
                                "Poor profitability tracking"
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
                                "Generate invoices and payslips from logged visits in seconds",
                                "View profit/loss forecasts by week, client, or funding type",
                                "Track staff expenses and upload receipts"
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
                                "AI invoice builder",
                                "Automated payslip creation",
                                "Profit forecasting dashboards",
                                "Expense and mileage tracking",
                                "Export-ready financial reports"
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