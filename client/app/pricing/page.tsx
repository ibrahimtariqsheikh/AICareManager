import React from 'react';
import { Check } from 'lucide-react';
import Image from 'next/image';

export default function PricingPage() {
    const plans = [
        {
            name: 'Starter',
            description: 'Perfect for small care homes just getting started',
            price: 99,
            period: '/month',
            features: [
                'Up to 10 care workers',
                'Basic client management',
                'Essential reporting',
                'Email support',
                'Standard scheduling'
            ],
            buttonStyle: 'border border-gray-300 text-gray-700 hover:bg-gray-50',
            popular: false
        },
        {
            name: 'Professional',
            description: 'Ideal for growing care homes with multiple locations',
            price: 199,
            period: '/month',
            features: [
                'Up to 50 care workers',
                'Advanced client management',
                'Comprehensive reporting',
                'Priority support',
                'AI-powered scheduling',
                'Revenue analytics',
                'Staff management'
            ],
            buttonStyle: 'bg-primary text-white hover:bg-primary/90',
            popular: true
        },
        {
            name: 'Enterprise',
            description: 'For large care organizations with complex needs',
            price: 399,
            period: '/month',
            features: [
                'Unlimited care workers',
                'Enterprise client management',
                'Custom reporting',
                '24/7 dedicated support',
                'Advanced AI features',
                'Multi-location management',
                'Custom integrations',
                'API access'
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
                                } transition-all duration-300`}
                        >
                            {/* Popular Badge */}
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                    <span className="inline-flex items-center rounded-full bg-primary px-4 py-1 text-xs font-medium text-white">
                                        Most Popular
                                    </span>
                                </div>
                            )}

                            {/* Plan Header */}
                            <div className="text-center">
                                <h3 className="text-lg font-semibold text-neutral-900">{plan.name}</h3>
                                <p className="mt-2 text-sm text-neutral-500">{plan.description}</p>
                                <div className="mt-4 flex items-baseline justify-center">
                                    <span className="text-4xl font-bold tracking-tight text-neutral-900">£{plan.price}</span>
                                    <span className="ml-1 text-sm font-medium text-neutral-500">/month</span>
                                </div>
                            </div>

                            {/* Features */}
                            <ul className="mt-8 space-y-3">
                                {plan.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-start">
                                        <svg className="h-5 w-5 flex-shrink-0 text-primary" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                                        </svg>
                                        <span className="ml-3 text-sm text-neutral-500">{feature}</span>
                                    </li>
                                ))}
                            </ul>

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
            </div>
        </div>
    );
}