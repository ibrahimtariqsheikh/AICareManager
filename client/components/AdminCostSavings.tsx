"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { PoundSterling, Calculator, FileText, Clock, Shield } from "lucide-react"
import { cn } from "@/lib/utils"
import * as React from 'react'
import {
    type SpringOptions,
    type UseInViewOptions,
    useInView,
    useMotionValue,
    useSpring,
} from 'framer-motion'

// CountingNumber component
type CountingNumberProps = React.ComponentProps<'span'> & {
    number: number;
    fromNumber?: number;
    padStart?: boolean;
    inView?: boolean;
    inViewMargin?: UseInViewOptions['margin'];
    inViewOnce?: boolean;
    decimalSeparator?: string;
    transition?: SpringOptions;
    decimalPlaces?: number;
};

function CountingNumber({
    ref,
    number,
    fromNumber = 0,
    padStart = false,
    inView = false,
    inViewMargin = '0px',
    inViewOnce = true,
    decimalSeparator = '.',
    transition = { stiffness: 90, damping: 50 },
    decimalPlaces = 0,
    className,
    ...props
}: CountingNumberProps) {
    const localRef = React.useRef<HTMLSpanElement>(null);
    React.useImperativeHandle(ref, () => localRef.current as HTMLSpanElement);

    const numberStr = number.toString();
    const decimals =
        typeof decimalPlaces === 'number'
            ? decimalPlaces
            : numberStr.includes('.')
                ? (numberStr.split('.')[1]?.length ?? 0)
                : 0;

    const motionVal = useMotionValue(fromNumber);
    const springVal = useSpring(motionVal, transition);

    const inViewResult = useInView(localRef, {
        once: inViewOnce,
        margin: inViewMargin,
    });

    const isInView = !inView || inViewResult;

    React.useEffect(() => {
        if (isInView) motionVal.set(number);
    }, [isInView, number, motionVal]);

    React.useEffect(() => {
        const unsubscribe = springVal.on('change', (latest) => {
            if (localRef.current) {
                let formatted =
                    decimals > 0
                        ? latest.toFixed(decimals)
                        : Math.round(latest).toString();

                if (decimals > 0) {
                    formatted = formatted.replace('.', decimalSeparator);
                }

                if (padStart) {
                    const finalIntLength = Math.floor(Math.abs(number)).toString().length;
                    const [intPart, fracPart] = formatted.split(decimalSeparator);
                    const paddedInt = intPart?.padStart(finalIntLength, '0') ?? '';
                    formatted = fracPart
                        ? `${paddedInt}${decimalSeparator}${fracPart}`
                        : paddedInt;
                }

                // Add comma formatting for thousands
                const parts = formatted.split(decimalSeparator);
                parts[0] = parts[0]?.replace(/\B(?=(\d{3})+(?!\d))/g, ',') ?? '';
                formatted = parts.join(decimalSeparator);

                localRef.current.textContent = formatted;
            }
        });
        return () => unsubscribe();
    }, [springVal, decimals, padStart, number, decimalSeparator]);

    const finalIntLength = Math.floor(Math.abs(number)).toString().length;
    const initialText = padStart
        ? '0'.padStart(finalIntLength, '0') +
        (decimals > 0 ? decimalSeparator + '0'.repeat(decimals) : '')
        : '0' + (decimals > 0 ? decimalSeparator + '0'.repeat(decimals) : '');

    return (
        <span
            ref={localRef}
            data-slot="counting-number"
            className={className}
            {...props}
        >
            {initialText}
        </span>
    );
}

interface AdminCostSavingsProps {
    speed?: number
}

function AdminCostSavings({ speed = 1 }: AdminCostSavingsProps) {
    const totalSavings = 28375

    return (
        <div className="relative w-full max-w-4xl mx-auto bg-gray-50 rounded-2xl overflow-hidden ">
            <div className="px-6 pt-6  flex justify-center    items-center">

                <h3 className="text-md  text-center font-semibold text-gray-900 mb-4 mt-2">Replace Admin, Not Humans</h3>
            </div>

            <div className="h-[300px] p-4">
                <div className="rounded-xl p-6 h-full flex items-center justify-center">
                    <div className="text-center">
                        <p className="text-sm font-medium text-neutral-500 mb-2">Savings up to</p>
                        <div className="flex items-baseline justify-center gap-1 relative">
                            <span className="text-3xl text-gray-500">£</span>
                            <div className="relative">
                                <div className="absolute inset-0 blur-xl bg-gradient-to-r from-blue-400/10 via-blue-500/10 to-blue-600/10 rounded-lg transform scale-110"></div>
                                <CountingNumber
                                    number={totalSavings}
                                    className="text-5xl font-bold text-blue-600 relative z-10"
                                    inView={true}
                                    transition={{ stiffness: 100, damping: 30 }}
                                />
                            </div>
                            <span className="text-5xl font-bold text-blue-600">+</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export { AdminCostSavings }