"use client"

import { motion } from "framer-motion";

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

    const words = title.split(" ");

    return (
        <div className="relative w-full overflow-hidden">

            <div className={cn("absolute top-0 -z-10 h-full w-full ",)}>
                <div className="absolute bottom-auto left-auto right-0 top-0 h-[300px] md:h-[500px] w-[300px] md:w-[500px] -translate-x-[30%] translate-y-[20%] rounded-full bg-blue-300/20 md:bg-blue-300/30 opacity-20 md:opacity-30 blur-[60px] md:blur-[80px]" />
            </div>


            <div className="absolute inset-0 overflow-hidden">

                <motion.div
                    className="absolute w-[200px] md:w-[300px] h-[200px] md:h-[300px] bg-blue-300/10 md:bg-blue-300/20 rounded-full blur-2xl md:blur-3xl mix-blend-multiply"
                    animate={{
                        x: ["-30%", "20%", "-15%"],
                        y: ["-20%", "25%", "-10%"],
                        scale: [1, 1.2, 0.9, 1.1],
                    }}
                    transition={{
                        duration: 15,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "reverse",
                    }}
                    style={{ top: "15%", left: "40%" }}
                />
                <motion.div
                    className="absolute w-[250px] md:w-[350px] h-[250px] md:h-[350px] bg-indigo-300/10 md:bg-indigo-300/20 rounded-full blur-2xl md:blur-3xl mix-blend-multiply"
                    animate={{
                        x: ["20%", "-25%", "15%"],
                        y: ["15%", "-20%", "25%"],
                        scale: [1.1, 0.9, 1.2, 1],
                    }}
                    transition={{
                        duration: 18,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "reverse",
                    }}
                    style={{ top: "45%", right: "35%" }}
                />
                <motion.div
                    className="absolute w-[150px] md:w-[250px] h-[150px] md:h-[250px] bg-blue-400/10 md:bg-blue-400/20 rounded-full blur-2xl md:blur-3xl mix-blend-multiply"
                    animate={{
                        x: ["-15%", "25%", "-20%"],
                        y: ["25%", "-15%", "20%"],
                        scale: [0.9, 1.1, 1, 1.2],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "reverse",
                    }}
                    style={{ bottom: "30%", left: "45%" }}
                />


                <motion.div
                    className="absolute w-[180px] md:w-[280px] h-[180px] md:h-[280px] bg-cyan-300/10 md:bg-cyan-300/15 rounded-full blur-2xl md:blur-3xl mix-blend-multiply"
                    animate={{
                        x: ["10%", "-15%", "5%"],
                        y: ["5%", "-10%", "15%"],
                        scale: [1, 1.3, 0.8, 1.2],
                    }}
                    transition={{
                        duration: 12,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "reverse",
                    }}
                    style={{ top: "10%", right: "25%" }}
                />
                <motion.div
                    className="absolute w-[220px] md:w-[320px] h-[220px] md:h-[320px] bg-blue-200/10 md:bg-blue-200/15 rounded-full blur-2xl md:blur-3xl mix-blend-multiply"
                    animate={{
                        x: ["-10%", "15%", "-5%"],
                        y: ["-5%", "10%", "-15%"],
                        scale: [1.2, 0.8, 1.3, 1],
                    }}
                    transition={{
                        duration: 14,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "reverse",
                    }}
                    style={{ bottom: "15%", right: "30%" }}
                />
                <motion.div
                    className="absolute w-[150px] md:w-[200px] h-[150px] md:h-[200px] bg-sky-200/10 md:bg-sky-200/15 rounded-full blur-2xl md:blur-3xl mix-blend-multiply"
                    animate={{
                        x: ["5%", "-10%", "15%"],
                        y: ["15%", "-5%", "10%"],
                        scale: [0.8, 1.2, 1, 1.1],
                    }}
                    transition={{
                        duration: 16,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "reverse",
                    }}
                    style={{ top: "35%", left: "20%" }}
                />
            </div>


            <div className="absolute inset-y-0 left-0 w-[100px] md:w-[150px] opacity-20 md:opacity-40">
                <motion.div
                    className="absolute w-[150px] md:w-[200px] h-[300px] md:h-[500px] bg-gradient-to-r from-blue-200/20 md:from-blue-200/30 to-transparent rounded-full blur-2xl md:blur-3xl"
                    animate={{
                        y: ["-10%", "10%"],
                        x: ["-20%", "-10%"],
                        scale: [1, 1.1, 0.9],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "reverse",
                    }}
                    style={{ top: "30%" }}
                />
            </div>

            <div className="absolute inset-y-0 right-0 w-[100px] md:w-[150px] opacity-20 md:opacity-40">
                <motion.div
                    className="absolute w-[150px] md:w-[200px] h-[300px] md:h-[500px] bg-gradient-to-l from-blue-200/20 md:from-blue-200/30 to-transparent rounded-full blur-2xl md:blur-3xl"
                    animate={{
                        y: ["10%", "-10%"],
                        x: ["20%", "10%"],
                        scale: [0.9, 1.1, 1],
                    }}
                    transition={{
                        duration: 9,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "reverse",
                    }}
                    style={{ top: "40%" }}
                />
            </div>


            <div className="absolute inset-0 backdrop-blur-[1px] z-0"></div>


            <div className="container mx-auto px-6 pt-10 pb-16 md:pt-24 md:pb-24 relative z-10">
                <motion.div
                    className="mx-auto text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="flex justify-center mb-4">
                        <div className={cn("text-[13px] bg-blue-500/20 text-blue-600 font-medium border border-blue-500/30 rounded-full px-4 py-2 relative tracking-tight leading-relaxed")}>
                            <div className="absolute inset-0 rounded-full bg-blue-500/30 blur-xl -z-10 animate-pulse"></div>
                            AI-Powered Care Management
                        </div>
                    </div>
                    <div>
                        <motion.h1 className="text-4xl md:text-6xl lg:text-[5rem] font-semibold tracking-tighter  px-2">
                            {words.slice(0, words.length - 4).map((word, index) => (
                                <motion.span
                                    key={index}
                                    initial={{ opacity: 0, filter: "blur(4px)", y: 10 }}
                                    animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                                    transition={{
                                        duration: 0.3,
                                        delay: index * 0.1,
                                        ease: "easeInOut",
                                    }}
                                    className="p-1 inline-block leading-none"
                                >
                                    {word}
                                </motion.span>
                            ))}
                            <br />
                            {words.slice(words.length - 4).map((word, index) => (
                                <motion.span
                                    key={index}
                                    initial={{ opacity: 0, filter: "blur(4px)", y: 10 }}
                                    animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                                    transition={{
                                        duration: 0.3,
                                        delay: (index + words.length - 4) * 0.1,
                                        ease: "easeInOut",
                                    }}
                                    className="p-1 inline-block leading-none text-4xl md:text-5xl lg:text-[4.5rem] bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-600"
                                >
                                    {word}
                                </motion.span>
                            ))}
                        </motion.h1>

                        <motion.p
                            className={cn("relative z-10 mt-4 mx-auto max-w-4xl py-3 text-center text-md font-medium text-neutral-600 rounded-lg tracking-tight leading-relaxed")}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                        >
                            {subtitle}
                        </motion.p>
                    </div>
                    <div className="flex justify-center gap-10 mb-10 mt-4 items-center">
                        <Button size="lg" className="bg-primary text-white hover:bg-blue-600 font-semibold">
                            Talk to Sales
                        </Button>
                        <button className="flex items-center justify-center gap-2 bg-none border-none hover:bg-none text-neutral-900 font-medium text-sm" >
                            Watch Demo
                            <ChevronRightIcon className="w-4 h-4" />
                        </button>
                    </div>


                    <motion.div
                        className="max-w-5xl mx-auto relative"
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                    >

                        <div className="absolute inset-0 -z-10 opacity-40">
                            <div className="absolute inset-0 transform scale-105" />
                        </div>

                        <motion.div
                            initial={{
                                opacity: 0,
                                y: 10,
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                            }}
                            transition={{
                                duration: 0.3,
                                delay: 1.2,
                            }}
                            className={cn("relative z-10 rounded-3xl border border-neutral-200 bg-white/90 backdrop-blur-md   overflow-hidden")}
                        >
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
                        </motion.div>
                    </motion.div>
                </motion.div>
            </div>

            {/* Corner blurry effects with toned down blues */}
            <div className="absolute top-0 left-0 w-[150px] md:w-[200px] h-[150px] md:h-[200px] opacity-20 md:opacity-30">
                <motion.div
                    className="absolute w-full h-full bg-gradient-to-br from-blue-300/10 md:from-blue-300/20 to-transparent rounded-full blur-2xl md:blur-3xl"
                    animate={{
                        scale: [1, 1.2, 0.9],
                    }}
                    transition={{
                        duration: 7,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "reverse",
                    }}
                />
            </div>

            <div className="absolute bottom-0 right-0 w-[150px] md:w-[200px] h-[150px] md:h-[200px] opacity-20 md:opacity-30">
                <motion.div
                    className="absolute w-full h-full bg-gradient-to-tl from-blue-300/10 md:from-blue-300/20 to-transparent rounded-full blur-2xl md:blur-3xl"
                    animate={{
                        scale: [0.9, 1.1, 1],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "reverse",
                    }}
                />
            </div>
        </div>
    );
}