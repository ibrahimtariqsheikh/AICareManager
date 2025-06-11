"use client";
import { HeroSection } from "./homepage/hero-section";
import {
  Navbar as ResizeableNavbar,
  NavBody,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "./ui/resizeable-navbar";
import { useState, useRef, useEffect } from "react";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { useRouter } from "next/navigation";
import { LogIn, LayoutDashboard, ChevronDown, Check, Users, Clock, Briefcase, MessageSquare, GraduationCap, UserCheck, FileText, Pill, DollarSign, BarChart, TrendingUp } from 'lucide-react';
import { Button } from "./ui/button";
import Image from "next/image";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { AIChatDemo } from "./AIChatDemo";
import { BenefitDemo } from "./BenefitDemo";
import { Footer } from "./Footer";
import { Timeline } from "./Timeline";
import React from 'react';
import Cal, { getCalApi } from "@calcom/embed-react";

// Types
type NavItem = {
  name: string;
  link: string;
  dropdown?: DropdownItem[];
};

type DropdownItem = {
  name: string;
  link: string;
};

type CoreAgent = {
  title: string;
  description: string;
};

// Constants
const CORE_AGENTS: CoreAgent[] = [
  {
    title: "AI Care Manager",
    description: "Run care operations with AI care planning & reporting."
  },
  {
    title: "AI Finance Manager",
    description: "Automate payroll, invoicing, and financial insights."
  },
  {
    title: "AI Sales Manager",
    description: "Convert more leads with smart CRM & follow-up."
  },
  {
    title: "AI Marketing Manager",
    description: "Launch ads, track results, and grow online."
  }
];

const MORE_ITEMS = [
  {
    title: "Policies & Procedures",
    description: "Built-in templates for care, supported living, homes."
  },
  {
    title: "Support & Training",
    description: "Onboarding, video guides, and expert help anytime."
  }
];

const navItems: NavItem[] = [
  {
    name: "Products",
    link: "/products",
    dropdown: []
  },
  {
    name: "Features",
    link: "/features",
  },
  {
    name: "Pricing",
    link: "/pricing",
  },
  {
    name: "Watch Demo",
    link: "/watch-demo",
  },
];

// Components
const DropdownMenu = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 h-full">
      <div className="p-4 md:p-6">
        <h3 className='text-xs text-neutral-500 font-medium'>Core Agents</h3>
        {CORE_AGENTS.map((agent, index) => (
          <div key={index} className="flex flex-col mt-3 md:mt-4 gap-1">
            <h4 className='text-sm text-neutral-900 font-medium'>{agent.title}</h4>
            <p className='text-xs text-neutral-500'>{agent.description}</p>
          </div>
        ))}
      </div>
      <div className="border-t md:border-t-0 md:border-l border-gray-200 p-4 md:p-6">
        <h3 className='text-xs text-neutral-500 font-medium'>More</h3>
        {MORE_ITEMS.map((item, index) => (
          <div key={index} className="flex flex-col mt-3 md:mt-4 gap-1">
            <h4 className='text-sm text-neutral-900 font-medium'>{item.title}</h4>
            <p className='text-xs text-neutral-500'>{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const NavItem = ({ item }: { item: NavItem }) => {
  const hasDropdown = 'dropdown' in item;
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    setIsOpen(false);
  };

  const handleClick = () => {
    if (hasDropdown) {
      setIsOpen(!isOpen);
    } else {
      router.push(item.link);
    }
  };

  return (
    <div
      className="relative group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Button
        onClick={handleClick}
        variant="ghost"
        className="flex items-center gap-2 rounded-lg text-sm md:text-base px-2 md:px-4"
      >
        {item.name}
        {hasDropdown && <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />}
      </Button>

      {hasDropdown && isOpen && (
        <div
          className="absolute left-0 mt-2 w-[300px] md:w-[500px] h-fit shadow-xl bg-white ring-1 ring-black ring-opacity-5 z-50 rounded-lg backdrop-blur-lg"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <DropdownMenu />
        </div>
      )}
    </div>
  );
};

const AuthButton = ({ user, router, onMobileMenuClose }: {
  user: any;
  router: any;
  onMobileMenuClose?: () => void;
}) => {
  if (user) {
    return (
      <Button variant="default" onClick={() => {
        router.push("/dashboard");
        onMobileMenuClose?.();
      }} className="text-sm md:text-base px-3 md:px-4">
        <LayoutDashboard className="w-4 h-4" />
        <span>Dashboard</span>
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2 md:gap-5">
      <button
        onClick={() => {
          router.push("/signin");
          onMobileMenuClose?.();
        }}
        className="flex items-center gap-2 rounded-lg z-10 text-black hover:bg-gray-100 p-2 px-3 md:px-4 text-sm md:text-base"
      >
        <span className="font-medium">Login</span>
      </button>
      <button
        onClick={() => router.push("/demo/book")}
        className="flex items-center gap-2 rounded-lg bg-primary text-white p-2 px-3 md:px-4 text-sm md:text-base"
      >
        <span className="font-medium">Book a demo</span>
      </button>
    </div>
  );
};

const MobileNavigation = ({
  isOpen,
  onClose,
  navItems,
  user,
  router
}: {
  isOpen: boolean;
  onClose: () => void;
  navItems: NavItem[];
  user: any;
  router: any;
}) => {
  return (
    <MobileNavMenu isOpen={isOpen} onClose={onClose}>
      {navItems.map((item, idx) => (
        <a
          key={`mobile-link-${idx}`}
          href={item.link}
          onClick={onClose}
          className="relative text-neutral-600 dark:text-neutral-300 text-lg py-2"
        >
          <span className="block">{item.name}</span>
        </a>
      ))}
      <div className="flex w-full flex-col gap-4 mt-6">
        {user ? (
          <NavbarButton
            onClick={() => {
              router.push("/dashboard");
              onClose();
            }}
            variant="primary"
            className="w-full text-base py-3"
          >
            <LayoutDashboard className="w-4 h-4 mr-2" />
            Dashboard
          </NavbarButton>
        ) : (
          <NavbarButton
            onClick={() => {
              router.push("/signin");
              onClose();
            }}
            variant="primary"
            className="w-full text-base py-3"
          >
            <LogIn className="w-4 h-4 mr-2" />
            Login
          </NavbarButton>
        )}
      </div>
    </MobileNavMenu>
  );
};

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

const AnimatedDropdownSection = () => {
  const [activeFeature, setActiveFeature] = useState<number>(0);
  const [isExpanded, setIsExpanded] = useState<Record<number, boolean>>({});
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, {
    once: false,
    amount: 0.1
  });

  useEffect(() => {
    if (!isInView) return;

    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [isInView]);

  useEffect(() => {
    if (!isInView) return;

    setIsExpanded(prev => ({
      ...prev,
      [activeFeature]: true
    }));

    setIsExpanded(prev => {
      const newExpanded = { ...prev };
      Object.keys(newExpanded).forEach(key => {
        if (parseInt(key) !== activeFeature) {
          newExpanded[parseInt(key)] = false;
        }
      });
      return newExpanded;
    });
  }, [activeFeature, isInView]);

  const toggleFeature = (index: number) => {
    setActiveFeature(index);
    setIsExpanded(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <motion.div
      ref={ref}
      className="mx-auto px-4 sm:px-6 lg:px-10 py-6 md:py-10"
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={containerVariants}
    >
      <div className="text-center mb-12 md:mb-24">
        <motion.h2
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-900 mb-4 tracking-tighter leading-tight md:leading-relaxed"
          variants={itemVariants}
        >
          Our Features
        </motion.h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-6 md:mb-10 mt-6 md:mt-10">
          {/* Left side - Feature list */}
          <motion.div variants={containerVariants} className="order-2 lg:order-1">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const isActive = index === activeFeature;
              const isExpandedState = isExpanded[index] || false;

              return (
                <motion.div
                  key={feature.id}
                  variants={itemVariants}
                  className={`transition-all rounded-xl duration-500 ease-in-out cursor-pointer mb-2 md:mb-0 ${isActive ? 'bg-blue-50' : 'bg-white hover:bg-gray-50'}`}
                  onClick={() => toggleFeature(index)}
                >
                  {/* Progress bar */}
                  {isActive && isInView && (
                    <div className="w-full h-1 overflow-hidden rounded-full mb-2 md:mb-4">
                      <motion.div
                        className="h-full w-full bg-blue-600 rounded-full"
                        initial={{ x: '-100%' }}
                        animate={{ x: '0%' }}
                        transition={{
                          duration: 6,
                          ease: "linear"
                        }}
                      />
                    </div>
                  )}

                  {/* Feature header */}
                  <div className="flex items-center justify-between p-3 md:p-4">
                    <div className="flex items-center gap-2 md:gap-3">
                      <motion.div
                        className={`w-6 h-6 md:w-8 md:h-8 rounded-lg flex items-center justify-center ${isActive ? 'bg-blue-100' : 'bg-gray-100'}`}
                        animate={isInView ? {
                          scale: isActive ? 1.1 : 1,
                          backgroundColor: isActive ? 'rgb(219 234 254)' : 'rgb(243 244 246)'
                        } : {
                          scale: 1,
                          backgroundColor: 'rgb(243 244 246)'
                        }}
                        transition={{ duration: 0.2 }}
                      >
                        <Icon className={`w-3 h-3 md:w-4 md:h-4 ${isActive ? 'text-blue-700' : 'text-gray-600'}`} />
                      </motion.div>
                      <motion.span
                        className={`font-medium text-sm md:text-base ${isActive ? 'text-[oklch(48.8%_0.243_264.376)]' : 'text-gray-700'}`}
                        animate={isInView ? {
                          color: isActive ? 'oklch(48.8% 0.243 264.376)' : 'rgb(55 65 81)'
                        } : {
                          color: 'rgb(55 65 81)'
                        }}
                      >
                        {feature.title}
                      </motion.span>
                    </div>
                    <motion.div
                      animate={isInView ? {
                        rotate: isExpandedState ? 180 : 0,
                        color: isActive ? 'rgb(37 99 235)' : 'rgb(156 163 175)'
                      } : {
                        rotate: 0,
                        color: 'rgb(156 163 175)'
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDown className="w-3 h-3 md:w-4 md:h-4" />
                    </motion.div>
                  </div>

                  {/* Feature description */}
                  <AnimatePresence>
                    {isExpandedState && isInView && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-3 md:px-4 pb-3 md:pb-4">
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.05 }}
                            className="text-start text-xs md:text-sm text-neutral-600 leading-relaxed"
                          >
                            {feature.bulletPoints.map((point, index) => (
                              <motion.div
                                key={index}
                                className="flex items-start gap-2 mb-1"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                              >
                                <span className="text-neutral-400">•</span>
                                <span>{point}</span>
                              </motion.div>
                            ))}
                          </motion.div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Right side - Visual placeholder */}
          <motion.div
            className="rounded-xl h-64 md:h-full flex items-center justify-center overflow-hidden order-1 lg:order-2"
            variants={itemVariants}
          >
            <AnimatePresence mode="wait">
              {features[activeFeature] && isInView && (
                <motion.div
                  key={activeFeature}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full relative rounded-xl overflow-hidden"
                >
                  <Image
                    src={features[activeFeature].image}
                    alt={features[activeFeature].title}
                    fill
                    className="object-cover rounded-xl"
                    priority
                    quality={100}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export function MyNavbar({ showHero = true }: { showHero?: boolean }) {
  const { user } = useAuthenticator((context) => [context.user]);
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    (async function () {
      const cal = await getCalApi({ "namespace": "30min" });
      cal("ui", { "theme": "light", "cssVarsPerTheme": { "light": { "cal-brand": "#2463eb" }, "dark": { "cal-brand": "#2463eb" } }, "hideEventTypeDetails": false, "layout": "month_view" });
    })();
  }, []);

  return (
    <div className="relative w-full">
      <ResizeableNavbar>
        {/* Desktop Navigation */}
        <NavBody className="justify-between px-4 md:px-6">
          <motion.div
            className="flex items-center justify-center cursor-pointer"
            onClick={() => router.push("/")}
            whileHover={{
              scale: 1.05,
              transition: {
                duration: 0.1,
                ease: "easeInOut"
              }
            }}
          >
            <Image src="/assets/aimlogo.png" alt="logo" width={40} height={40} className="md:w-[50px] md:h-[50px]" />
          </motion.div>

          {/* Desktop nav items - hidden on mobile */}
          <motion.div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden lg:flex items-center justify-center">
            {navItems.map((item, idx) => (
              <NavItem key={idx} item={item} />
            ))}
          </motion.div>

          <AuthButton user={user} router={router} />
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>

          <MobileNavigation
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
            navItems={navItems}
            user={user}
            router={router}
          />
        </MobileNav>
      </ResizeableNavbar>

      {showHero && (
        <>
          <div className="min-h-screen w-full overflow-visible">
            <div className="relative">
              <HeroSection
                title="Scale Your Care Business Without Hiring More Staff"
                subtitle="All-in-one AI platform for care, HR, compliance, scheduling, finance, and growth. Reduce admin time and staffing costs by 70% with smart automation."
                image={"/assets/dashboard.png"}
              />
            </div>
          </div>

          {/* What do we solve */}
          <div className="mx-auto px-4 sm:px-6 lg:px-10 py-6 md:py-10">
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

          <div className="mx-auto px-4 sm:px-6 lg:px-10">
            <AnimatedDropdownSection />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
            <div className="text-center mb-12 md:mb-24">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-neutral-900 mb-4 tracking-tight leading-tight md:leading-relaxed">
                What Used to Take a Team, Now Takes Just a Few Texts
              </h2>
              <p className="text-base md:text-lg text-neutral-500 max-w-2xl mx-auto tracking-tight leading-relaxed font-medium">
                Discover how AIM Assist transforms care management with intelligent automation and seamless workflows
              </p>
            </div>

            <div className="relative">
              {/* Desktop Timeline - hidden on mobile */}
              <div className="hidden lg:block">
                <Timeline />
              </div>

              {/* Feature sections */}
              <div className="space-y-16 md:space-y-32">
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
        </>
      )}
    </div>
  );
}
