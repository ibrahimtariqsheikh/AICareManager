"use client"

import { useState, useEffect, use } from "react"
import { useAppSelector } from "../../../../state/redux"
import VerificationForm from "./verificationform"
import { decrypt } from "../../../../lib/utils"
import SignupForm from "./signupform"
import { Blocks } from "lucide-react"
import { motion } from "framer-motion"

const SignupPage = ({ params }: { params: Promise<{ id: string }> }) => {
    const [isInvitation, setIsInvitation] = useState(false)
    const [invitationData, setInvitationData] = useState<{
        token: string
        role: string
        inviterId: string
        email: string
    } | null>(null)

    // Unwrap the params Promise using React.use()
    const unwrappedParams = use(params)

    // Process invitation data if it exists
    useEffect(() => {
        if (unwrappedParams.id) {
            try {
                const decodedId = decodeURIComponent(unwrappedParams.id)
                const decryptedData = decrypt(decodedId)
                const parsedData = JSON.parse(decryptedData)

                if (parsedData.token && parsedData.email) {
                    setIsInvitation(true)
                    setInvitationData({
                        token: parsedData.token,
                        role: parsedData.role || "CLIENT",
                        inviterId: parsedData.inviterId || "",
                        email: parsedData.email,
                    })
                }
            } catch (error) {
                console.error("Error processing invitation data:", error)
            }
        }
    }, [unwrappedParams.id])

    const { isVerificationStep, error } = useAppSelector((state) => state.auth)
    const [showVerification, setShowVerification] = useState(false)
    const [emailForVerification, setEmailForVerification] = useState("")
    const [usernameForVerification, setUsernameForVerification] = useState("")

    useEffect(() => {
        // Check if error message indicates user exists but needs verification
        if (error && (error.includes("User already exists") || error.includes("UsernameExistsException"))) {
            setShowVerification(true)
            // Extract email from error message if possible
            const emailMatch = error.match(/email\s+([^\s]+)/i) || error.match(/username:\s*([^\s,]+)/i)
            if (emailMatch && emailMatch[1]) {
                setEmailForVerification(emailMatch[1])
                setUsernameForVerification(emailMatch[1])
            }
        } else {
            setShowVerification(isVerificationStep)
        }
    }, [error, isVerificationStep])

    const toggleVerificationForm = () => {
        setShowVerification(!showVerification)
    }

    // Define titles and descriptions based on current state
    let title = "Sign Up"
    let description = isInvitation
        ? `Complete your registration for ${invitationData?.email}`
        : "Create an account to get started..."

    if (showVerification) {
        title = "Verify Your Account"
        description = "We've sent a verification code to your email. Please enter it below."
    }

    return (
        <div className="flex min-h-screen w-full ">
            {/* Left side - Dark panel with logo and testimonial */}
            <div className="hidden md:flex w-1/2 bg-black text-white flex-col justify-between p-10">
                <div className="flex items-center gap-2">
                    <Blocks className="h-6 w-6" />
                    <span className="font-medium text-lg">AIM</span>
                </div>

                <div className="mb-10">
                    <p className="text-xl font-medium mb-2">
                        &quot;AIM has streamlined our healthcare operations and improved communication between our staff and
                        patients, making our facility more efficient than ever before.&quot;
                    </p>
                    <p className="text-sm">Dr. Ibrahim Sheikh</p>
                </div>
            </div>

            {/* Right side - Sign up form with Apple-like glass effect */}
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
                </div>

                <div className="flex-1 flex items-center justify-center px-6 relative z-10">
                    {/* Apple-like glass container with crisp text */}
                    <div className="w-full max-w-md bg-white/60 backdrop-blur-xl p-8 rounded-3xl shadow-sm border border-white/50">
                        <h1 className="text-2xl font-semibold mb-2 text-gray-700">{title}</h1>
                        <p className="text-gray-500 mb-6">{description}</p>

                        {showVerification ? (
                            <VerificationForm
                                emailProp={emailForVerification}
                                usernameProp={usernameForVerification}
                                toggleForm={toggleVerificationForm}
                            />
                        ) : (
                            <SignupForm
                                setEmailForVerification={setEmailForVerification}
                                setUsernameForVerification={setUsernameForVerification}
                                toggleForm={toggleVerificationForm}
                                invitationData={invitationData}
                                isInvitation={isInvitation}
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

export default SignupPage

