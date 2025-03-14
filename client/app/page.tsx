"use client"

import { useAuthenticator } from "@aws-amplify/ui-react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { motion } from "framer-motion"
import Navbar from "../components/Navbar"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import {
  ArrowRight,

  Clock,
  Building,
  Heart,
  Hospital,
  Activity,
  Stethoscope,
  MessageSquare,
  FileText,
  Filter,
  Pill,
  Users
} from "lucide-react"
import { Section, staggerChildren } from "../components/homepage/section"

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
}

// Feature data
const features = [
  {
    icon: <MessageSquare className="h-10 w-10 text-primary" />,
    title: "Integrated Communication",
    description:
      "Secure messaging between care workers, office staff, clients and family members with AI-powered chat assistance.",
  },
  {
    icon: <FileText className="h-10 w-10 text-primary" />,
    title: "Customizable Forms",
    description:
      "Create and customize incident reporting forms, assessments, and documentation to match your organization's needs.",
  },
  {
    icon: <Filter className="h-10 w-10 text-primary" />,
    title: "Advanced Reporting",
    description:
      "Comprehensive dashboards with extensive filtering capabilities to track metrics, revenue, and key performance indicators.",
  },
  {
    icon: <Pill className="h-10 w-10 text-primary" />,
    title: "Electronic Medication Records",
    description:
      "Securely manage medication administration with electronic records, reminders, and verification systems.",
  },
  {
    icon: <Clock className="h-10 w-10 text-primary" />,
    title: "Schedule Management",
    description:
      "Weekly overview of all user schedules with intuitive assignment tools and real-time updates for care workers.",
  },
  {
    icon: <Users className="h-10 w-10 text-primary" />,
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
  { name: "Skills for Care", icon: <Stethoscope className="h-5 w-5 mr-2" /> }
]

export default function Home() {
  const router = useRouter()
  const { user, signOut } = useAuthenticator((context) => [context.signOut, context.user])

  useEffect(() => {
    if (user) {
      console.log("user", user)
      // router.push("/dashboard");
    } else {
      // router.push("/signin");
    }
  }, [user, router])

  // Component for CTA button based on authentication status
  const CallToAction = () => {
    if (user?.username) {
      return (
        <motion.div className="flex flex-col items-center gap-4" variants={fadeIn}>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <Button
              size="lg"
              onClick={() => router.push("/dashboard")}
              className="group relative"
            >
              <span>Go to Dashboard</span>
              <motion.span
                className="ml-2 inline-block"
                initial={{ x: 0 }}
                animate={{ x: 0 }}
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <ArrowRight className="h-4 w-4" />
              </motion.span>
            </Button>
          </motion.div>
        </motion.div>
      )
    }

    return (
      <motion.div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto" variants={fadeIn}>
        <div className="flex-1">
          <Input type="email" placeholder="Enter your email" className="h-12" />
        </div>
        <Button size="lg" className="px-8">
          Book a Demo
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </motion.div>
    )
  }

  // Feature card component
  const FeatureCard = ({ feature, index }: { feature: any; index: number }) => (
    <motion.div
      key={index}
      className="bg-card rounded-xl p-6 border border-border/50 hover:border-primary/50 transition-all hover:shadow-md dark:bg-card/80 dark:hover:shadow-lg dark:hover:shadow-primary/5"
      variants={fadeIn}
    >
      <div className="mb-4">{feature.icon}</div>
      <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
      <p className="text-muted-foreground">{feature.description}</p>
    </motion.div>
  )

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-background to-background/80 dark:from-background dark:to-background/90">
      <Navbar />

      {/* Hero Section */}
      <motion.section
        className="container px-4 pt-20 pb-16 md:pt-32 md:pb-24 mt-20"
        initial="hidden"
        animate="visible"
        variants={staggerChildren}
      >
        <motion.div className="max-w-4xl mx-auto text-center space-y-6" variants={fadeIn}>
          <motion.h1
            className="text-4xl md:text-6xl p-1 font-bold tracking-tight px-2"
            variants={fadeIn}
          >
            Transform Your Healthcare with Our <span className="text-orange-500 dark:text-orange-400">AI-Powered Platform</span>
          </motion.h1>

          <motion.p className="text-md md:text-lg text-muted-foreground max-w-2xl mx-auto" variants={fadeIn}>
            Streamline your care operations with our all-in-one platform featuring customizable forms,
            secure communication, medication management, and comprehensive reporting.
          </motion.p>

          <CallToAction />
        </motion.div>
      </motion.section>

      {/* Trusted By Section */}
      <Section className="py-12 border-t border-border/30 dark:border-border/20">
        <motion.div variants={fadeIn}>
          <h2 className="text-center text-sm font-medium text-muted-foreground mb-8">
            TRUSTED BY LEADING CARE ORGANIZATIONS
          </h2>
        </motion.div>

        <motion.div className="flex flex-wrap justify-center items-center gap-8 md:gap-16" variants={staggerChildren}>
          {trustedOrganizations.map((org) => (
            <motion.div
              key={org.name}
              className="text-xl font-semibold text-muted-foreground/60 hover:text-primary transition-colors flex items-center dark:text-muted-foreground/50 dark:hover:text-primary/90"
              variants={fadeIn}
            >
              {org.icon}
              {org.name}
            </motion.div>
          ))}
        </motion.div>
      </Section>

      {/* Features Section */}
      <Section>
        <motion.div className="text-center max-w-2xl mx-auto mb-16" variants={fadeIn}>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Comprehensive Care Management Tools</h2>
          <p className="text-muted-foreground">
            Our platform provides everything you need to manage care services efficiently,
            from mobile incident reporting to AI-assisted family communication.
          </p>
        </motion.div>

        <motion.div className="grid md:grid-cols-3 gap-8" variants={staggerChildren}>
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </motion.div>
      </Section>

      {/* CTA Section */}
      <Section>
        <div className="bg-gray-100/70 dark:bg-gray-900/50 rounded-2xl p-8 md:p-12 text-center mx-auto border border-border/10 dark:border-border/20">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to transform your care management?</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join care providers who are using our platform to improve communication, ensure compliance,
            and deliver better care with less administrative burden.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <div className="flex-1">
              <Input type="email" placeholder="Enter your email" className="h-12" />
            </div>
            <Button size="lg" className="px-8">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </Section>

      {/* Footer */}
      <footer className="border-t border-border/30 dark:border-border/20 py-8 mt-8">
        <div className="container px-4">
          <div className="text-center text-sm text-muted-foreground">
            <p>© 2025 AI Care Manager. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
