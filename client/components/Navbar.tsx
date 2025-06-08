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
import { LogIn, LayoutDashboard, ChevronDown } from 'lucide-react';
import { Button } from "./ui/button";
import Image from "next/image";
import { motion } from "framer-motion";

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

export function MyNavbar() {
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

      <div className="min-h-screen w-full overflow-visible">
        <div className="relative">
          <HeroSection
            title="Scale Your Care Business Without Hiring More Staff"
            subtitle="All-in-one AI platform for care, HR, compliance, scheduling, finance, and growth.
Reduce admin time and staffing costs by 70%+ with smart automation."
            image={"/assets/dashboard.png"}
          />
        </div>
      </div>
    </div>
  );
}