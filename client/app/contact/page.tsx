"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { motion } from "framer-motion";

const contactFormSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    subject: z.string().min(5, "Subject must be at least 5 characters"),
    message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactFormSchema>;



export default function ContactPage() {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<ContactFormData>({
        resolver: zodResolver(contactFormSchema),
    });

    const onSubmit = async (data: ContactFormData) => {
        try {
            // TODO: Implement form submission logic
            console.log("Form submitted:", data);
            toast.success("Message sent successfully!");
            reset();
        } catch (error) {
            toast.error("Failed to send message. Please try again.");
        }
    };

    return (
        <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    className="text-center mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-4xl font-bold text-neutral-900 mb-4">Book Your AI Care Systems Consultation</h1>
                    <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
                        Schedule a personalized demo to see how our AI-powered platform can transform your healthcare operations.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Contact Form */}
                    <motion.div
                        className="bg-white border border-neutral-200 rounded-lg p-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <div>
                                <label
                                    htmlFor="name"
                                    className="block text-sm font-medium text-neutral-700 mb-1"
                                >
                                    Name
                                </label>
                                <Input
                                    id="name"
                                    {...register("name")}
                                    className="w-full"
                                    placeholder="Your name"
                                />
                                {errors.name && (
                                    <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium text-neutral-700 mb-1"
                                >
                                    Email
                                </label>
                                <Input
                                    id="email"
                                    type="email"
                                    {...register("email")}
                                    className="w-full"
                                    placeholder="your.email@example.com"
                                />
                                {errors.email && (
                                    <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor="subject"
                                    className="block text-sm font-medium text-neutral-700 mb-1"
                                >
                                    Subject
                                </label>
                                <Input
                                    id="subject"
                                    {...register("subject")}
                                    className="w-full"
                                    placeholder="What's this about?"
                                />
                                {errors.subject && (
                                    <p className="mt-1 text-sm text-red-500">{errors.subject.message}</p>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor="message"
                                    className="block text-sm font-medium text-neutral-700 mb-1"
                                >
                                    Message
                                </label>
                                <Textarea
                                    id="message"
                                    {...register("message")}
                                    className="w-full min-h-[150px]"
                                    placeholder="Your message..."
                                />
                                {errors.message && (
                                    <p className="mt-1 text-sm text-red-500">{errors.message.message}</p>
                                )}
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-primary text-white hover:bg-primary/90"
                                disabled={isSubmitting}
                            >
                                <Send className="w-4 h-4 mr-2" />
                                {isSubmitting ? "Sending..." : "Book Demo"}
                            </Button>
                        </form>
                    </motion.div>

                    {/* Contact Information */}
                    <div className="space-y-8">
                        <motion.div
                            className="bg-white border border-neutral-200 rounded-lg p-8"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                        >
                            <h2 className="text-2xl font-semibold text-neutral-900 mb-6 leading-relaxed tracking-tighter">
                                Get in Touch
                            </h2>
                            <div className="space-y-6">
                                <motion.div
                                    className="flex items-start space-x-4 text-sm md:text-base"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.5, delay: 0.4 }}
                                >
                                    <div className="p-2 rounded-lg bg-primary/10 flex items-center justify-center">
                                        <Mail className="w-4 h-4 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-medium text-neutral-900">Email</h3>
                                        <p className="text-neutral-600">care@weaim.io</p>
                                    </div>
                                </motion.div>

                                <motion.div
                                    className="flex items-start space-x-4"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.5, delay: 0.5 }}
                                >
                                    <div className="p-2 rounded-lg bg-primary/10 flex items-center justify-center">
                                        <Phone className="w-4 h-4 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-medium text-neutral-900">Phone</h3>
                                        <p className="text-neutral-600">+44 7341 362145</p>
                                    </div>
                                </motion.div>

                            </div>
                        </motion.div>

                        <motion.div
                            className="bg-white border border-neutral-200 rounded-lg p-8"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.7 }}
                        >
                            <h2 className="text-2xl font-semibold text-neutral-900 leading-relaxed tracking-tighter mb-6">
                                Business Hours
                            </h2>
                            <div className="space-y-2 text-sm md:text-base">
                                <p className="text-neutral-600">Monday - Friday: 09:00 AM - 05:00 PM</p>
                                <p className="text-neutral-600">Saturday: 09:00 AM - 05:00 PM</p>
                                <p className="text-neutral-600">Sunday: Closed</p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
} 