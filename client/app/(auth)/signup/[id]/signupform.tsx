"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";

import { Button } from "../../../../components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../../../../components/ui/form";
import { Input } from "../../../../components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../../../components/ui/select";
import { toast } from "sonner";

import { useAppDispatch, useAppSelector } from "../../../../state/redux";
import { signupUser } from "../../../../state/slices/authSlice";
import { withToast } from "../../../../lib/utils";
import { useCreateUserMutation } from "../../../../state/api";
import { Role } from "../../../../types/prismaTypes";

const signupSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
    username: z.string().min(3, "Username must be at least 3 characters"),
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    role: z.string(),
    password: z.string().min(8, "Password must be at least 8 characters"),
});

type SignupFormValues = z.infer<typeof signupSchema>;

const SignupForm = ({
    setEmailForVerification,
    setUsernameForVerification,
    toggleForm,
    invitationData,
    isInvitation
}: {
    setEmailForVerification: (email: string) => void,
    setUsernameForVerification: (username: string) => void,
    toggleForm: () => void,
    invitationData: {
        token: string;
        role: string;
        inviterId: string;
        email: string;
    } | null,
    isInvitation: boolean
}) => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { error, isVerificationStep } = useAppSelector((state) => state.auth);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [createUser] = useCreateUserMutation();

    const form = useForm<SignupFormValues>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            email: invitationData?.email || "",
            username: "",
            firstName: "",
            lastName: "",
            role: invitationData?.role || "CLIENT",
            password: "",
        },
    });

    // Update form values when invitation data changes
    useEffect(() => {
        if (isInvitation && invitationData) {
            form.setValue("email", invitationData.email);
            form.setValue("role", invitationData.role);
        }
    }, [invitationData, isInvitation, form]);

    // Show error toast when error state changes
    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    const onSubmit = async (values: SignupFormValues) => {
        try {
            // Store email for verification step
            setEmailForVerification(values.email);
            setUsernameForVerification(values.username);

            const result = await withToast(
                dispatch(signupUser({
                    email: values.email,
                    password: values.password,
                    firstName: values.firstName,
                    lastName: values.lastName,
                    username: values.username,
                    role: values.role,
                    agencyId: invitationData?.inviterId ?? "" // Changed from inviterId to agencyId
                })).unwrap(),
                {
                    success: "Account created successfully!",
                    error: "Failed to create account. Please try again."
                }
            );

            if (isVerificationStep) {
                // If verification is needed, automatically switch to verification form
                toggleForm();
            } else if (result) {
                //CREATE USER IN DATABASE
                await createUser({
                    email: values.email,
                    firstName: values.firstName,
                    lastName: values.lastName,
                    role: values.role as Role,
                    cognitoId: result.user.cognitoId ?? "",
                    invitedById: invitationData?.inviterId ?? "" // Changed from inviterId to invitedById
                })
                toast.success("Account created successfully!");
                router.push("/dashboard");
            }
        } catch (err) {
            console.error("Signup failed:", err);
            toast.error("Signup failed. Please try again.");
        }
    };

    // This function is not used in the current component, removing it
    // If needed, it should be implemented in the verification component

    return (
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-6">
                        {/* First Name and Last Name in one row */}
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="firstName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>First Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter your first name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="lastName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Last Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter your last name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Email in its own row */}
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter your email" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Role in its own row */}
                        <FormField
                            control={form.control}
                            name="role"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Role</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a role" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="CLIENT">Client</SelectItem>
                                            <SelectItem value="CARE_WORKER">Care Worker</SelectItem>
                                            <SelectItem value="OFFICE_STAFF">Office Staff</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Password in its own row */}
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input
                                                type={showPassword ? "text" : "password"}
                                                placeholder="Enter your password"
                                                {...field}
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? (
                                                    <EyeOff className="h-4 w-4 text-gray-500" />
                                                ) : (
                                                    <Eye className="h-4 w-4 text-gray-500" />
                                                )}
                                            </Button>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <Button type="submit" className="w-full">
                        Sign Up
                    </Button>
                </form>
            </Form>
        </>
    );
};

export default SignupForm;