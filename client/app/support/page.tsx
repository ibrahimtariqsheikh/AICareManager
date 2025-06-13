"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

import {
    Headphones,
    BookOpen,
    Video,
    MessageSquare,
    Users,
    Clock,

    Phone,
    Mail,
    MapPin
} from 'lucide-react';


const supportOptions = [
    {
        title: "24/7 Support",
        description: "Round-the-clock technical support and assistance for all your needs.",
        icon: Headphones,
        color: "text-blue-500"
    },
    {
        title: "Documentation",
        description: "Comprehensive guides and documentation for all features.",
        icon: BookOpen,
        color: "text-green-500"
    },
    {
        title: "Video Tutorials",
        description: "Step-by-step video guides for using all platform features.",
        icon: Video,
        color: "text-purple-500"
    },
    {
        title: "Live Chat",
        description: "Instant support through our live chat system.",
        icon: MessageSquare,
        color: "text-red-500"
    },
    {
        title: "Training Sessions",
        description: "Regular training sessions for staff and management.",
        icon: Users,
        color: "text-yellow-500"
    },
    {
        title: "Response Time",
        description: "Quick response times for all support requests.",
        icon: Clock,
        color: "text-indigo-500"
    }
];

const contactInfo = [
    {
        title: "Email Support",
        description: "support@aimassist.com",
        icon: Mail,
        color: "text-pink-500"
    },
    {
        title: "Phone Support",
        description: "+44 (0) 123 456 7890",
        icon: Phone,
        color: "text-emerald-500"
    },
    {
        title: "Office Location",
        description: "123 Care Street, London, UK",
        icon: MapPin,
        color: "text-orange-500"
    }
];

export default function SupportPage() {
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
                        We're Here to
                        <span className="text-primary"> Help</span>
                    </h1>
                    <p className="text-base md:text-lg text-neutral-500 max-w-2xl mx-auto tracking-tight leading-relaxed font-medium">
                        Get the support you need with our comprehensive help resources and dedicated support team.
                    </p>
                </motion.div>
            </div>

            {/* Support Options Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {supportOptions.map((option, index) => (
                        <motion.div
                            key={option.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <Card className="p-6 h-full">
                                <div className="flex items-start space-x-4">
                                    <div className={`p-2 rounded-lg ${option.color} bg-opacity-10`}>
                                        <option.icon className={`w-6 h-6 ${option.color}`} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-neutral-900">
                                            {option.title}
                                        </h3>
                                        <p className="mt-2 text-sm md:text-base text-neutral-600 leading-relaxed">
                                            {option.description}
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Contact Information */}
            <div className="bg-neutral-50 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-neutral-900 mb-4 tracking-tight leading-tight md:leading-relaxed">
                            Contact Us
                        </h2>
                        <p className="text-base md:text-lg text-neutral-500 max-w-2xl mx-auto tracking-tight leading-relaxed font-medium">
                            Get in touch with our support team through any of these channels.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {contactInfo.map((info, index) => (
                            <motion.div
                                key={info.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <Card className="p-6 text-center">
                                    <div className={`p-3 rounded-full ${info.color} bg-opacity-10 inline-block mb-4`}>
                                        <info.icon className={`w-6 h-6 ${info.color}`} />
                                    </div>
                                    <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                                        {info.title}
                                    </h3>
                                    <p className="text-sm md:text-base text-neutral-600 leading-relaxed">
                                        {info.description}
                                    </p>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
} 