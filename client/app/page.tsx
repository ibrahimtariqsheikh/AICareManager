"use client"

import { BenefitDemo } from "@/components/BenefitDemo"
import { Footer } from "@/components/Footer"
import { HeroSection } from "@/components/homepage/hero-section"
import { MyNavbar } from "@/components/Navbar"
import Image from "next/image"
import { LogIn, LayoutDashboard, ChevronDown, Check, Users, Clock, Briefcase, MessageSquare, GraduationCap, UserCheck, FileText, Pill, DollarSign, BarChart, TrendingUp } from 'lucide-react';
import { AIChatDemo } from "@/components/AIChatDemo"
import { Timeline } from "@/components/Timeline"
import Cal from "@calcom/embed-react"
import { useInView, motion, AnimatePresence } from "framer-motion"
import { useEffect, useRef, useState } from "react"
import React from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useLenis } from "@/hooks/useLenis"

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger)

const features = [
    {
        id: 'ai-scheduling',
        title: 'AI Scheduling & Rostering',
        icon: Clock,
        color: 'bg-blue-50 text-blue-600',
        image: '/assets/features/scheduling.png',
        bulletPoints: [
            'AI-Powered Scheduling',
            'Live GPS Check-In/Out',
            'Pay Rate Management'
        ]
    },
    {
        id: 'care-planning',
        title: 'Care Planning & Documentation',
        icon: FileText,
        color: 'bg-green-50 text-green-600',
        image: '/assets/features/scheduling.png',
        bulletPoints: [
            'Automated Care Planning',
            'Risk Assessments & Client Profiles',
            'Custom Document Management'
        ]
    },
    {
        id: 'medication-management',
        title: 'Medication & Visit Management',
        icon: Pill,
        color: 'bg-purple-50 text-purple-600',
        image: '/assets/features/scheduling.png',
        bulletPoints: [
            'Medication Management (EMAR)',
            'Smart Visit Reporting',
            'Intelligent Alert Resolution'
        ]
    },
    {
        id: 'staff-operations',
        title: 'Staff & Client Operations',
        icon: Users,
        color: 'bg-orange-50 text-orange-600',
        image: '/assets/features/scheduling.png',
        bulletPoints: [
            'Staff & Client Onboarding',
            'Staff HR & Certification Tracking',
            'Internal & Family Messaging'
        ]
    },
    {
        id: 'finance-compliance',
        title: 'Finance & Compliance',
        icon: DollarSign,
        color: 'bg-teal-50 text-teal-600',
        image: '/assets/features/scheduling.png',
        bulletPoints: [
            'Invoicing & Payroll Automation',
            'Expense Tracking',
            'Compliance Alerts & Expiry Tracking'
        ]
    },
    {
        id: 'insights',
        title: 'Insights & Inspection Readiness',
        icon: BarChart,
        color: 'bg-pink-50 text-pink-600',
        image: '/assets/features/scheduling.png',
        bulletPoints: [
            'AI-Generated Dashboards',
            'Built-In Policies & Procedures',
            'Audit & Inspection Readiness Tools'
        ]
    },
    {
        id: 'sales-marketing',
        title: 'Sales & Marketing Automation',
        icon: TrendingUp,
        color: 'bg-indigo-50 text-indigo-600',
        image: '/assets/features/scheduling.png',
        bulletPoints: [
            'AI-powered lead capture & CRM',
            'Automated SMS, email & voice follow-ups',
            'Smart appointment booking workflows',
            'Review generation & reputation management',
            'Campaign dashboard with ROI tracking'
        ]
    }
];

