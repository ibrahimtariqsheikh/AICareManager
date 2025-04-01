"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { useAppDispatch, useAppSelector } from "../../../state/redux"
import { Alert, AlertDescription } from "../../../components/ui/alert"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../../components/ui/form"
import { clearAuthError, login } from "../../../state/slices/authSlice"
import { Input } from "../../../components/ui/input"
import { Button } from "../../../components/ui/button"
import { Form } from "../../../components/ui/form"
import { signinSchema, type SigninFormValues } from "./schemas"
import VerificationForm from "../signup/[id]/verificationform"

interface SigninFormProps {
    setUsernameForReset: (username: string) => void
    toggleForm: () => void
    showVerification: boolean
    setShowVerification: (show: boolean) => void
}

const SigninForm: React.FC<SigninFormProps> = ({
    setUsernameForReset,
    toggleForm,
    showVerification,
    setShowVerification,
}) => {
    const router = useRouter()
    const dispatch = useAppDispatch()
    const { loading, error, isVerificationStep, user } = useAppSelector((state) => state.auth)
    const [showPassword, setShowPassword] = useState<boolean>(false)
    const [verificationStatus, setVerificationStatus] = useState("")
    const [usernameForVerification, setUsernameForVerification] = useState("")

    const form = useForm<SigninFormValues>({
        resolver: zodResolver(signinSchema),
        defaultValues: {
            username: "",
            password: "",
        },
    })

    // Clear error when form changes
    useEffect(() => {
        const subscription = form.watch(() => {
            if (error) {
                dispatch(clearAuthError())
            }
        })
        return () => subscription.unsubscribe()
    }, [form, dispatch, error])

    const toggleVerificationForm = () => {
        setShowVerification(!showVerification)
    }

    const onSubmit = async (values: SigninFormValues) => {
        try {
            // Store username for verification or reset steps
            setUsernameForReset(values.username)
            setUsernameForVerification(values.username)
            setVerificationStatus("Signing in...")

            const result = await dispatch(
                login({
                    username: values.username,
                    password: values.password,
                }),
            ).unwrap()

            console.log("result", result)

            if (isVerificationStep) {
                setVerificationStatus("Account requires verification. Redirecting...")
                setShowVerification(true)
            } else {
                setVerificationStatus("Login successful! Redirecting to dashboard...")
                // Navigate to dashboard after successful login
                router.push("/dashboard")
                // Force navigation to dashboard
                window.location.href = "/dashboard"
            }
        } catch (err) {
            console.error("Login failed:", err)
            setVerificationStatus(`Login failed: ${err}`)

            // Check if error indicates verification needed
            if (error && (error.includes("User not confirmed") || error.includes("UserNotConfirmedException"))) {
                setShowVerification(true)
            }
        }
    }

    if (showVerification) {
        return (
            <VerificationForm
                usernameProp={usernameForVerification}
                toggleForm={() => setShowVerification(false)}
            />
        )
    }

    return (
        <div className="glass-form">
            {error && (
                <Alert variant="destructive" className="mb-6">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-sm font-medium">Username</FormLabel>
                                <FormControl>
                                    <Input placeholder="name@example.com" className="h-11 px-3 rounded-md" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <div className="flex items-center justify-between">
                                    <FormLabel className="text-sm font-medium">Password</FormLabel>
                                </div>
                                <FormControl>
                                    <div className="relative">
                                        <Input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Enter your password"
                                            className="h-11 px-3 rounded-md"
                                            {...field}
                                        />
                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
                                            <button
                                                type="button"
                                                className="text-gray-500"
                                                onClick={(e) => {
                                                    e.preventDefault()
                                                    setShowPassword(!showPassword)
                                                }}
                                            >
                                                {showPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button
                        type="submit"
                        className="w-full h-11 bg-black text-white hover:bg-black/90 rounded-md"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                <span>Signing In...</span>
                            </>
                        ) : (
                            "Sign In"
                        )}
                    </Button>

                    <div className="text-center mt-6 space-y-2">
                        <p className="text-sm text-gray-500">
                            Need to verify your account?{" "}
                            <button
                                type="button"
                                onClick={toggleVerificationForm}
                                className="text-gray-700 font-medium hover:underline"
                            >
                                Verify Account
                            </button>
                        </p>

                        <p className="text-sm text-gray-500">
                            Forgot your password?{" "}
                            <button type="button" onClick={toggleForm} className="text-gray-700 font-medium hover:underline">
                                Reset Password
                            </button>
                        </p>
                    </div>
                </form>
            </Form>
        </div>
    )
}

export default SigninForm

