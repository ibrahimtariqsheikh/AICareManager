"use client"

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { ChevronRightIcon } from "lucide-react";
import Image from "next/image";

interface HeroSectionProps {
    title: string;
    subtitle: string;
    image: string;
}

export function HeroSection({ title, subtitle, image }: HeroSectionProps) {
    const [isMounted, setIsMounted] = useState(false);
    const words = title.split(" ");
    const containerRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const subtitleRef = useRef<HTMLParagraphElement>(null);
    const imageRef = useRef<HTMLDivElement>(null);
    const buttonsRef = useRef<HTMLDivElement>(null);
    const floatingElementsRef = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        setIsMounted(true);

        // Set initial state
        gsap.set([titleRef.current?.children, subtitleRef.current, imageRef.current, buttonsRef.current?.children], {
            opacity: 0,
            y: 20
        });

        const ctx = gsap.context(() => {
            // Main content animations
            if (titleRef.current?.children) {
                gsap.fromTo(
                    Array.from(titleRef.current.children),
                    { opacity: 0, y: 10 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.3,
                        stagger: 0.1,
                        ease: "power2.out",
                    }
                );
            }

            if (subtitleRef.current) {
                gsap.fromTo(
                    subtitleRef.current,
                    { opacity: 0, y: 20 },
                    { opacity: 1, y: 0, duration: 0.5, delay: 0.3 }
                );
            }

            if (buttonsRef.current?.children) {
                gsap.to(Array.from(buttonsRef.current.children), {
                    opacity: 1,
                    y: 0,
                    duration: 0.5,
                    delay: 0.6,
                    stagger: 0.1,
                    ease: "power2.out"
                });
            }

            if (imageRef.current) {
                gsap.to(imageRef.current, {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    delay: 0.5,
                    ease: "power2.out"
                });
            }

            // Floating elements animations
            floatingElementsRef.current.forEach((el, index) => {
                if (!el) return;

                gsap.to(el, {
                    x: gsap.utils.wrap(["-30%", "20%", "-15%"]),
                    y: gsap.utils.wrap(["-20%", "25%", "-10%"]),
                    scale: gsap.utils.wrap([1, 1.2, 0.9, 1.1]),
                    duration: 15 + index * 2,
                    repeat: -1,
                    yoyo: true,
                    ease: "none",
                });
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div className={cn("relative w-full overflow-hidden", !isMounted && "invisible")} ref={containerRef}>
            <div className={cn("absolute top-0 -z-10 h-full w-full")}>
                <div className="absolute bottom-auto left-auto right-0 top-0 h-[300px] md:h-[500px] w-[300px] md:w-[500px] -translate-x-[30%] translate-y-[20%] rounded-full bg-blue-300/20 md:bg-blue-300/30 opacity-20 md:opacity-30 blur-[60px] md:blur-[80px]" />
            </div>

            <div className="absolute inset-0 overflow-hidden">
                {[...Array(6)].map((_, i) => (
                    <div
                        key={i}
                        ref={el => {
                            floatingElementsRef.current[i] = el;
                        }}
                        className={`absolute w-[${150 + i * 50}px] md:w-[${250 + i * 50}px] h-[${150 + i * 50}px] md:h-[${250 + i * 50}px] bg-${['blue', 'indigo', 'blue', 'cyan', 'blue', 'sky'][i]}-300/10 md:bg-${['blue', 'indigo', 'blue', 'cyan', 'blue', 'sky'][i]}-300/20 rounded-full blur-2xl md:blur-3xl mix-blend-multiply`}
                        style={{
                            top: `${[15, 45, 70, 10, 85, 35][i]}%`,
                            left: `${[40, 65, 45, 75, 70, 20][i]}%`,
                        }}
                    />
                ))}
            </div>

            <div className="absolute inset-0 backdrop-blur-[1px] z-0"></div>

            <div className="container mx-auto px-6 pt-10 pb-16 md:pt-24 md:pb-24 relative z-10">
                <div className="mx-auto text-center">
                    <div className="flex justify-center mb-4">
                        <div className={cn("text-xs bg-blue-500/20 text-blue-600 font-medium border border-blue-500/30 rounded-full px-3 py-1.5 relative tracking-tight leading-relaxed")}>
                            <div className="absolute inset-0 rounded-full bg-blue-500/30 blur-xl -z-10 animate-pulse"></div>
                            AI-Powered Care Management
                        </div>
                    </div>
                    <div>
                        <h1 ref={titleRef} className="text-4xl md:text-6xl lg:text-[5rem] font-semibold tracking-tighter px-2">
                            {words.slice(0, words.length - 4).map((word, index) => (
                                <span key={index} className="p-1 inline-block leading-none">
                                    {word}
                                </span>
                            ))}
                            <br />
                            {words.slice(words.length - 4).map((word, index) => (
                                <span
                                    key={index}
                                    className="p-1 inline-block leading-none text-4xl md:text-5xl lg:text-[4.5rem] bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-600"
                                >
                                    {word}
                                </span>
                            ))}
                        </h1>

                        <p
                            ref={subtitleRef}
                            className={cn("relative z-10 mt-4 mx-auto max-w-4xl py-3 text-center text-md font-medium text-neutral-600 rounded-lg tracking-tight leading-relaxed")}
                        >
                            {subtitle}
                        </p>
                    </div>
                    <div ref={buttonsRef} className="flex justify-center gap-10 mb-10 mt-4 items-center">
                        <Button size="lg" className="bg-primary text-white hover:bg-blue-600 font-semibold">
                            Talk to Sales
                        </Button>
                        <button className="flex items-center justify-center gap-2 bg-none border-none hover:bg-none text-neutral-900 font-medium text-sm">
                            Watch Demo
                            <ChevronRightIcon className="w-4 h-4" />
                        </button>
                    </div>

                    <div ref={imageRef} className="max-w-5xl mx-auto relative">
                        <div className="absolute inset-0 -z-10 opacity-40">
                            <div className="absolute inset-0 transform scale-105" />
                        </div>

                        <div className={cn("relative z-10 rounded-3xl border border-neutral-200 bg-white/90 backdrop-blur-md overflow-hidden")}>
                            <div className="w-full overflow-hidden">
                                <Image
                                    src={image || "/placeholder.svg"}
                                    alt="Landing page preview"
                                    className="h-auto w-full object-cover"
                                    loading="lazy"
                                    width={1000}
                                    height={1000}
                                    quality={100}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}