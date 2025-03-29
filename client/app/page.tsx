"use client"

import { useAuthenticator } from "@aws-amplify/ui-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useTheme } from "next-themes"
import Navbar from "../components/Navbar"
import {
  MessageSquare,
  FileText,
  Filter,
  Pill,
  Clock,
  Users,
  Hospital,
  Heart,
  Building,
  Activity,
  Stethoscope,
} from "lucide-react"
import { Section, staggerChildren } from "../components/homepage/section"
import { FeatureGrid } from "../components/homepage/feature-grid"
import { TestimonialCarousel } from "../components/homepage/testimonial"
import { GradientHeading } from "../components/homepage/gradient-heading"
import { CTAButton } from "../components/homepage/cta-button"
import { HeroSection } from "../components/homepage/hero-section"
import { AnimatedGradientBlob } from "../components/homepage/animated-gradient-blob"
import { BookDemoSection } from "../components/homepage/book-demo-section"
import { Spotlight } from "../components/ui/spotlight-new"
// Feature data
const features = [
  {
    icon: <MessageSquare className="h-10 w-10 text-orange-500" />,
    title: "Integrated Communication",
    description:
      "Secure messaging between care workers, office staff, clients and family members with AI-powered chat assistance.",
  },
  {
    icon: <FileText className="h-10 w-10 text-orange-500" />,
    title: "Customizable Forms",
    description:
      "Create and customize incident reporting forms, assessments, and documentation to match your organization's needs.",
  },
  {
    icon: <Filter className="h-10 w-10 text-orange-500" />,
    title: "Advanced Reporting",
    description:
      "Comprehensive dashboards with extensive filtering capabilities to track metrics, revenue, and key performance indicators.",
  },
  {
    icon: <Pill className="h-10 w-10 text-orange-500" />,
    title: "Electronic Medication Records",
    description:
      "Securely manage medication administration with electronic records, reminders, and verification systems.",
  },
  {
    icon: <Clock className="h-10 w-10 text-orange-500" />,
    title: "Schedule Management",
    description:
      "Weekly overview of all user schedules with intuitive assignment tools and real-time updates for care workers.",
  },
  {
    icon: <Users className="h-10 w-10 text-orange-500" />,
    title: "Role-Based Access",
    description:
      "Customized experiences for administrators, office staff, care workers, clients and family members with appropriate permissions.",
  },
]

// Trusted organizations with logos
const trustedOrganizations = [
  { name: "Care Quality Commission", icon: <Hospital className="h-5 w-5 mr-2" /> },
  { name: "NHS Providers", icon: <Heart className="h-5 w-5 mr-2" /> },
  { name: "Care England", icon: <Building className="h-5 w-5 mr-2" /> },
  { name: "National Care Forum", icon: <Activity className="h-5 w-5 mr-2" /> },
  { name: "Skills for Care", icon: <Stethoscope className="h-5 w-5 mr-2" /> },
]

// Testimonials
const testimonials = [
  {
    quote:
      "This platform has revolutionized how we manage care services. The AI assistance is a game-changer for our staff.",
    author: "Sarah Johnson",
    role: "Care Home Manager",
    rating: 5,
  },
  {
    quote: "The medication management system alone has saved us countless hours and significantly reduced errors.",
    author: "Dr. Michael Chen",
    role: "Healthcare Director",
    rating: 5,
  },
  {
    quote: "Our care workers love the mobile app. It's made reporting and communication so much more efficient.",
    author: "Emma Rodriguez",
    role: "Operations Manager",
    rating: 4,
  },
]

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
}

const scaleUp = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5 },
  },
}

// Update the Home component to respect light/dark mode
export default function Home() {
  const router = useRouter()
  const { user } = useAuthenticator((context) => [context.user])
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (user) {
      console.log("user", user)
      // router.push("/dashboard");
    }
  }, [user, router])

  if (!mounted) return null

  return (
    <div
      className={`min-h-screen w-full overflow-visible ${theme === "dark" ? "bg-gradient-to-b from-stone-950 to-black" : "bg-gradient-to-b from-orange-50/30 to-white"}`}
    >
      <Navbar />

      {/* Hero Section with Spotlight */}
      <div className="relative">
        {theme === "dark" && <Spotlight />}
        <HeroSection
          title="Transform Your Healthcare with Our AI-Powered Platform"
          subtitle="Streamline your care operations with our all-in-one platform featuring customizable forms, secure communication, medication management, and comprehensive reporting."
          image={theme === "dark" ? "/assets/dashboard-preview.png" : "/assets/dashboard-preview-light.png"}
          isAuthenticated={!!user?.username}
          onDashboardClick={() => router.push("/dashboard")}
        />
      </div>



    </div>
  )
}
