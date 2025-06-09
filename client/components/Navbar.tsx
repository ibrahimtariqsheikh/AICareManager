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
import { LogIn, LayoutDashboard, ChevronDown, Check } from 'lucide-react';
import { Button } from "./ui/button";
import Image from "next/image";
import { motion } from "framer-motion";
import { AIChatDemo } from "./AIChatDemo";
import { BenefitDemo } from "./BenefitDemo";
import { Footer } from "./Footer";
import { Timeline } from "./Timeline";

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
    dropdown: [

    ]
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
    <div className="grid grid-cols-2 h-full">
      <div className="p-6">
        <h3 className='text-xs text-neutral-500 font-medium'>Core Agents</h3>
        {CORE_AGENTS.map((agent, index) => (
          <div key={index} className="flex flex-col mt-4 gap-1">
            <h4 className='text-sm text-neutral-900 font-medium'>{agent.title}</h4>
            <p className='text-xs text-neutral-500'>{agent.description}</p>
          </div>
        ))}
      </div>
      <div className="border-l border-gray-200 p-6">
        <h3 className='text-xs text-neutral-500 font-medium'>More</h3>
        {MORE_ITEMS.map((item, index) => (
          <div key={index} className="flex flex-col mt-4 gap-1">
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

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    setIsOpen(false);
  };

  return (
    <div
      className="relative group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Button
        onClick={() => hasDropdown && setIsOpen(!isOpen)}
        variant="ghost"
        className="flex items-center gap-2 rounded-lg"
      >
        {item.name}
        {hasDropdown && <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />}
      </Button>

      {hasDropdown && isOpen && (
        <div
          className="absolute left-0 mt-2 w-[500px] h-fit shadow-xl bg-white ring-1 ring-black ring-opacity-5 z-50 rounded-lg backdrop-blur-lg"
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
      <NavbarButton
        variant="primary"
        onClick={() => {
          router.push("/dashboard");
          onMobileMenuClose?.();
        }}
        className="flex items-center gap-2"
      >
        <LayoutDashboard className="w-4 h-4" />
        <span>Dashboard</span>
      </NavbarButton>
    );
  }

  return (
    <div className="flex items-center gap-5">
      <button
        onClick={() => {
          router.push("/signin");
          onMobileMenuClose?.();
        }}
        className="flex items-center gap-2 rounded-lg z-10 text-black hover:bg-gray-100 p-2 px-4"
      >
        <span className="text-sm font-medium">Login</span>
      </button>
      <button
        onClick={() => router.push("/demo/book")}
        className="flex items-center gap-2 rounded-lg bg-primary text-white p-2 px-4"
      >
        <span className="text-sm font-medium">Book a demo</span>
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
          className="relative text-neutral-600 dark:text-neutral-300"
        >
          <span className="block">{item.name}</span>
        </a>
      ))}
      <div className="flex w-full flex-col gap-4">
        {user ? (
          <NavbarButton
            onClick={() => {
              router.push("/dashboard");
              onClose();
            }}
            variant="primary"
            className="w-full"
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
            className="w-full"
          >
            <LogIn className="w-4 h-4 mr-2" />
            Login
          </NavbarButton>
        )}
      </div>
    </MobileNavMenu>
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

  return (
    <div className="relative w-full">
      <ResizeableNavbar>
        {/* Desktop Navigation */}
        <NavBody className="justify-between">
          <Image src="/assets/aimlogo.png" alt="logo" width={50} height={50} />
          <motion.div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center "
            animate={{
              opacity: isScrolled ? 0 : 1,
              display: isScrolled ? "none" : "flex"
            }}
          >
            {navItems.map((item, idx) => (
              <NavItem key={idx} item={item} />
            ))}
          </motion.div>
          <AuthButton
            user={user}
            router={router}
          />
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
                subtitle="All-in-one AI platform for care, HR, compliance, scheduling, finance, and growth.
Reduce admin time and staffing costs by 70% with smart automation."
                image={"/assets/dashboard.png"}
              />
            </div>
          </div>
          {/* What do we solve */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="text-center mb-24">
              <h2 className="flex items-center justify-center text-5xl font-bold text-neutral-900 mb-4 tracking-tighter leading-relaxed">
                What does <div className="flex items-center justify-center"><Image src="/assets/aimlogo.png" alt="AIM Logo" width={85} height={85} className="inline-block align-middle mx-1 mt-1" quality={100} /></div> solve?
              </h2>

              {/* Benefits Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24 mt-20">

                <BenefitDemo benefit="client" speed={1.5} />



                <BenefitDemo benefit="staff" speed={1.5} />




                <BenefitDemo benefit="admin" speed={1.5} />

                <BenefitDemo benefit="subscription" speed={1.5} />

              </div>

            </div>
          </div>


          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center mb-24">
              <h2 className="text-4xl font-bold text-neutral-900 mb-4 tracking-tight leading-relaxed">What Used to Take a Team, Now Takes Just a Few Texts</h2>
              <p className="text-lg text-neutral-500 max-w-2xl mx-auto tracking-tight leading-relaxed font-medium">
                Discover how AIM Assist transforms care management with intelligent automation and seamless workflows
              </p>
            </div>

            <div className="relative">
              <Timeline />

              {/* Feature 1: Automatic Staff & Client Onboarding */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center mb-32">
                <div className="space-y-6">
                  <h3 className="text-3xl font-bold text-neutral-900">⁠Automatic Staff & Client Onboarding
                  </h3>
                  <p className="text-lg text-neutral-500">
                    Instantly sends onboarding invites via AIM Assist, auto-creates staff and client profiles with required info, and tracks and confirms onboarding completion in real time.
                  </p>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                        <Check className="h-4 w-4 text-blue-600" />
                      </div>
                      <span className="text-neutral-600">Instant onboarding invite distribution</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                        <Check className="h-4 w-4 text-blue-600" />
                      </div>
                      <span className="text-neutral-600">Automated profile creation and data collection</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                        <Check className="h-4 w-4 text-blue-600" />
                      </div>
                      <span className="text-neutral-600">Real-time onboarding progress tracking</span>
                    </li>
                  </ul>
                </div>
                <div className="relative">
                  <AIChatDemo speed={1.5} />
                </div>
              </div>

              {/* Feature 2: Set Up Pay Rates Instantly */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center mb-32">
                <div className="relative order-2 lg:order-1">
                  <AIChatDemo speed={1.5} />
                </div>
                <div className="space-y-6 order-1 lg:order-2">
                  <h3 className="text-3xl font-bold text-neutral-900">⁠Set Up Pay Rates Instantly</h3>
                  <p className="text-lg text-neutral-500">
                    Add pay rates for care workers using natural language prompts, instantly preview, confirm, and apply pay configurations.
                  </p>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                        <Check className="h-4 w-4 text-blue-600" />
                      </div>
                      <span className="text-neutral-600">Natural language pay rate configuration</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                        <Check className="h-4 w-4 text-blue-600" />
                      </div>
                      <span className="text-neutral-600">Instant pay rate preview and confirmation</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                        <Check className="h-4 w-4 text-blue-600" />
                      </div>
                      <span className="text-neutral-600">One-click pay configuration application</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Feature 3: AI-Powered Care Plan Drafting */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center mb-32">
                <div className="space-y-6">
                  <h3 className="text-3xl font-bold text-neutral-900">AI-Powered Care Plan Drafting
                  </h3>
                  <p className="text-lg text-neutral-500">
                    Drafts detailed care plans from consultation notes with AI, sends for approval with built-in digital signature workflow.
                  </p>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                        <Check className="h-4 w-4 text-blue-600" />
                      </div>
                      <span className="text-neutral-600">AI-powered care plan generation from notes</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                        <Check className="h-4 w-4 text-blue-600" />
                      </div>
                      <span className="text-neutral-600">Built-in digital signature workflow</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                        <Check className="h-4 w-4 text-blue-600" />
                      </div>
                      <span className="text-neutral-600">Streamlined approval process</span>
                    </li>
                  </ul>
                </div>
                <div className="relative">
                  <AIChatDemo speed={1.5} />
                </div>
              </div>

              {/* Feature 4 : Medication Setup with AI */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center mb-32">
                <div className="relative order-2 lg:order-1">
                  <AIChatDemo speed={1.5} />
                </div>
                <div className="space-y-6 order-1 lg:order-2">
                  <h3 className="text-3xl font-bold text-neutral-900">⁠Medication Setup with AI</h3>
                  <p className="text-lg text-neutral-500">
                    Instantly view active medications via chat with AIM Assist, get alerted to unresolved or missing medication records, and resolve medication-related alerts with smart suggestions.
                  </p>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                        <Check className="h-4 w-4 text-blue-600" />
                      </div>
                      <span className="text-neutral-600">Instant medication overview via chat</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                        <Check className="h-4 w-4 text-blue-600" />
                      </div>
                      <span className="text-neutral-600">Smart alerts for missing medication records</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                        <Check className="h-4 w-4 text-blue-600" />
                      </div>
                      <span className="text-neutral-600">AI-powered medication alert resolution</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Feature 5: Smart Scheduling by Text */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center mb-32">
                <div className="space-y-6">
                  <h3 className="text-3xl font-bold text-neutral-900">⁠Smart Scheduling by Text
                  </h3>
                  <p className="text-lg text-neutral-500">
                    Just type the schedule request — AIM creates the full rota with optimal care matches.
                  </p>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                        <Check className="h-4 w-4 text-blue-600" />
                      </div>
                      <span className="text-neutral-600">AI-powered staff matching based on skills</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                        <Check className="h-4 w-4 text-blue-600" />
                      </div>
                      <span className="text-neutral-600">Automatic conflict resolution and coverage</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                        <Check className="h-4 w-4 text-blue-600" />
                      </div>
                      <span className="text-neutral-600">Instant schedule notifications to staff</span>
                    </li>
                  </ul>
                </div>
                <div className="relative">
                  <AIChatDemo speed={1.5} />
                </div>
              </div>

              {/* Feature 6: Instant Invoices & Payroll */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center mb-32">
                <div className="relative order-2 lg:order-1">
                  <AIChatDemo speed={1.5} />
                </div>
                <div className="space-y-6 order-1 lg:order-2">
                  <h3 className="text-3xl font-bold text-neutral-900">⁠Instant Invoices & Payroll
                  </h3>
                  <p className="text-lg text-neutral-500">
                    AI-generated invoices from completed visit logs, instant payslip creation after check-in/check-out, and export-ready data for manual payroll and accounting systems.
                  </p>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                        <Check className="h-4 w-4 text-blue-600" />
                      </div>
                      <span className="text-neutral-600">Automated invoice generation from visit logs</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                        <Check className="h-4 w-4 text-blue-600" />
                      </div>
                      <span className="text-neutral-600">Real-time payslip generation after visits</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                        <Check className="h-4 w-4 text-blue-600" />
                      </div>
                      <span className="text-neutral-600">Export-ready data for external systems</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Feature 7: Visit Reporting with AI Support */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center mb-32">
                <div className="space-y-6">
                  <h3 className="text-3xl font-bold text-neutral-900">⁠Visit Reporting with AI Support
                  </h3>
                  <p className="text-lg text-neutral-500">
                    Care workers check in, write quick notes — AIM rephrases and formats perfect logs instantly.
                  </p>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                        <Check className="h-4 w-4 text-blue-600" />
                      </div>
                      <span className="text-neutral-600">AI-enhanced visit note formatting</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                        <Check className="h-4 w-4 text-blue-600" />
                      </div>
                      <span className="text-neutral-600">Professional language and tone adjustment</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                        <Check className="h-4 w-4 text-blue-600" />
                      </div>
                      <span className="text-neutral-600">Compliance and regulatory alignment checks</span>
                    </li>
                  </ul>
                </div>
                <div className="relative">
                  <AIChatDemo speed={1.5} />
                </div>
              </div>

              {/* Feature 8: Custom AI Dashboards */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center mb-32">
                <div className="relative order-2 lg:order-1">
                  <AIChatDemo speed={1.5} />
                </div>
                <div className="space-y-6 order-1 lg:order-2">
                  <h3 className="text-3xl font-bold text-neutral-900">Custom AI Dashboards for Compliance
                  </h3>
                  <p className="text-lg text-neutral-500">
                    Real-time compliance monitoring and alerts, customizable care delivery metrics.
                  </p>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                        <Check className="h-4 w-4 text-blue-600" />
                      </div>
                      <span className="text-neutral-600">Live compliance status tracking</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                        <Check className="h-4 w-4 text-blue-600" />
                      </div>
                      <span className="text-neutral-600">Instant compliance alerts and notifications</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                        <Check className="h-4 w-4 text-blue-600" />
                      </div>
                      <span className="text-neutral-600">Customizable care metrics dashboard</span>
                    </li>
                  </ul>
                </div>
              </div>


            </div>

          </div>

          <Footer />
        </>
      )}
    </div>
  );
}