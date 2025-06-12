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
import { LogIn, LayoutDashboard, ChevronDown, Users, Clock, FileText, Pill, DollarSign, BarChart, TrendingUp } from 'lucide-react';
import { Button } from "./ui/button";
import Image from "next/image";
import { motion, AnimatePresence, useInView } from "framer-motion";

import React from 'react';


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
  link: string;
};

// Constants
const CORE_AGENTS: CoreAgent[] = [
  {
    title: "AI Care Manager",
    description: "Run care operations with AI care planning & reporting.",
    link: "/products/ai-care-manager"
  },
  {
    title: "AI Finance Manager",
    description: "Automate payroll, invoicing, and financial insights.",
    link: "/products/ai-finance-manager"
  },
  {
    title: "AI Sales Manager",
    description: "Convert more leads with smart CRM & follow-up.",
    link: "/products/ai-sales-manager"
  },
  {
    title: "AI Marketing Manager",
    description: "Launch ads, track results, and grow online.",
    link: "/products/ai-marketing-manager"
  }
];

const MORE_ITEMS = [
  {
    title: "Policies & Procedures",
    description: "Built-in templates for care, supported living, homes.",
    link: "/policies"
  },
  {
    title: "Support & Training",
    description: "Onboarding, video guides, and expert help anytime.",
    link: "/support"
  }
];

const navItems: NavItem[] = [
  {
    name: "Products",
    link: "/products",
    dropdown: [
      {
        name: "AI Care Manager",
        link: "/products/ai-care-manager"
      },
      {
        name: "AI Finance Manager",
        link: "/products/ai-finance-manager"
      },
      {
        name: "AI Sales Manager",
        link: "/products/ai-sales-manager"
      },
      {
        name: "AI Marketing Manager",
        link: "/products/ai-marketing-manager"
      },
      {
        name: "Policies & Procedures",
        link: "/policies"
      },
      {
        name: "Support & Training",
        link: "/support"
      }
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
  const router = useRouter();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 h-full">
      <div className="p-4 md:p-6">
        <h3 className='text-xs text-neutral-500 font-medium'>Core Agents</h3>
        {CORE_AGENTS.map((agent, index) => (
          <div
            key={index}
            className="flex flex-col mt-3 md:mt-4 gap-1 cursor-pointer hover:bg-neutral-50 p-2 rounded-lg transition-colors"
            onClick={() => router.push(agent.link)}
          >
            <h4 className='text-sm text-neutral-900 font-medium'>{agent.title}</h4>
            <p className='text-xs text-neutral-500'>{agent.description}</p>
          </div>
        ))}
      </div>
      <div className="border-t md:border-t-0 md:border-l border-gray-200 p-4 md:p-6">
        <h3 className='text-xs text-neutral-500 font-medium'>More</h3>
        {MORE_ITEMS.map((item, index) => (
          <div
            key={index}
            className="flex flex-col mt-3 md:mt-4 gap-1 cursor-pointer hover:bg-neutral-50 p-2 rounded-lg transition-colors"
            onClick={() => router.push(item.link)}
          >
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
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
      ref={dropdownRef}
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




export function MyNavbar() {
  const { user } = useAuthenticator((context) => [context.user]);
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);


  return (
    <div className="relative w-full">
      <ResizeableNavbar>

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
            <Image src="/assets/aimlogo.png" alt="logo" width={40} height={40} className="md:w-[50px] md:h-[50px]" loading="lazy" quality={100} />
          </motion.div>


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
    </div>
  );
}
