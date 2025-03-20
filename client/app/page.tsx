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
      className={`min-h-screen w-full overflow-hidden ${theme === "dark" ? "bg-gradient-to-b from-stone-950 to-black" : "bg-gradient-to-b from-orange-50/30 to-white"}`}
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

      {/* Trusted By Section */}
      <Section
        className={`py-12 border-y ${theme === "dark" ? "border-orange-500/5 bg-black/50" : "border-orange-200/20 bg-white/80"} backdrop-blur-sm`}
      >
        <motion.div variants={fadeIn}>
          <h2 className="text-center text-sm font-medium text-muted-foreground mb-8">
            TRUSTED BY LEADING CARE ORGANIZATIONS
          </h2>
        </motion.div>

        <motion.div className="flex flex-wrap justify-center items-center gap-8 md:gap-16" variants={staggerChildren}>
          {trustedOrganizations.map((org, index) => (
            <motion.div
              key={org.name}
              className={`text-xl font-semibold ${theme === "dark" ? "text-muted-foreground/50 hover:text-orange-400" : "text-muted-foreground/70 hover:text-orange-500"} transition-colors flex items-center`}
              variants={fadeIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              custom={index}
              transition={{ delay: index * 0.1 }}
            >
              {org.icon}
              {org.name}
            </motion.div>
          ))}
        </motion.div>
      </Section>

      {/* Features Section */}
      <Section className="py-24 relative">
        <AnimatedGradientBlob position="bottom-right" size="xl" intensity={theme === "dark" ? "low" : "low"} />

        <motion.div
          className="text-center max-w-2xl mx-auto mb-16"
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.div
            className={`inline-block px-4 py-1 rounded-full ${theme === "dark" ? "bg-orange-500/10" : "bg-orange-100"} backdrop-blur-sm text-orange-500 text-sm font-medium mb-4`}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Powerful Features
          </motion.div>
          <GradientHeading className="text-3xl md:text-4xl font-bold mb-4">
            Comprehensive Care Management Tools
          </GradientHeading>
          <p className="text-muted-foreground">
            Our platform provides everything you need to manage care services efficiently, from mobile incident
            reporting to AI-assisted family communication.
          </p>
        </motion.div>

        <FeatureGrid features={features} />
      </Section>

      {/* Book a Demo Section */}
      <BookDemoSection />

      {/* Testimonials Section */}
      <Section className="py-24 relative">
        <div
          className={`absolute inset-0 bg-gradient-to-b ${theme === "dark" ? "from-transparent to-black/90" : "from-transparent to-white/90"} pointer-events-none`}
        ></div>

        <motion.div
          className="text-center max-w-2xl mx-auto mb-16 relative z-10"
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.div
            className={`inline-block px-4 py-1 rounded-full ${theme === "dark" ? "bg-orange-500/10" : "bg-orange-100"} backdrop-blur-sm text-orange-500 text-sm font-medium mb-4`}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Success Stories
          </motion.div>
          <GradientHeading className="text-3xl md:text-4xl font-bold mb-4">What Our Clients Say</GradientHeading>
          <p className="text-muted-foreground">
            Hear from healthcare professionals who have transformed their operations with our platform.
          </p>
        </motion.div>

        <div className="relative z-10">
          <TestimonialCarousel testimonials={testimonials} />
        </div>
      </Section>

      {/* CTA Section */}
      <Section className="py-24 relative z-10">
        <motion.div
          className={`${theme === "dark" ? "bg-gradient-to-r from-black/70 to-black/70" : "bg-gradient-to-r from-white to-white/90"} backdrop-blur-md rounded-3xl p-8 md:p-12 text-center mx-auto border ${theme === "dark" ? "border-white/10 shadow-xl" : "border-gray-100 shadow-sm"} relative overflow-hidden`}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={scaleUp}
        >
          {/* Decorative elements */}
          <div
            className={`absolute top-0 left-0 w-64 h-64 ${theme === "dark" ? "bg-orange-500/5" : "bg-orange-100/30"} rounded-full blur-3xl`}
          ></div>
          <div
            className={`absolute bottom-0 right-0 w-64 h-64 ${theme === "dark" ? "bg-orange-500/5" : "bg-orange-100/30"} rounded-full blur-3xl`}
          ></div>

          <div className="relative z-10">
            <motion.div
              className={`inline-block px-4 py-1 rounded-full ${theme === "dark" ? "bg-orange-500/10" : "bg-orange-100"} backdrop-blur-sm text-orange-500 text-sm font-medium mb-4`}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Get Started Today
            </motion.div>
            <GradientHeading className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
              Ready to transform your healthcare operations?
            </GradientHeading>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join care providers who are using our platform to improve communication, ensure compliance, and deliver
              better care with less administrative burden.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <CTAButton
                onClick={() => {
                  const demoSection = document.getElementById("book-demo")
                  if (demoSection) {
                    demoSection.scrollIntoView({ behavior: "smooth" })
                  }
                }}
                className="rounded-xl"
              >
                Book Your Demo
              </CTAButton>
            </div>
          </div>
        </motion.div>
      </Section>

      {/* Footer */}
      <footer
        className={`border-t ${theme === "dark" ? "border-white/10 py-12 mt-8 backdrop-blur-sm bg-black/80" : "border-gray-100 py-12 mt-8 backdrop-blur-sm bg-white/80"}`}
      >
        <div className="container px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-muted-foreground hover:text-orange-500 transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="/pricing" className="text-muted-foreground hover:text-orange-500 transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-orange-500 transition-colors">
                    Integrations
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-orange-500 transition-colors">
                    Case Studies
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-muted-foreground hover:text-orange-500 transition-colors">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-orange-500 transition-colors">
                    Guides
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-orange-500 transition-colors">
                    Support
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-orange-500 transition-colors">
                    API
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-muted-foreground hover:text-orange-500 transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-orange-500 transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-orange-500 transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-orange-500 transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-muted-foreground hover:text-orange-500 transition-colors">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-orange-500 transition-colors">
                    Terms
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-orange-500 transition-colors">
                    Security
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-orange-500 transition-colors">
                    Compliance
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div
            className={`border-t ${theme === "dark" ? "border-white/10" : "border-gray-100"} pt-8 flex flex-col md:flex-row justify-between items-center`}
          >
            <div className="text-sm text-muted-foreground">© 2025 AI Care Manager. All rights reserved.</div>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="text-muted-foreground hover:text-orange-500 transition-colors">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a href="#" className="text-muted-foreground hover:text-orange-500 transition-colors">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-muted-foreground hover:text-orange-500 transition-colors">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a href="#" className="text-muted-foreground hover:text-orange-500 transition-colors">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

