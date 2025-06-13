"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import {
    FileText,
    Shield,
    CheckCircle2,
    Users,
    Clock,
    AlertCircle,
    BookOpen,
    FileCheck,
    ClipboardList,
    Scale
} from 'lucide-react';

const policies = [
    {
        title: "Care Policies",
        description: "Comprehensive care policies covering all aspects of service delivery and client care.",
        icon: FileText,
        color: "text-blue-500"
    },
    {
        title: "Health & Safety",
        description: "Detailed health and safety protocols ensuring safe care delivery and workplace practices.",
        icon: Shield,
        color: "text-green-500"
    },
    {
        title: "Quality Standards",
        description: "Quality assurance frameworks and standards for maintaining high service quality.",
        icon: CheckCircle2,
        color: "text-purple-500"
    },
    {
        title: "Staff Guidelines",
        description: "Clear guidelines for staff conduct, responsibilities, and professional development.",
        icon: Users,
        color: "text-red-500"
    },
    {
        title: "Emergency Procedures",
        description: "Comprehensive emergency response procedures and protocols.",
        icon: AlertCircle,
        color: "text-yellow-500"
    },
    {
        title: "Training Manuals",
        description: "Detailed training materials and competency frameworks for staff development.",
        icon: BookOpen,
        color: "text-indigo-500"
    },
    {
        title: "Documentation",
        description: "Standardized documentation procedures and templates for care records.",
        icon: FileCheck,
        color: "text-pink-500"
    },
    {
        title: "Compliance",
        description: "Regulatory compliance guidelines and audit preparation procedures.",
        icon: Scale,
        color: "text-emerald-500"
    },
    {
        title: "Scheduling",
        description: "Staff scheduling policies and procedures for optimal service delivery.",
        icon: Clock,
        color: "text-orange-500"
    },
    {
        title: "Assessment Forms",
        description: "Standardized assessment forms and evaluation procedures.",
        icon: ClipboardList,
        color: "text-cyan-500"
    }
];

export default function PoliciesPage() {
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
                        Comprehensive
                        <span className="text-primary"> Policies & Procedures</span>
                    </h1>
                    <p className="text-base md:text-lg text-neutral-500 max-w-2xl mx-auto tracking-tight leading-relaxed font-medium">
                        Access our complete library of policies and procedures designed to ensure compliance and best practices in care delivery.
                    </p>
                </motion.div>
            </div>

            {/* Policies Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {policies.map((policy, index) => (
                        <motion.div
                            key={policy.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <Card className="p-6 h-full">
                                <div className="flex items-start space-x-4">
                                    <div className={`p-2 rounded-lg ${policy.color} bg-opacity-10`}>
                                        <policy.icon className={`w-6 h-6 ${policy.color}`} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-neutral-900">
                                            {policy.title}
                                        </h3>
                                        <p className="mt-2 text-sm md:text-base text-neutral-600 leading-relaxed">
                                            {policy.description}
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