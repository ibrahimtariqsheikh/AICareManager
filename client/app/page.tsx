"use client"

import { useEffect, useState } from "react"
import { MyNavbar } from "../components/Navbar"
import { AIChatDemo } from "../components/AIChatDemo"
import Image from "next/image"
import { Check } from "lucide-react"

export default function Home() {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    return (
        <div className="min-h-screen bg-white">
            <MyNavbar />

            {/* Features Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center mb-24">
                    <h2 className="text-4xl font-bold text-neutral-900 mb-4 tracking-tight leading-relaxed">What Used to Take a Team, Now Takes Just a Few Texts</h2>
                    <p className="text-lg text-neutral-500 max-w-2xl mx-auto tracking-tight leading-relaxed font-medium">
                        Discover how AIM Assist transforms care management with intelligent automation and seamless workflows
                    </p>
                </div>

                {/* Feature 1: Client Management */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">
                    <div className="space-y-6">
                        <h3 className="text-3xl font-bold text-neutral-900">Intelligent Client Management</h3>
                        <p className="text-lg text-neutral-500">
                            Create and manage client profiles effortlessly with AI-powered assistance. Our system helps you:
                        </p>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                                    <Check className="h-4 w-4 text-blue-600" />
                                </div>
                                <span className="text-neutral-600">Automatically generate comprehensive client profiles</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                                    <Check className="h-4 w-4 text-blue-600" />
                                </div>
                                <span className="text-neutral-600">Create detailed care plans with AI assistance</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                                    <Check className="h-4 w-4 text-blue-600" />
                                </div>
                                <span className="text-neutral-600">Match clients with the most suitable care workers</span>
                            </li>
                        </ul>
                    </div>
                    <div className="relative">
                        <AIChatDemo speed={1.5} />
                    </div>
                </div>

                {/* Feature 2: Staff Management */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">
                    <div className="relative order-2 lg:order-1">
                        <AIChatDemo speed={1.5} />
                    </div>
                    <div className="space-y-6 order-1 lg:order-2">
                        <h3 className="text-3xl font-bold text-neutral-900">Smart Staff Management</h3>
                        <p className="text-lg text-neutral-500">
                            Streamline your staff management with intelligent scheduling and communication tools:
                        </p>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                                    <Check className="h-4 w-4 text-blue-600" />
                                </div>
                                <span className="text-neutral-600">Automated staff scheduling and shift management</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                                    <Check className="h-4 w-4 text-blue-600" />
                                </div>
                                <span className="text-neutral-600">Intelligent holiday request processing</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                                    <Check className="h-4 w-4 text-blue-600" />
                                </div>
                                <span className="text-neutral-600">Seamless communication between staff members</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Feature 3: Financial Management */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <h3 className="text-3xl font-bold text-neutral-900">Comprehensive Financial Management</h3>
                        <p className="text-lg text-neutral-500">
                            Take control of your finances with our integrated financial management tools:
                        </p>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                                    <Check className="h-4 w-4 text-blue-600" />
                                </div>
                                <span className="text-neutral-600">Automated revenue reporting and tracking</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                                    <Check className="h-4 w-4 text-blue-600" />
                                </div>
                                <span className="text-neutral-600">Streamlined payroll processing</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                                    <Check className="h-4 w-4 text-blue-600" />
                                </div>
                                <span className="text-neutral-600">Real-time financial insights and analytics</span>
                            </li>
                        </ul>
                    </div>
                    <div className="relative">
                        <AIChatDemo speed={1.5} />
                    </div>
                </div>
            </div>

            {/* Footer Section */}
            <footer className="bg-gray-50 border-t border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {/* Company Info */}
                        <div className="space-y-4">
                            <Image src="/logos/logo_full.svg" alt="AIM Assist" width={120} height={120} quality={100} />
                            <p className="text-sm text-gray-500">
                                Empowering care management with AI-driven solutions for better patient care and operational efficiency.
                            </p>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900 mb-4">Quick Links</h3>
                            <ul className="space-y-3">
                                <li><a href="#" className="text-sm text-gray-500 hover:text-gray-900">Features</a></li>
                                <li><a href="#" className="text-sm text-gray-500 hover:text-gray-900">Pricing</a></li>
                                <li><a href="#" className="text-sm text-gray-500 hover:text-gray-900">Documentation</a></li>
                                <li><a href="#" className="text-sm text-gray-500 hover:text-gray-900">Support</a></li>
                            </ul>
                        </div>

                        {/* Tools */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900 mb-4">Tools</h3>
                            <ul className="space-y-3">
                                <li><a href="#" className="text-sm text-gray-500 hover:text-gray-900">Client Management</a></li>
                                <li><a href="#" className="text-sm text-gray-500 hover:text-gray-900">Care Planning</a></li>
                                <li><a href="#" className="text-sm text-gray-500 hover:text-gray-900">Staff Scheduling</a></li>
                                <li><a href="#" className="text-sm text-gray-500 hover:text-gray-900">Financial Reports</a></li>
                            </ul>
                        </div>

                        {/* Contact */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900 mb-4">Contact</h3>
                            <ul className="space-y-3">
                                <li className="text-sm text-gray-500">Email: support@aimassist.com</li>
                                <li className="text-sm text-gray-500">Phone: +44 (0) 123 456 7890</li>
                                <li className="text-sm text-gray-500">Address: 123 Care Street, London, UK</li>
                            </ul>
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="mt-12 pt-8 border-t border-gray-200">
                        <div className="flex flex-col md:flex-row justify-between items-center">
                            <p className="text-sm text-gray-500">
                                © 2024 AIM Assist. All rights reserved.
                            </p>
                            <div className="flex space-x-6 mt-4 md:mt-0">
                                <a href="#" className="text-gray-400 hover:text-gray-500">
                                    <span className="sr-only">Twitter</span>
                                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                                    </svg>
                                </a>
                                <a href="#" className="text-gray-400 hover:text-gray-500">
                                    <span className="sr-only">LinkedIn</span>
                                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}
