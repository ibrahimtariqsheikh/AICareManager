"use client";
import React from "react";
import { motion } from "framer-motion";

type SpotlightProps = {
    gradientFirst?: string;
    gradientSecond?: string;
    gradientThird?: string;
    translateY?: number;
    width?: number;
    height?: number;
    smallWidth?: number;
    duration?: number;
    xOffset?: number;
    intensity?: number;
    spread?: number;
};

export const Spotlight = ({
    gradientFirst = "radial-gradient(68.54% 68.72% at 55.02% 31.46%, hsla(210, 100%, 85%, .25) 0, hsla(210, 100%, 60%, .15) 50%, hsla(210, 100%, 45%, .05) 80%)",
    gradientSecond = "radial-gradient(50% 50% at 50% 50%, hsla(210, 100%, 85%, .2) 0, hsla(210, 100%, 60%, .1) 80%, transparent 100%)",
    gradientThird = "radial-gradient(50% 50% at 50% 50%, hsla(210, 100%, 85%, .15) 0, hsla(210, 100%, 60%, .08) 80%, transparent 100%)",
    translateY = -350,
    width = 700,
    height = 1200,
    smallWidth = 300,
    duration = 7,
    xOffset = 150,
    intensity = .75,
    spread = 1.5,
}: SpotlightProps = {}) => {
    return (
        <motion.div
            initial={{
                opacity: 0,
            }}
            animate={{
                opacity: intensity,
            }}
            transition={{
                duration: 1.5,
            }}
            className="pointer-events-none absolute inset-0 h-full w-full overflow-hidden"
        >
            <motion.div
                animate={{
                    x: [0, xOffset, 0],
                    y: [0, -50, 0],
                }}
                transition={{
                    duration,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut",
                }}
                className="absolute top-0 left-0 w-screen h-screen z-40 pointer-events-none"
            >
                <div
                    style={{
                        transform: `translateY(${translateY}px) rotate(-45deg)`,
                        background: gradientFirst,
                        width: `${width}px`,
                        height: `${height}px`,
                        filter: `blur(${10 * spread}px)`,
                    }}
                    className={`absolute top-0 left-0`}
                />

                <div
                    style={{
                        transform: "rotate(-45deg) translate(15%, -60%)",
                        background: gradientSecond,
                        width: `${smallWidth}px`,
                        height: `${height}px`,
                        filter: `blur(${8 * spread}px)`,
                    }}
                    className={`absolute top-0 left-0 origin-top-left`}
                />

                <div
                    style={{
                        transform: "rotate(-45deg) translate(-220%, -90%)",
                        background: gradientThird,
                        width: `${smallWidth}px`,
                        height: `${height}px`,
                        filter: `blur(${8 * spread}px)`,
                    }}
                    className={`absolute top-0 left-0 origin-top-left`}
                />
            </motion.div>

            <motion.div
                animate={{
                    x: [0, -xOffset, 0],
                    y: [0, 50, 0],
                }}
                transition={{
                    duration: duration * 1.2,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut",
                }}
                className="absolute top-0 right-0 w-screen h-screen z-40 pointer-events-none"
            >
                <div
                    style={{
                        transform: `translateY(${translateY}px) rotate(45deg)`,
                        background: gradientFirst,
                        width: `${width}px`,
                        height: `${height}px`,
                        filter: `blur(${10 * spread}px)`,
                    }}
                    className={`absolute top-0 right-0`}
                />

                <div
                    style={{
                        transform: "rotate(45deg) translate(-15%, -60%)",
                        background: gradientSecond,
                        width: `${smallWidth}px`,
                        height: `${height}px`,
                        filter: `blur(${8 * spread}px)`,
                    }}
                    className={`absolute top-0 right-0 origin-top-right`}
                />

                <div
                    style={{
                        transform: "rotate(45deg) translate(220%, -90%)",
                        background: gradientThird,
                        width: `${smallWidth}px`,
                        height: `${height}px`,
                        filter: `blur(${8 * spread}px)`,
                    }}
                    className={`absolute top-0 right-0 origin-top-right`}
                />
            </motion.div>
        </motion.div>
    );
};
