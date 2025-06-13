"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    PlayCircle,
    Clock,
    CheckCircle2,
    ArrowRight,
    Users,
    BarChart,
    Shield
} from 'lucide-react';
import Link from "next/link";

const benefits = [
    {
        title: "Save 20+ Hours Weekly",
        description: "Automate routine tasks and streamline workflows",
        icon: Clock,
        color: "text-blue-500"
    },
    {
        title: "Improve Care Quality",
        description: "AI-powered insights for better care delivery",
        icon: CheckCircle2,
        color: "text-green-500"
    },
    {
        title: "Scale Your Business",
        description: "Handle more clients without increasing overhead",
        icon: Users,
        color: "text-purple-500"
    },
    {
        title: "Boost Revenue",
        description: "Optimize operations and reduce costs",
        icon: BarChart,
        color: "text-yellow-500"
    },
    {
        title: "Stay Compliant",
        description: "Automated compliance monitoring and reporting",
        icon: Shield,
        color: "text-red-500"
    }
];

export default function WatchDemoPage() {
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center"
                >
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-900 mb-4 tracking-tighter leading-tight md:leading-relaxed">
                        See AI Care Manager
                        <span className="text-primary"> in Action</span>
                    </h1>
                    <p className="text-base md:text-lg text-neutral-500 max-w-2xl mx-auto tracking-tight leading-relaxed font-medium">
                        Watch how our AI-powered platform transforms care management and streamlines operations.
                    </p>
                </motion.div>
            </div>

            {/* Video Section */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="relative aspect-video rounded-xl overflow-hidden shadow-2xl"
                >
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Button size="lg" className="rounded-full">
                            <PlayCircle className="w-8 h-8 mr-2" />
                            Watch Demo
                        </Button>
                    </div>
                    {/* Replace with actual video thumbnail */}
                    <div className="w-full h-full bg-gray-900" />
                </motion.div>
            </div>

            {/* Benefits Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {benefits.map((benefit, index) => (
                        <motion.div
                            key={benefit.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <Card className="p-6 h-full hover:shadow-lg transition-shadow duration-300">
                                <div className="flex items-start space-x-4">
                                    <div className={`p-2 rounded-lg ${benefit.color} bg-opacity-10`}>
                                        <benefit.icon className={`w-6 h-6 ${benefit.color}`} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-neutral-900">
                                            {benefit.title}
                                        </h3>
                                        <p className="mt-2 text-sm md:text-base text-neutral-600 leading-relaxed">
                                            {benefit.description}
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* CTA Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="mt-16 text-center"
                >
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-neutral-900 mb-4 tracking-tight leading-tight md:leading-relaxed">
                        Ready to Transform Your Care Management?
                    </h2>
                    <p className="text-base md:text-lg text-neutral-500 max-w-2xl mx-auto tracking-tight leading-relaxed font-medium">
                        Book a personalized demo to see how AI Care Manager can work for your organization.
                    </p>
                    <div className="mt-8">
                        <Link href="/contact">
                            <Button size="lg" className="text-lg px-8 hover:scale-105 transition-all duration-300">
                                Book a Demo
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
} 