const AnimatedDropdownSection: React.FC = () => {
    console.log('AnimatedDropdownSection rendering');
    const [activeFeature, setActiveFeature] = useState<number>(0);
    const [isExpanded, setIsExpanded] = useState<Record<number, boolean>>({ 0: true });
    const [isAutoRotating, setIsAutoRotating] = useState(true);
    const sectionRef = useRef<HTMLDivElement>(null);
    const featureRefs = useRef<(HTMLDivElement | null)[]>([]);
    const progressBarRefs = useRef<(HTMLDivElement | null)[]>([]);
    const timelineRef = useRef<gsap.core.Timeline | null>(null);
    const autoRotateTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const isInView = useInView(sectionRef, { once: false, amount: 0.3 });

    // Initialize GSAP animations
    useEffect(() => {
        if (!sectionRef.current) return;

        // Animate section entrance when in view
        if (isInView) {
            gsap.from(sectionRef.current, {
                opacity: 0,
                y: 30,
                duration: 0.8,
                ease: "power2.out"
            });
        }

        return () => {
            if (timelineRef.current) {
                timelineRef.current.kill();
            }
        };
    }, [isInView]);

    // Handle auto-rotation with smoother transitions
    useEffect(() => {
        if (!isAutoRotating || !isInView) return;

        const startAutoRotation = () => {
            autoRotateTimeoutRef.current = setTimeout(() => {
                setActiveFeature((prev) => {
                    const next = (prev + 1) % features.length;
                    return next;
                });
            }, 5000);
        };

        startAutoRotation();

        return () => {
            if (autoRotateTimeoutRef.current) {
                clearTimeout(autoRotateTimeoutRef.current);
            }
        };
    }, [activeFeature, isAutoRotating, isInView]);

    // Handle expanded state with smoother transitions
    useEffect(() => {
        if (!isInView) return;

        // Smooth transition for expanding/collapsing
        const transitionDelay = 150;

        setTimeout(() => {
            setIsExpanded(prev => {
                const newExpanded = { ...prev };

                // Collapse all others first
                Object.keys(newExpanded).forEach(key => {
                    if (parseInt(key) !== activeFeature) {
                        newExpanded[parseInt(key)] = false;
                    }
                });

                // Then expand the active one
                newExpanded[activeFeature] = true;

                return newExpanded;
            });
        }, transitionDelay);

        // Smooth progress bar animation
        const activeProgressBar = progressBarRefs.current[activeFeature];
        if (activeProgressBar) {
            // Kill existing timeline
            if (timelineRef.current) {
                timelineRef.current.kill();
            }

            // Reset all progress bars with smooth fade
            progressBarRefs.current.forEach((ref, idx) => {
                if (ref) {
                    gsap.to(ref, {
                        width: "0%",
                        opacity: idx === activeFeature ? 1 : 0.3,
                        duration: 0.3,
                        ease: "power2.out"
                    });
                }
            });

            // Animate the active progress bar
            const tl = gsap.timeline({
                delay: 0.3,
                ease: "none"
            });

            tl.to(activeProgressBar, {
                width: "100%",
                duration: 4.7,
                ease: "none",
                onComplete: () => {
                    // Smooth reset with fade
                    gsap.to(activeProgressBar, {
                        opacity: 0.3,
                        duration: 0.2,
                        ease: "power2.out",
                        onComplete: () => {
                            gsap.set(activeProgressBar, { width: "0%" });
                            gsap.to(activeProgressBar, {
                                opacity: 1,
                                duration: 0.2,
                                ease: "power2.out"
                            });
                        }
                    });
                }
            });

            timelineRef.current = tl;
        }
    }, [activeFeature, isInView]);

    const toggleFeature = (index: number) => {
        // Pause auto-rotation when user interacts
        setIsAutoRotating(false);

        // Clear any existing timeout
        if (autoRotateTimeoutRef.current) {
            clearTimeout(autoRotateTimeoutRef.current);
        }

        setActiveFeature(index);

        // Resume auto-rotation after a delay
        setTimeout(() => {
            setIsAutoRotating(true);
        }, 8000);
    };

    return (
        <div
            ref={sectionRef}
            className="mx-auto px-4 sm:px-6 lg:px-10 py-6 md:py-10"
        >
            <div className="text-center mb-12 md:mb-24">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-900 mb-4 tracking-tighter leading-tight md:leading-relaxed"
                >
                    Our Features
                </motion.h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-6 md:mb-10 mt-6 md:mt-10">
                    {/* Left side - Feature list */}
                    <div className="order-1 space-y-2">
                        {features.map((feature, index) => {
                            const Icon = feature.icon;
                            const isActive = index === activeFeature;
                            const isExpandedState = isExpanded[index] || false;

                            return (
                                <React.Fragment key={feature.id}>
                                    <motion.div
                                        ref={(el) => {
                                            featureRefs.current[index] = el;
                                        }}
                                        layout
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{
                                            opacity: 1,
                                            scale: 1,
                                            backgroundColor: isActive ? '#eef2ff' : '#ffffff'
                                        }}
                                        transition={{
                                            duration: 0.4,
                                            ease: "easeOut",
                                            backgroundColor: { duration: 0.3 }
                                        }}
                                        className={`transition-all rounded-xl duration-300 ease-out cursor-pointer border border-transparent hover:border-gray-100 
                                            }`}
                                        onClick={() => toggleFeature(index)}
                                        whileHover={{ scale: 1.01 }}
                                        whileTap={{ scale: 0.99 }}
                                    >
                                        {/* Progress bar */}
                                        <div className={`w-full h-1 overflow-hidden rounded-t-xl transition-all duration-300 ${isActive ? 'bg-gray-100' : 'bg-transparent'
                                            }`}>
                                            <div
                                                ref={(el) => {
                                                    progressBarRefs.current[index] = el;
                                                }}
                                                className="h-full w-0 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                                            />
                                        </div>

                                        {/* Feature header */}
                                        <div className="flex items-center justify-between p-3 md:p-4">
                                            <div className="flex items-center gap-2 md:gap-3">
                                                <motion.div
                                                    animate={{
                                                        backgroundColor: isActive ? '#dbeafe' : '#f3f4f6',
                                                        scale: isActive ? 1.05 : 1
                                                    }}
                                                    transition={{ duration: 0.3, ease: "easeOut" }}
                                                    className="w-6 h-6 md:w-8 md:h-8 rounded-lg flex items-center justify-center"
                                                >
                                                    <Icon className={`w-3 h-3 md:w-4 md:h-4 transition-colors duration-300 ${isActive ? 'text-blue-700' : 'text-gray-600'
                                                        }`} />
                                                </motion.div>
                                                <span
                                                    className={`font-medium text-sm md:text-base transition-colors duration-300 ${isActive ? 'text-blue-900' : 'text-gray-700'
                                                        }`}
                                                >
                                                    {feature.title}
                                                </span>
                                            </div>
                                            <motion.div
                                                animate={{
                                                    rotate: isExpandedState ? 180 : 0,
                                                    color: isActive ? '#2563eb' : '#9ca3af'
                                                }}
                                                transition={{ duration: 0.3, ease: "easeOut" }}
                                            >
                                                <ChevronDown className="w-3 h-3 md:w-4 md:h-4" />
                                            </motion.div>
                                        </div>

                                        {/* Feature description */}
                                        <AnimatePresence>
                                            {isExpandedState && (
                                                <motion.div
                                                    key={`content-${index}`}
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{
                                                        duration: 0.4,
                                                        ease: "easeOut",
                                                        opacity: { duration: 0.3, delay: isExpandedState ? 0.1 : 0 }
                                                    }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="px-3 md:px-4 pb-3 md:pb-4">
                                                        <div className="text-start text-xs md:text-sm text-neutral-600 leading-relaxed space-y-1">
                                                            {feature.bulletPoints.map((point, pointIndex) => (
                                                                <motion.div
                                                                    key={pointIndex}
                                                                    initial={{ opacity: 0, x: -10 }}
                                                                    animate={{ opacity: 1, x: 0 }}
                                                                    transition={{
                                                                        duration: 0.3,
                                                                        delay: pointIndex * 0.1 + 0.2,
                                                                        ease: "easeOut"
                                                                    }}
                                                                    className="flex items-start gap-2"
                                                                >
                                                                    <span className="text-blue-400 font-medium">•</span>
                                                                    <span>{point}</span>
                                                                </motion.div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>

                                    {/* Mobile placeholder */}
                                    <AnimatePresence>
                                        {isActive && (
                                            <motion.div
                                                key={`mobile-${index}`}
                                                initial={{ opacity: 0, height: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, height: 256, scale: 1 }}
                                                exit={{ opacity: 0, height: 0, scale: 0.95 }}
                                                transition={{ duration: 0.4, ease: "easeOut" }}
                                                className="lg:hidden rounded-xl flex items-center justify-center overflow-hidden mt-4 mb-6 bg-white/50"
                                            />
                                        )}
                                    </AnimatePresence>
                                </React.Fragment>
                            );
                        })}
                    </div>

                    {/* Right side - Visual placeholder (desktop only) */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                        className="flex lg:block rounded-xl h-full  items-center justify-center overflow-hidden order-2 bg-white/50"
                    />
                </div>
            </div>
        </div>
    );
};


export default function Home() {
    useLenis();

    return (
        <>
            <div className="mt-10 fixed top-0 left-0 right-0 z-50">
                <MyNavbar />
            </div>
            <div className="min-h-screen mt-20 w-full max-w-[100vw]">
                <div className="w-full">
                    <div className="relative z-40">
                        <HeroSection
                            title="Scale Your Care Business Without Hiring More Staff"
                            subtitle="All-in-one AI platform for care, HR, compliance, scheduling, finance, and growth. Reduce admin time and staffing costs by 70% with smart automation."
                            image={"/assets/dashboard.png"}
                        />
                    </div>
                </div>

                {/* What do we solve */}
                <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-6 md:py-10">
                    <div className="text-center mb-12 md:mb-24">
                        <h2 className="flex flex-row items-center justify-center text-2xl md:text-4xl lg:text-5xl font-bold text-neutral-900 mb-4 tracking-tighter leading-tight md:leading-relaxed">
                            <span className="whitespace-nowrap">What does</span>
                            <div className="flex items-center justify-center mx-2">
                                <Image src="/assets/aimlogo.png" alt="AIM Logo" width={40} height={40} className="md:w-[85px] md:h-[85px] inline-block align-middle mt-1" quality={100} />
                            </div>
                            <span className="whitespace-nowrap">solve?</span>
                        </h2>

                        {/* Benefits Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 md:mt-10">
                            <BenefitDemo benefit="client" speed={1.5} />
                            <BenefitDemo benefit="staff" speed={1.5} />
                            <BenefitDemo benefit="admin" speed={1.5} />
                            <BenefitDemo benefit="subscription" speed={1.5} />
                        </div>
                    </div>
                </div>

                <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
                    <AnimatedDropdownSection />
                </div>

                <div className="lg:hidden w-full  p-4 mb-4">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center text-black capitalize tracking-tighter leading-relaxed">Your entire Agency - in 8 steps</h2>
                </div>

                {/* Mobile Timeline Steps */}
                <div className="lg:hidden w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="space-y-12">
                        {[
                            {
                                title: "Automatic Staff & Client Onboarding",
                                description: "Just tell AIM Assist who to onboard — it instantly sends invites, collects info, and confirms when done.",
                                feature: "onboarding" as const
                            },
                            {
                                title: "AI-Powered Care Plan Drafting",
                                description: "Send consultation notes — get a detailed, compliant care plan ready for approval and signature.",
                                feature: "care-planning" as const
                            },
                            {
                                title: "Medication Setup with AI",
                                description: "Tell AIM Assist the meds and dosages — it auto-updates EMAR and flags anything missing.",
                                feature: "medication" as const
                            },
                            {
                                title: "Smart Scheduling by Text",
                                description: "Just type the schedule request — AIM creates the full rota with optimal care matches.",
                                feature: "scheduling" as const
                            },
                            {
                                title: "Instant Invoices & Payroll",
                                description: "Once visits are logged, ask AIM for invoices or payslips — it builds and sends them automatically.",
                                feature: "invoicing" as const
                            },
                            {
                                title: "Visit Reporting with AI Support",
                                description: "Care workers check in, write quick notes — AIM rephrases and formats perfect logs instantly.",
                                feature: "visit-reporting" as const
                            },
                            {
                                title: "Custom AI Dashboards",
                                description: "Ask AIM to generate any dashboard — track alerts, care delivery, finances, or audits in real time.",
                                feature: "compliance" as const
                            }
                        ].map((step, index) => (
                            <div key={index} className="relative">
                                <div className="flex items-start gap-4 mb-6">
                                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                                        <span className="text-lg font-semibold text-blue-600">{index + 1}</span>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-base font-semibold text-neutral-900 mb-1">{step.title}</h3>
                                        <p className="text-sm text-neutral-600 leading-relaxed">{step.description}</p>
                                    </div>
                                </div>
                                <div>
                                    <AIChatDemo speed={1.5} feature={step.feature} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
                    <div className="text-center mb-12 md:mb-24 hidden lg:block">

                        <h2 className="hidden lg:block text-2xl md:text-3xl lg:text-4xl font-bold text-neutral-900 mb-4 tracking-tight leading-tight md:leading-relaxed">
                            What Used to Take a Team, Now Takes Just a Few Texts
                        </h2>
                        <p className="hidden lg:block text-base md:text-lg text-neutral-500 max-w-2xl mx-auto tracking-tight leading-relaxed font-medium">
                            Discover how AIM Assist transforms care management with intelligent automation and seamless workflows
                        </p>
                    </div>

                    <div className="relative">

                        <div className="hidden lg:block">
                            <Timeline />
                        </div>

                        {/* Feature sections */}
                        <div className="space-y-16 md:space-y-32 hidden lg:block">
                            {/* Feature 1: Automatic Staff & Client Onboarding */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-24 items-center text-center lg:text-left">
                                <div className="relative order-2 lg:order-1">
                                    <AIChatDemo speed={1.5} feature="onboarding" />
                                </div>
                                <div className="space-y-4 md:space-y-6 order-1 lg:order-2">
                                    <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-neutral-900">
                                        Automatic Staff & Client Onboarding
                                    </h3>
                                    <p className="text-base md:text-lg text-neutral-500">
                                        Just tell AIM Assist who to onboard — it instantly sends invites, collects info, and confirms when done.
                                    </p>
                                    <ul className="space-y-3 md:space-y-4">
                                        <li className="flex items-start gap-3">
                                            <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                                                <Check className="h-3 w-3 md:h-4 md:w-4 text-blue-600" />
                                            </div>
                                            <span className="text-sm md:text-base text-neutral-600">Natural language pay rate configuration</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                                                <Check className="h-3 w-3 md:h-4 md:w-4 text-blue-600" />
                                            </div>
                                            <span className="text-sm md:text-base text-neutral-600">Instant pay rate preview and confirmation</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                                                <Check className="h-3 w-3 md:h-4 md:w-4 text-blue-600" />
                                            </div>
                                            <span className="text-sm md:text-base text-neutral-600">One-click pay configuration application</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            {/* Feature 3: AI-Powered Care Plan Drafting */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-24 items-center">
                                <div className="space-y-4 md:space-y-6 text-center lg:text-left">
                                    <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-neutral-900">
                                        AI-Powered Care Plan Drafting
                                    </h3>
                                    <p className="text-base md:text-lg text-neutral-500">
                                        Send consultation notes — get a detailed, compliant care plan ready for approval and signature.
                                    </p>
                                    <ul className="space-y-3 md:space-y-4">
                                        <li className="flex items-start gap-3">
                                            <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                                                <Check className="h-3 w-3 md:h-4 md:w-4 text-blue-600" />
                                            </div>
                                            <span className="text-sm md:text-base text-neutral-600">AI-powered care plan generation from notes</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                                                <Check className="h-3 w-3 md:h-4 md:w-4 text-blue-600" />
                                            </div>
                                            <span className="text-sm md:text-base text-neutral-600">Built-in digital signature workflow</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                                                <Check className="h-3 w-3 md:h-4 md:w-4 text-blue-600" />
                                            </div>
                                            <span className="text-sm md:text-base text-neutral-600">Streamlined approval process</span>
                                        </li>
                                    </ul>
                                </div>
                                <div className="relative">
                                    <AIChatDemo speed={1.5} feature="medication" />
                                </div>
                            </div>

                            {/* Feature 4: Medication Setup with AI */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-24 items-center">
                                <div className="relative order-2 lg:order-1">
                                    <AIChatDemo speed={1.5} feature="medication" />
                                </div>
                                <div className="space-y-4 md:space-y-6 order-1 lg:order-2 text-center lg:text-left">
                                    <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-neutral-900">
                                        Medication Setup with AI
                                    </h3>
                                    <p className="text-base md:text-lg text-neutral-500">
                                        Tell AIM Assist the meds and dosages — it auto-updates EMAR and flags anything missing.
                                    </p>
                                    <ul className="space-y-3 md:space-y-4">
                                        <li className="flex items-start gap-3">
                                            <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                                                <Check className="h-3 w-3 md:h-4 md:w-4 text-blue-600" />
                                            </div>
                                            <span className="text-sm md:text-base text-neutral-600">Instant medication overview via chat</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                                                <Check className="h-3 w-3 md:h-4 md:w-4 text-blue-600" />
                                            </div>
                                            <span className="text-sm md:text-base text-neutral-600">Smart alerts for missing medication records</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                                                <Check className="h-3 w-3 md:h-4 md:w-4 text-blue-600" />
                                            </div>
                                            <span className="text-sm md:text-base text-neutral-600">AI-powered medication alert resolution</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            {/* Feature 5: Smart Scheduling by Text */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-24 items-center">
                                <div className="space-y-4 md:space-y-6 text-center lg:text-left">
                                    <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-neutral-900">
                                        Smart Scheduling by Text
                                    </h3>
                                    <p className="text-base md:text-lg text-neutral-500">
                                        Just type the schedule request — AIM creates the full rota with optimal care matches.
                                    </p>
                                    <ul className="space-y-3 md:space-y-4">
                                        <li className="flex items-start gap-3">
                                            <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                                                <Check className="h-3 w-3 md:h-4 md:w-4 text-blue-600" />
                                            </div>
                                            <span className="text-sm md:text-base text-neutral-600">AI-powered staff matching based on skills</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                                                <Check className="h-3 w-3 md:h-4 md:w-4 text-blue-600" />
                                            </div>
                                            <span className="text-sm md:text-base text-neutral-600">Automatic conflict resolution and coverage</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                                                <Check className="h-3 w-3 md:h-4 md:w-4 text-blue-600" />
                                            </div>
                                            <span className="text-sm md:text-base text-neutral-600">Instant schedule notifications to staff</span>
                                        </li>
                                    </ul>
                                </div>
                                <div className="relative">
                                    <AIChatDemo speed={1.5} feature="scheduling" />
                                </div>
                            </div>

                            {/* Feature 6: Instant Invoices & Payroll */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-24 items-center">
                                <div className="relative order-2 lg:order-1">
                                    <AIChatDemo speed={1.5} feature="invoicing" />
                                </div>
                                <div className="space-y-4 md:space-y-6 order-1 lg:order-2 text-center lg:text-left">
                                    <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-neutral-900">
                                        Instant Invoices & Payroll
                                    </h3>
                                    <p className="text-base md:text-lg text-neutral-500">
                                        Once visits are logged, ask AIM for invoices or payslips — it builds and sends them automatically.
                                    </p>
                                    <ul className="space-y-3 md:space-y-4">
                                        <li className="flex items-start gap-3">
                                            <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                                                <Check className="h-3 w-3 md:h-4 md:w-4 text-blue-600" />
                                            </div>
                                            <span className="text-sm md:text-base text-neutral-600">Automated invoice generation from visit logs</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                                                <Check className="h-3 w-3 md:h-4 md:w-4 text-blue-600" />
                                            </div>
                                            <span className="text-sm md:text-base text-neutral-600">Real-time payslip generation after visits</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                                                <Check className="h-3 w-3 md:h-4 md:w-4 text-blue-600" />
                                            </div>
                                            <span className="text-sm md:text-base text-neutral-600">Export-ready data for external systems</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            {/* Feature 7: Visit Reporting with AI Support */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-24 items-center">
                                <div className="space-y-4 md:space-y-6 text-center lg:text-left">
                                    <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-neutral-900">
                                        Visit Reporting with AI Support
                                    </h3>
                                    <p className="text-base md:text-lg text-neutral-500">
                                        Care workers check in, write quick notes — AIM rephrases and formats perfect logs instantly.
                                    </p>
                                    <ul className="space-y-3 md:space-y-4">
                                        <li className="flex items-start gap-3">
                                            <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                                                <Check className="h-3 w-3 md:h-4 md:w-4 text-blue-600" />
                                            </div>
                                            <span className="text-sm md:text-base text-neutral-600">AI-enhanced visit note formatting</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                                                <Check className="h-3 w-3 md:h-4 md:w-4 text-blue-600" />
                                            </div>
                                            <span className="text-sm md:text-base text-neutral-600">Professional language and tone adjustment</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                                                <Check className="h-3 w-3 md:h-4 md:w-4 text-blue-600" />
                                            </div>
                                            <span className="text-sm md:text-base text-neutral-600">Compliance and regulatory alignment checks</span>
                                        </li>
                                    </ul>
                                </div>
                                <div className="relative">
                                    <AIChatDemo speed={1.5} feature="visit-reporting" />
                                </div>
                            </div>

                            {/* Feature 8: Custom AI Dashboards */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-24 items-center">
                                <div className="relative order-2 lg:order-1">
                                    <AIChatDemo speed={1.5} feature="compliance" />
                                </div>
                                <div className="space-y-4 md:space-y-6 order-1 lg:order-2 text-center lg:text-left">
                                    <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-neutral-900">
                                        Custom AI Dashboards for Compliance
                                    </h3>
                                    <p className="text-base md:text-lg text-neutral-500">
                                        Ask AIM to generate any dashboard — track alerts, care delivery, finances, or audits in real time.
                                    </p>
                                    <ul className="space-y-3 md:space-y-4">
                                        <li className="flex items-start gap-3">
                                            <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                                                <Check className="h-3 w-3 md:h-4 md:w-4 text-blue-600" />
                                            </div>
                                            <span className="text-sm md:text-base text-neutral-600">Live compliance status tracking</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                                                <Check className="h-3 w-3 md:h-4 md:w-4 text-blue-600" />
                                            </div>
                                            <span className="text-sm md:text-base text-neutral-600">Instant compliance alerts and notifications</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                                                <Check className="h-3 w-3 md:h-4 md:w-4 text-blue-600" />
                                            </div>
                                            <span className="text-sm md:text-base text-neutral-600">Customizable care metrics dashboard</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Book a Demo Section */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 md:mb-32">
                    <div className="text-center">
                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-neutral-900 mb-4 tracking-tight leading-tight md:leading-relaxed">
                            Book a Demo
                        </h2>
                        <p className="text-base md:text-lg text-neutral-500 max-w-2xl mx-auto tracking-tight leading-relaxed font-medium mb-6 md:mb-10">
                            Schedule a 30-minute demo to see how AIM can transform your care business
                        </p>
                    </div>
                    <div className="w-full">
                        <Cal
                            namespace="30min"
                            calLink="ai-care-manager/30min"
                            style={{ width: "100%", height: "100%", overflow: "scroll" }}
                            config={{
                                iframeAttrs: {
                                    style: "box-shadow: none !important;"
                                },
                                layout: "month_view",
                                theme: "light",
                                styles: "box-shadow: none !important;"
                            }}
                        />
                    </div>
                </div>

                <Footer />
            </div >
        </>
    )
}