"use client"

import { useState, useEffect } from "react"
import { useAppSelector } from "../../../state/redux"
import { useRouter } from "next/navigation"
import ResetPasswordForm from "./resetpasswordform"
import SigninForm from "./signinform"
import { Blocks, ChevronLeft, Shield, Lock, CheckCircle2 } from "lucide-react"
import Image from "next/image"

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
    let title = "Welcome to AIM"
    let description = "Enter your credentials below to access your account"

    if (showResetPassword) {
        title = "Reset your password"
        description = "Enter your details below to reset your password"
    } else if (showVerification) {
        title = "Verify Your Account"
        description = "We've sent a verification code to your email. Please enter it below."
    }

    return (
        <div className="flex min-h-screen w-full bg-gray-100">
            <div className="w-full flex flex-col justify-center items-center p-6 relative">
                <div className="w-full max-w-md relative z-10">
                    {showResetPassword && (
                        <button
                            className="flex items-center text-muted-foreground hover:text-foreground mb-4 transition-colors"
                            onClick={toggleResetPasswordForm}
                        >
                            <ChevronLeft className="h-4 w-4 mr-1" />
                            Back to sign in
                        </button>
                    )}

                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col items-center">
                            <a
                                href="#"
                                className="flex flex-col items-center gap-2 font-medium cursor-pointer"
                                onClick={(e) => {
                                    e.preventDefault();
                                    router.push("/");
                                }}
                            >
                                <Image src="/assets/aimlogo.png" alt="AIM" width={50} height={50} loading="lazy" quality={100} />
                            </a>

                            {!showResetPassword && !showVerification && (
                                <div className="text-center text-sm text-muted-foreground">
                                    Don&apos;t have an account?{" "}
                                    <a href="/signup" className="underline underline-offset-4 hover:text-primary">
                                        Sign up
                                    </a>
                                </div>
                            )}
                        </div>

                        <div className="space-y-6">
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
                        </div>
                    </div>

                    <div className="text-balance text-center text-xs text-muted-foreground mt-8 [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
                        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
                        and <a href="#">Privacy Policy</a>.
                    </div>




                </div>
            </div>
        </div>
    )
}

export default SigninPage

