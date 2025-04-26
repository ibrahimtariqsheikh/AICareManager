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
    const { loading, error, isVerificationStep } = useAppSelector((state) => state.auth)
    const [showPassword, setShowPassword] = useState<boolean>(false)
    const [, setVerificationStatus] = useState("")
    const [usernameForVerification, setUsernameForVerification] = useState("")

    const form = useForm<SigninFormValues>({
        resolver: zodResolver(signinSchema),
        defaultValues: {
            username: "",
            password: "",
        },
    })

    useEffect(() => {
        const subscription = form.watch(() => {
            if (error) {
                dispatch(clearAuthError())
            }
        })
        return () => subscription.unsubscribe()
    }, [form, dispatch, error])


    const onSubmit = async (values: SigninFormValues) => {
        try {

            setUsernameForReset(values.username)
            setUsernameForVerification(values.username)
            setVerificationStatus("Signing in...")

            const result = await dispatch(
                login({
                    username: values.username,
                    password: values.password,
                }),
            ).unwrap()



            if (isVerificationStep) {
                setVerificationStatus("Account requires verification. Redirecting...")
                setShowVerification(true)
            } else {
                setVerificationStatus("Login successful! Redirecting to dashboard...")

                router.push("/dashboard")

                window.location.href = "/dashboard"
            }
        } catch (err) {
            console.error("Login failed:", err)
            setVerificationStatus(`Login failed: ${err}`)


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
                                    <Input
                                        placeholder="yourname@aicaremanager.com" className="h-11" {...field} />
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
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={toggleForm}
                                        className="text-sm text-gray-500 hover:text-gray-700 hover:bg-transparent px-0 h-auto"
                                    >
                                        Forgot your password?
                                    </Button>
                                </div>
                                <FormControl>
                                    <div className="relative">
                                        <Input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Enter your password"
                                            className="h-11"
                                            {...field}
                                        />
                                        <button
                                            type="button"
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                                            onClick={(e) => {
                                                e.preventDefault()
                                                setShowPassword(!showPassword)
                                            }}
                                        >
                                            {showPassword ? <Eye className="w-4 h-4 text-gray-500" /> : <EyeOff className="w-4 h-4 text-gray-500" />}
                                        </button>
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button
                        type="submit"
                        className="w-full h-11 bg-gradient-to-r from-blue-700/90 via-blue-600/90 to-blue-500/90 text-white hover:from-blue-800/90 hover:via-blue-700/90 hover:to-blue-600/90 transition-all duration-200 rounded-lg shadow-sm"
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
                </form>
            </Form>
        </div>
    )
}

export default SigninForm

