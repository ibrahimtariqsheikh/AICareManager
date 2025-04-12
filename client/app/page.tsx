"use client"

import { useAuthenticator } from "@aws-amplify/ui-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import Navbar from "../components/Navbar"
import { MessageSquare, FileText, Filter, Pill, Clock, Users } from "lucide-react"
import { HeroSection } from "../components/homepage/hero-section"

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
    }
  }, [user, router])

  if (!mounted) return null

  return (
    <div className="min-h-screen w-full overflow-visible ">
      {/* Subtle background container */}
      <div
        className={`fixed inset-0 -z-10 ${theme === "dark"
          ? "bg-gradient-to-b from-stone-950 to-black"
          : "bg-gradient-to-b from-orange-50/70 via-orange-50/30 to-white"
          }`}
      >
        {/* Subtle pattern overlay */}
        <div
          className={`absolute inset-0 opacity-5 ${theme === "dark"
            ? "bg-[url('/assets/subtle-pattern-dark.png')]"
            : "bg-[url('/assets/subtle-pattern-light.png')]"
            }`}
        />

        {/* Soft glow effect */}
        <div
          className={`absolute inset-0 ${theme === "dark"
            ? "bg-gradient-radial from-stone-800/20 to-transparent"
            : "bg-gradient-radial from-orange-200/20 to-transparent"
            }`}
          style={{
            backgroundSize: "100% 100%",
            backgroundPosition: "center center",
          }}
        />
      </div>

      <Navbar />

      {/* Main content */}
      <div className="relative ">
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
