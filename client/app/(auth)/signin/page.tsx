"use client"

import React, { useState } from "react"
import { useAppSelector } from "../../../state/redux"
import ResetPasswordForm from "./resetpasswordform"
import SigninForm from "./signinform"
import { Blocks } from "lucide-react"
import { motion } from "framer-motion"

const SigninPage = () => {
    const { isPasswordReset } = useAppSelector((state) => state.auth)
    const [showResetPassword, setShowResetPassword] = useState(false)
    const [showVerification, setShowVerification] = useState(false)
    const [usernameForReset, setUsernameForReset] = useState("")

    // Reset the password reset form when isPasswordReset changes
    React.useEffect(() => {
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

    return (
        <div className="flex min-h-screen w-full">
            {/* Left side - Dark panel with logo and testimonial */}
            <div className="hidden md:flex w-1/2 bg-black text-white flex-col justify-between p-10">
                <div className="flex items-center gap-2">
                    <Blocks className="h-6 w-6" />
                    <span className="font-medium text-lg">AI Care Manager</span>
                </div>

                <div className="mb-10">
                    <p className="text-xl font-medium mb-2">
                        "AI Care Manager has streamlined our healthcare operations and improved communication between our staff and
                        patients, making our facility more efficient than ever before."
                    </p>
                    <p className="text-sm">Dr. Ibrahim Sheikh</p>
                </div>
            </div>

            {/* Right side - Sign in form with Apple-like glass effect */}
            <div className="w-full md:w-1/2 flex flex-col relative overflow-hidden bg-gradient-to-br from-blue-50 via-teal-50 to-cyan-50">
                {/* Animated blurry blobs background */}
                <div className="absolute inset-0 z-0">
                    <motion.div
                        className="absolute top-[-15%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-200/40 blur-3xl"
                        animate={{
                            scale: [1, 1.1, 1],
                            x: [0, 10, 0],
                            y: [0, -10, 0],
                        }}
                        transition={{
                            duration: 12,
                            repeat: Number.POSITIVE_INFINITY,
                            repeatType: "reverse",
                        }}
                    />
                    <motion.div
                        className="absolute top-[20%] right-[20%] w-[35%] h-[35%] rounded-full bg-teal-200/30 blur-3xl"
                        animate={{
                            scale: [1, 1.15, 1],
                            x: [0, -15, 0],
                            y: [0, 15, 0],
                        }}
                        transition={{
                            duration: 15,
                            repeat: Number.POSITIVE_INFINITY,
                            repeatType: "reverse",
                            delay: 0.5,
                        }}
                    />
                    <motion.div
                        className="absolute bottom-[10%] right-[5%] w-[45%] h-[45%] rounded-full bg-cyan-200/30 blur-3xl"
                        animate={{
                            scale: [1, 1.05, 1],
                            x: [0, 5, 0],
                            y: [0, 10, 0],
                        }}
                        transition={{
                            duration: 14,
                            repeat: Number.POSITIVE_INFINITY,
                            repeatType: "reverse",
                            delay: 1,
                        }}
                    />
                    <motion.div
                        className="absolute bottom-[30%] left-[10%] w-[30%] h-[30%] rounded-full bg-green-200/30 blur-3xl"
                        animate={{
                            scale: [1, 1.1, 1],
                            x: [0, 15, 0],
                            y: [0, -5, 0],
                        }}
                        transition={{
                            duration: 13,
                            repeat: Number.POSITIVE_INFINITY,
                            repeatType: "reverse",
                            delay: 1.5,
                        }}
                    />
                    <motion.div
                        className="absolute top-[60%] left-[20%] w-[25%] h-[25%] rounded-full bg-blue-200/30 blur-3xl"
                        animate={{
                            scale: [1, 1.15, 1],
                            x: [0, -10, 0],
                            y: [0, -15, 0],
                        }}
                        transition={{
                            duration: 16,
                            repeat: Number.POSITIVE_INFINITY,
                            repeatType: "reverse",
                            delay: 2,
                        }}
                    />
                </div>

                <div className="flex-1 flex items-center justify-center px-6 relative z-10">
                    {/* Apple-like glass container with crisp text */}
                    <div className="w-full max-w-md bg-white/60 backdrop-blur-xl p-8 rounded-3xl shadow-sm border border-white/50">
                        <h1 className="text-2xl font-semibold mb-2 text-gray-700">{title}</h1>
                        <p className="text-gray-500 mb-6">{description}</p>

                        {showResetPassword ? (
                            <ResetPasswordForm usernameProp={usernameForReset} toggleForm={toggleResetPasswordForm} />
                        ) : (
                            <SigninForm
                                setUsernameForReset={setUsernameForReset}
                                toggleForm={toggleResetPasswordForm}
                                showVerification={showVerification}
                                setShowVerification={toggleVerificationForm}
                            />
                        )}

                        <p className="text-xs text-center text-gray-500 mt-8">
                            By clicking continue, you agree to our{" "}
                            <a href="#" className="text-gray-700 underline">
                                Terms of Service
                            </a>{" "}
                            and{" "}
                            <a href="#" className="text-gray-700 underline">
                                Privacy Policy
                            </a>
                            .
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SigninPage

