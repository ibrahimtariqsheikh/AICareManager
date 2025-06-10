"use client"
import React from 'react';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';

const formSchema = z.object({
    plan: z.enum(['ai-care-manager', 'full-aim-stack']),
    staffCount: z.string().min(1, 'Please enter number of staff'),
    addons: z.object({
        policies: z.boolean().default(false),
        operational: z.boolean().default(false),
    }),
});

type FormValues = z.infer<typeof formSchema>;

interface Addons {
    policies: boolean;
    operational: boolean;
}

interface FormData {
    plan: 'ai-care-manager' | 'full-aim-stack';
    staffCount: string;
    addons: Addons;
}

export default function PricingPage() {
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            plan: undefined,
            staffCount: '',
            addons: {
                policies: false,
                operational: false,
            },
        },
    });

    const calculateTotal = (values: FormValues) => {
        // Return 0 if no plan selected or no staff count
        if (!values.plan || !values.staffCount) {
            return 0;
        }

        const staffCount = parseInt(values.staffCount) || 0;
        let baseCost = 0;

        if (staffCount >= 1 && staffCount <= 9) {
            // Fixed price of £100 for 1-9 staff members
            baseCost = 100;
        } else if (staffCount >= 10) {
            // Per-staff pricing for 10+ staff members
            if (values.plan === 'ai-care-manager') {
                baseCost = staffCount * 10; // £10 per staff
            } else if (values.plan === 'full-aim-stack') {
                baseCost = staffCount * 15; // £15 per staff
            }
        }

        // Add-ons are added on top
        let totalCost = baseCost;
        if (values.addons.policies) totalCost += 90;
        if (values.addons.operational) totalCost += 50;

        return totalCost;
    };

    // Watch form values for real-time updates
    const formValues = form.watch();
    const total = calculateTotal(formValues);

    const plans = [
        {
            name: 'AI Care Manager',
            description: 'All-in-one care & finance operations platform',
            price: 10,
            period: '/staff/month',
            features: [
                'AIM Assist (built-in AI assistant)',
                'AI care plan drafting & compliance checks',
                'Smart scheduling & rota tools',
                'Payroll & invoice automation',
                'Finance Manager (dashboards & expense tracking)',
                'Visit reporting & alert system',
                'Dedicated account manager'
            ],
            buttonStyle: 'border border-gray-300 text-gray-700 hover:bg-gray-50',
            popular: false
        },
        {
            name: 'Full AIM Stack',
            description: 'Care + Sales + Marketing + Finance automation',
            price: 15,
            period: '/staff/month',
            features: [
                'Everything in AI Care Manager',
                'AI Sales Manager (lead tracking, reminders, follow-ups)',
                'AI Marketing Manager (ads, reviews, nurture content)',
                'Finance Manager (revenue reports, pay breakdowns)',
                'Growth dashboards & campaign tracking',
                'Premium support'
            ],
            buttonStyle: 'bg-primary text-white hover:bg-primary/90',
            popular: true
        },
        {
            name: 'AIM Enterprise',
            description: 'Custom-built for scale and integration',
            price: null,
            period: '',
            features: [
                'Tailored features + API access',
                'Bespoke workflows & automations',
                'Custom dashboards & roles',
                'Full system setup with training',
                'Priority support & success manager',
                'Pricing based on scope'
            ],
            buttonStyle: 'border border-gray-300 text-gray-700 hover:bg-gray-50',
            popular: false
        }
    ];

    return (
        <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-24">
                    <h2 className="text-6xl font-bold text-neutral-900 mb-4 tracking-tight leading-relaxed">
                        Simple, Transparent Pricing
                    </h2>
                    <p className="text-lg text-neutral-500 max-w-2xl mx-auto tracking-tight leading-relaxed font-medium">
                        Choose the perfect plan for your care home. All plans include our core features and regular updates.
                    </p>
                </div>

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
                    {plans.map((plan, index) => (
                        <div
                            key={plan.name}
                            className={`relative bg-white rounded-2xl shadow-sm ring-1 ring-neutral-200 p-6 ${plan.popular
                                ? 'ring-2 ring-primary shadow-md lg:scale-110 bg-gradient-to-b from-primary/5 to-white'
                                : ''
                                } transition-all duration-300 flex flex-col h-full`}
                        >
                            {/* Popular Badge */}
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                    <span className="inline-flex items-center rounded-full bg-primary px-4 py-1 text-xs font-medium text-white">
                                        Most Popular
                                    </span>
                                </div>
                            )}

                            <div className="flex flex-col flex-grow">
                                {/* Plan Header */}
                                <div className="text-center">
                                    <h3 className="text-lg font-semibold text-neutral-900">{plan.name}</h3>
                                    <p className="mt-2 text-sm text-neutral-500">{plan.description}</p>
                                    <div className="mt-4 flex items-baseline justify-center">
                                        {plan.price ? (
                                            <>
                                                <span className="text-4xl font-bold tracking-tight text-neutral-900">£{plan.price}</span>
                                                <span className="ml-1 text-xs font-medium text-neutral-500">+VAT {plan.period}</span>
                                            </>
                                        ) : (
                                            <span className="bg-neutral-100 text-xs font-medium text-neutral-500 border border-neutral-300 rounded-full px-2 py-1">Contact Sales</span>
                                        )}
                                    </div>
                                </div>

                                {/* Features */}
                                <ul className="mt-8 space-y-3">
                                    {plan.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-start">
                                            <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-500/30 flex items-center justify-center">
                                                <svg className="h-3.5 w-3.5 text-primary" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            <span className="ml-3 text-sm text-neutral-500">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* CTA Button */}
                            <button
                                className={`w-full mt-8 py-2.5 px-4 rounded-lg font-medium transition-all duration-200 ${plan.popular
                                    ? 'bg-primary text-white hover:bg-primary/90 shadow-sm hover:shadow-md'
                                    : plan.buttonStyle
                                    }`}
                            >
                                Get Started
                            </button>
                        </div>
                    ))}
                </div>

                {/* Pricing Calculator Section */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
                    <div className="bg-white rounded-2xl ring-1 ring-neutral-200 p-8">
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                                <svg className="h-5 w-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                                </svg>
                            </div>
                            <div className="flex-grow">
                                <h3 className="text-lg font-semibold text-neutral-900">Calculate Your Custom Price</h3>
                                <p className="mt-2 text-sm text-neutral-500 leading-relaxed ">
                                    Wondering what AIM will cost your agency?
                                </p>

                                <Form {...form}>
                                    <form className="mt-6 space-y-6">
                                        {/* Plan Selection */}
                                        <FormField
                                            control={form.control}
                                            name="plan"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Select Your Plan</FormLabel>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <button
                                                            type="button"
                                                            onClick={() => field.onChange('ai-care-manager')}
                                                            className={`p-4 rounded-lg border text-left transition-all duration-200 ${field.value === 'ai-care-manager'
                                                                ? 'border-primary bg-primary/5'
                                                                : 'border-neutral-200 hover:border-primary/50'
                                                                }`}
                                                        >
                                                            <div className="font-medium text-neutral-900">AI Care Manager</div>
                                                            <div className="text-sm text-neutral-500 mt-1">£10 + VAT /staff/month</div>
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => field.onChange('full-aim-stack')}
                                                            className={`p-4 rounded-lg border text-left transition-all duration-200 ${field.value === 'full-aim-stack'
                                                                ? 'border-primary bg-primary/5'
                                                                : 'border-neutral-200 hover:border-primary/50'
                                                                }`}
                                                        >
                                                            <div className="font-medium text-neutral-900">Full AIM Stack</div>
                                                            <div className="text-sm text-neutral-500 mt-1">£15 + VAT /staff/month</div>
                                                        </button>
                                                    </div>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        {/* Staff Count */}
                                        <FormField
                                            control={form.control}
                                            name="staffCount"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Number of Active Staff</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            min="1"
                                                            placeholder="Enter number of staff"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        {/* Add-ons */}
                                        <FormField
                                            control={form.control}
                                            name="addons"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Optional Add-ons</FormLabel>
                                                    <div className="space-y-3">
                                                        <div className="flex items-start gap-3 p-4 rounded-lg border border-neutral-200 hover:border-primary/50 transition-all duration-200">
                                                            <div className="mt-1">
                                                                <Checkbox
                                                                    checked={field.value.policies}
                                                                    onCheckedChange={(checked) => field.onChange({ ...field.value, policies: checked })}
                                                                />
                                                            </div>
                                                            <div className="flex-1">
                                                                <div className="font-medium text-neutral-900">Policies and Procedures</div>
                                                                <div className="text-sm text-neutral-500">170+ regularly updated, CQC / CI / CIW-compliant templates</div>
                                                                <div className="text-sm text-neutral-500 mt-1">£90 + VAT /month</div>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-start gap-3 p-4 rounded-lg border border-neutral-200 hover:border-primary/50 transition-all duration-200">
                                                            <div className="mt-1">
                                                                <Checkbox
                                                                    checked={field.value.operational}
                                                                    onCheckedChange={(checked) => field.onChange({ ...field.value, operational: checked })}
                                                                />
                                                            </div>
                                                            <div className="flex-1">
                                                                <div className="font-medium text-neutral-900">Operational Document Pack</div>
                                                                <div className="text-sm text-neutral-500">Key daily-use forms & templates for efficient care delivery</div>
                                                                <div className="text-sm text-neutral-500 mt-1">£50 + VAT /month</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        {/* Total Price */}
                                        <div className="pt-6 border-t border-neutral-200">
                                            <div className="flex justify-between items-center">
                                                <div className="text-lg font-medium text-neutral-900">Total Monthly Cost</div>
                                                <div className="text-right">
                                                    <div className="text-2xl font-bold text-neutral-900">£{total}</div>
                                                    <div className="text-sm text-neutral-500">+ VAT /month</div>
                                                </div>
                                            </div>
                                            <div className="text-xs text-neutral-500 mt-2 text-right">
                                                * Fixed £100/month for 1-9 staff. Per-staff pricing (£10 or £15) applies for 10+ staff.
                                            </div>
                                        </div>

                                        {/* Payment Button */}
                                        <button
                                            type="submit"
                                            className="w-full mt-6 py-3 px-4 rounded-lg font-medium bg-primary text-white hover:bg-primary/90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                            disabled={!form.formState.isValid || total === 0}
                                        >
                                            {total === 0 ? 'Select a plan and enter staff count' : 'Proceed to Payment'}
                                        </button>
                                    </form>
                                </Form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}