"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";

import { Button } from "../../../../components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "../../../../components/ui/form";
import { Input } from "../../../../components/ui/input";

import { useAppDispatch, useAppSelector } from "../../../../state/redux";
import { verifyCode, resendVerificationCode } from "../../../../state/slices/authSlice";
import { Alert, AlertDescription } from "../../../../components/ui/alert";

const VerificationForm = ({
    emailProp,
    usernameProp,
    toggleForm
}: {
    emailProp?: string,
    usernameProp?: string,
    toggleForm: () => void
}) => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { loading, error, user } = useAppSelector((state) => state.auth);
    const [email, setEmail] = useState(emailProp || "");
    const [username, setUsername] = useState(usernameProp || "");
    const [verificationStatus, setVerificationStatus] = useState("");
    const [resendLoading, setResendLoading] = useState(false);
    const [showUserInputs, setShowUserInputs] = useState(false);
    const [tempUsername, setTempUsername] = useState("");
    const [instantVerify, setInstantVerify] = useState(false);

    const verificationSchema = z.object({
        code: z.string().min(6, "Verification code must be at least 6 characters"),
    });

    type VerificationFormValues = z.infer<typeof verificationSchema>;

    const form = useForm<VerificationFormValues>({
        resolver: zodResolver(verificationSchema),
        defaultValues: {
            code: "",
        },
    });

    useEffect(() => {
        if (usernameProp) {
            setUsername(usernameProp);
        }
        if (emailProp) {
            setEmail(emailProp);
        }
        else if (user?.email) {
            setEmail(user.email);
        }
        else if (error && (error.includes("User already exists") || error.includes("UsernameExistsException"))) {
            const emailMatch = error.match(/email\s+([^\s]+)/i) || error.match(/username:\s*([^\s,]+)/i);
            if (emailMatch && emailMatch[1]) {
                setEmail(emailMatch[1]);
                setUsername(emailMatch[1]);
            }
        }

        if (!usernameProp && !username) {
            setShowUserInputs(true);
        }
    }, [user, error, emailProp, usernameProp, username]);

    const onSubmit = async (values: { code: string }) => {
        try {
            setVerificationStatus("Submitting verification code...");
            if (username) {
                const result = await dispatch(verifyCode({
                    username: username,
                    code: values.code,
                })).unwrap();


                if (result.isSignUpComplete) {
                    setVerificationStatus("Verification successful! Redirecting...");
                    router.push("/dashboard");
                } else {
                    setVerificationStatus("Verification completed but sign-up not complete.");
                }
            } else {
                setShowUserInputs(true);
                setVerificationStatus("Please enter your username to verify your account.");
            }
        } catch (err) {
            console.error("Verification failed:", err);
            setVerificationStatus(`Verification failed: ${err}`);
        }
    };

    const handleResendCode = async (e: React.MouseEvent) => {
        e.preventDefault();
        if (username) {
            try {
                setResendLoading(true);
                setVerificationStatus("Resending verification code...");
                await dispatch(resendVerificationCode(username)).unwrap();
                setVerificationStatus("Verification code resent successfully!");
            } catch (err) {
                console.error("Failed to resend code:", err);
                setVerificationStatus(`Failed to resend code: ${err}`);
            } finally {
                setResendLoading(false);
            }
        } else {
            setShowUserInputs(true);
            setVerificationStatus("Please enter your username to resend the verification code.");
        }
    };

    const handleUserInputsSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (tempUsername) {
            setUsername(tempUsername);
            setShowUserInputs(false);
            if (instantVerify) {
                const code = form.getValues().code;
                if (code) {
                    dispatch(verifyCode({
                        username: tempUsername,
                        code: code,
                    }));
                } else {
                    setVerificationStatus("Please enter a verification code.");
                }
            }
        }
    };

    const toggleInstantVerify = () => {
        setInstantVerify(!instantVerify);
    };

    return (
        <>
            {error && (
                <Alert variant="destructive" className="mb-6">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <div className="text-center mb-6">

                {email && (
                    <p className="text-sm font-medium mt-1">Email: {email}</p>
                )}
                {username && (
                    <p className="text-sm font-medium mt-1">Username: {username}</p>
                )}
                {verificationStatus && (
                    <p className="text-sm text-blue-500 mt-2">{verificationStatus}</p>
                )}
            </div>

            {showUserInputs && (
                <form onSubmit={handleUserInputsSubmit} className="space-y-4 mb-6">
                    <div>
                        <label className="block text-sm font-medium">Username</label>
                        <Input
                            type="text"
                            placeholder="Enter your username"
                            value={tempUsername}
                            onChange={(e) => setTempUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="flex items-center space-x-2 mb-4">
                        <input
                            type="checkbox"
                            id="instantVerify"
                            checked={instantVerify}
                            onChange={toggleInstantVerify}
                            className="rounded"
                        />
                        <label htmlFor="instantVerify" className="text-sm">
                            Verify code instantly after submitting
                        </label>
                    </div>
                    <Button type="submit" className="w-full">Submit</Button>
                </form>
            )}

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="code"
                        render={({ field }) => (
                            <FormItem>
                                <div className="block text-sm font-medium">Verification Code</div>
                                <FormControl>
                                    <Input placeholder="Enter verification code" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                <span>Verifying...</span>
                            </>
                        ) : "Verify Account"}
                    </Button>

                    <div className="text-center mt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleResendCode}
                            className="w-full"
                            disabled={resendLoading}
                        >
                            {resendLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                    <span>Resending...</span>
                                </>
                            ) : "Resend Verification Code"}
                        </Button>

                        <p className="text-sm text-muted-foreground mt-4">
                            Need to create an account?{" "}
                            <button
                                type="button"
                                onClick={toggleForm}
                                className="text-primary hover:underline"
                            >
                                Sign Up
                            </button>
                        </p>
                    </div>
                </form>
            </Form>
        </>
    );
};

export default VerificationForm;