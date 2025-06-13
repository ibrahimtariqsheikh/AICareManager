"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import {
    Users,
    Clock,
    FileText,
    Pill,
    DollarSign,
    BarChart,
    TrendingUp,
    Shield,
    Zap,
    Brain,
    LineChart
} from 'lucide-react';

const features = [
    {
        title: "AI Care Planning",
        description: "Automated care plan creation and management with AI-powered insights and recommendations.",
        icon: Brain,
        color: "text-blue-500"
    },
    {
        title: "Smart Scheduling",
        description: "Intelligent staff scheduling that optimizes coverage and reduces overtime costs.",
        icon: Clock,
        color: "text-green-500"
    },
    {
        title: "Document Management",
        description: "Secure, organized, and compliant document storage with automated version control.",
        icon: FileText,
        color: "text-purple-500"
    },
    {
        title: "Medication Tracking",
        description: "Automated medication management with alerts and compliance monitoring.",
        icon: Pill,
        color: "text-red-500"
    },
    {
        title: "Financial Management",
        description: "Comprehensive financial tracking, invoicing, and payroll management.",
        icon: DollarSign,
        color: "text-yellow-500"
    },
    {
        title: "Performance Analytics",
        description: "Real-time analytics and reporting for better decision-making.",
        icon: BarChart,
        color: "text-indigo-500"
    },
    {
        title: "Client Management",
        description: "Complete client lifecycle management from intake to discharge.",
        icon: Users,
        color: "text-pink-500"
    },
    {
        title: "Compliance Monitoring",
        description: "Automated compliance checks and regulatory reporting.",
        icon: Shield,
        color: "text-emerald-500"
    },
    {
        title: "Real-time Updates",
        description: "Instant notifications and updates for critical events and changes.",
        icon: Zap,
        color: "text-orange-500"
    },
    {
        title: "Growth Analytics",
        description: "Track and analyze business growth metrics and trends.",
        icon: TrendingUp,
        color: "text-cyan-500"
    },
    {
        title: "Quality Metrics",
        description: "Monitor and improve service quality with detailed metrics.",
        icon: LineChart,
        color: "text-violet-500"
    }
];

export default function FeaturesPage() {
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
                        Powerful Features for
                        <span className="text-primary"> Modern Care Management</span>
                    </h1>
                    <p className="text-base md:text-lg text-neutral-500 max-w-2xl mx-auto tracking-tight leading-relaxed font-medium">
                        Streamline your care operations with our comprehensive suite of AI-powered tools and features.
                    </p>
                </motion.div>
            </div>

            {/* Features Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <Card className="p-6 h-full hover:shadow-lg transition-shadow duration-300">
                                <div className="flex items-start space-x-4">
                                    <div className={`p-2 rounded-lg ${feature.color} bg-opacity-10`}>
                                        <feature.icon className={`w-6 h-6 ${feature.color}`} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-neutral-900">
                                            {feature.title}
                                        </h3>
                                        <p className="mt-2 text-sm md:text-base text-neutral-600 leading-relaxed">
                                            {feature.description}
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
} 