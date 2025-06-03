"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Mail, Lock } from "lucide-react"
import { useForm } from "react-hook-form"
import { useAppDispatch, useAppSelector } from "../../../state/redux"
import { Alert, AlertDescription } from "../../../components/ui/alert"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../../components/ui/form"
import { clearAuthError, login } from "../../../state/slices/authSlice"
import { Button } from "../../../components/ui/button"
import { Form } from "../../../components/ui/form"
import { CustomInput } from "../../../components/ui/custom-input"
import { signinSchema, type SigninFormValues } from "./schemas"
import VerificationForm from "../signup/[id]/verificationform"
import { Input } from "../../../components/ui/input"

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
        return () => {
            if (subscription && typeof subscription.unsubscribe === 'function') {
                subscription.unsubscribe()
            }
        }
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
                router.push("/dashboard/overview")
                window.location.href = "/dashboard/overview"
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
        <div className="space-y-6">
            {error && (
                <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="m@example.com"
                                        className="h-11"
                                        {...field}
                                    />
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
                                    <FormLabel>Password</FormLabel>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={toggleForm}
                                        className="text-sm text-muted-foreground hover:text-foreground hover:bg-transparent px-0 h-auto"
                                    >
                                        Forgot password?
                                    </Button>
                                </div>
                                <FormControl>
                                    <Input
                                        type="password"
                                        placeholder="Enter your password"
                                        className="h-11"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button
                        type="submit"
                        className="w-full h-11"
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

