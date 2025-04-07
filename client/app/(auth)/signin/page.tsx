"use client"

import { useState, useEffect } from "react"
import { useAppSelector } from "../../../state/redux"
import { useRouter } from "next/navigation"
import ResetPasswordForm from "./resetpasswordform"
import SigninForm from "./signinform"
import { Blocks, MessageSquare, BarChart3, Users, ChevronLeft, Calendar, Bot } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"

const SigninPage = () => {
    const router = useRouter()
    const { isPasswordReset } = useAppSelector((state) => state.auth)
    const [showResetPassword, setShowResetPassword] = useState(false)
    const [showVerification, setShowVerification] = useState(false)
    const [usernameForReset, setUsernameForReset] = useState("")

    // Reset the password reset form when isPasswordReset changes
    useEffect(() => {
        if (isPasswordReset) {
            setShowResetPassword(true)
        }
    }, [isPasswordReset])

    const toggleResetPasswordForm = () => {
        setShowResetPassword(!showResetPassword)
        setShowVerification(false)
    }

    const toggleVerificationForm = (show: boolean) => {
        setShowVerification(show)
    }

    // Define titles and descriptions based on current state
    let title = "Sign In"
    let description = "Enter your credentials below to access your account"

    if (showResetPassword) {
        title = "Reset your password"
        description = "Enter your details below to reset your password"
    } else if (showVerification) {
        title = "Verify Your Account"
        description = "We've sent a verification code to your email. Please enter it below."
    }

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                when: "beforeChildren",
                staggerChildren: 0.1,
                duration: 0.5,
            },
        },
    }

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: "spring", stiffness: 100 },
        },
    }

    const featureVariants = {
        hidden: { x: -20, opacity: 0 },
        visible: (i: number) => ({
            x: 0,
            opacity: 1,
            transition: {
                delay: i * 0.2,
                type: "spring",
                stiffness: 100,
            },
        }),
    }

    const formContainerVariants = {
        hidden: { scale: 0.95, opacity: 0 },
        visible: {
            scale: 1,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 15,
            },
        },
        exit: {
            scale: 0.95,
            opacity: 0,
            transition: { duration: 0.2 },
        },
    }

    const features = [
        {
            icon: (
                <div className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-full blur-md opacity-70 animate-pulse"></div>
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full blur-sm opacity-70 animate-pulse"></div>
                    <div className="relative z-10 flex items-center justify-center">
                        <Bot className="h-5 w-5 text-white" />
                    </div>
                </div>
            ),
            title: "AI Assistant",
            description: "Smart support for care management",
            index: 0,
        },
        {
            icon: <Users className="h-5 w-5 text-white" />,
            title: "User Roles & Management",
            description: "For staff, care workers, and clients",
            index: 1,
        },
        {
            icon: <Calendar className="h-5 w-5 text-white" />,
            title: "Scheduling",
            description: "Week overview of all user schedules",
            index: 2,
        },
        {
            icon: <MessageSquare className="h-5 w-5 text-white" />,
            title: "EMAR",
            description: "Electronic medication administration records",
            index: 3,
        },
    ]

    return (
        <motion.div
            className="flex min-h-screen w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            {/* Left side - Blue glass panel with logo and text */}
            <motion.div
                className="hidden md:flex w-[65%] relative flex-col justify-between p-10 overflow-hidden bg-gradient-to-br from-[#010b14] via-[#0a2a4e] to-[#0e4377]"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Logo at the top */}
                <motion.div className="relative z-20 flex items-center gap-2" variants={itemVariants}>
                    <motion.div
                        whileHover={{ rotate: 180 }}
                        transition={{ duration: 0.5 }}
                        className="bg-white/10 p-2 rounded-lg backdrop-blur-sm"
                    >
                        <Blocks className="h-6 w-6 text-white" />
                    </motion.div>
                    <span
                        className="font-medium text-lg text-white cursor-pointer hover:text-white/80 transition-colors"
                        onClick={() => router.push("/")}
                    >
                        AI Care Manager
                    </span>
                </motion.div>

                {/* Main text content - moved down with mt-[10%] */}
                <motion.div className="relative z-10 flex flex-col h-full justify-center mt-[10%]" variants={itemVariants}>
                    <div className="mb-4">
                        <h1 className="text-4xl sm:text-5xl leading-snug font-semibold mb-6 tracking-wide">
                            <span className="block bg-gradient-to-r from-gray-300 via-white to-transparent bg-clip-text text-transparent backdrop-filter backdrop-blur-lg p-1">
                                Healthcare management that's
                            </span>
                            <span className="block bg-gradient-to-r from-white via-gray-100 to-transparent bg-clip-text text-transparent backdrop-filter backdrop-blur-lg p-1">
                                efficient and compliant
                            </span>
                        </h1>
                        <div className="absolute -inset-1 bg-gradient-to-r from-black/5 to-transparent blur-xl rounded-lg -z-10"></div>
                    </div>

                    <motion.div className="space-y-6" variants={containerVariants}>
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                className="flex items-start gap-4 group"
                                custom={index}
                                variants={featureVariants}
                                whileHover={{ x: 5 }}
                            >
                                <div className="mt-1 bg-white/10 p-2 rounded-lg backdrop-blur-sm group-hover:bg-white/20 transition-colors">
                                    {feature.icon}
                                </div>
                                <div>
                                    <p className="text-white font-medium text-lg">{feature.title}</p>
                                    <p className="text-white/70">{feature.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.div>

                {/* Subtle background elements */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 via-transparent to-teal-400/10 z-0"></div>
                <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-[#0e4377]/50 to-transparent z-0"></div>
                <div className="absolute top-40 right-0 w-64 h-64 rounded-full bg-blue-400/10 blur-3xl z-0"></div>
                <div className="absolute bottom-40 left-20 w-40 h-40 rounded-full bg-teal-400/10 blur-3xl z-0"></div>
            </motion.div>

            {/* Right side - Sign in form */}
            <div className="w-full md:w-[35%] flex flex-col justify-center items-center p-6 relative">
                <div className="w-full max-w-md relative z-10">
                    {showResetPassword && (
                        <motion.button
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center text-gray-500 hover:text-gray-700 mb-4 transition-colors"
                            onClick={toggleResetPasswordForm}
                        >
                            <ChevronLeft className="h-4 w-4 mr-1" />
                            Back to sign in
                        </motion.button>
                    )}

                    <AnimatePresence mode="wait">
                        {showResetPassword ? (
                            <motion.div
                                key="reset-password"
                                variants={formContainerVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                            >
                                <div className="mb-6">
                                    <h1 className="text-3xl font-bold mb-2 text-gray-900">{title}</h1>
                                    <p className="text-gray-600">{description}</p>
                                </div>
                                <div className="space-y-6">
                                    <ResetPasswordForm usernameProp={usernameForReset} toggleForm={toggleResetPasswordForm} />
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div key="signin" variants={formContainerVariants} initial="hidden" animate="visible" exit="exit">
                                <div className="mb-6">
                                    <h1 className="text-3xl font-bold mb-2 text-gray-900">{title}</h1>
                                    <p className="text-gray-600">{description}</p>
                                </div>
                                <div className="space-y-6">
                                    <SigninForm
                                        setUsernameForReset={setUsernameForReset}
                                        toggleForm={toggleResetPasswordForm}
                                        showVerification={showVerification}
                                        setShowVerification={toggleVerificationForm}
                                    />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <motion.div
                        className="mt-8 flex flex-col gap-4 items-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        <p className="text-sm text-center text-gray-500">
                            By clicking continue, you agree to our{" "}
                            <a href="#" className="text-blue-600 hover:text-blue-800 hover:underline transition-colors font-medium">
                                Terms of Service
                            </a>{" "}
                            and{" "}
                            <a href="#" className="text-blue-600 hover:text-blue-800 hover:underline transition-colors font-medium">
                                Privacy Policy
                            </a>
                            .
                        </p>

                        <div className="flex items-center gap-2 text-xs text-gray-400">
                            <div className="h-px bg-gray-200 w-16"></div>
                            <span>Secure Authentication</span>
                            <div className="h-px bg-gray-200 w-16"></div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    )
}

export default SigninPage

