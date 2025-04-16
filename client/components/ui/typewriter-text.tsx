"use client";

import { cn } from "@/lib/utils";
import { motion, stagger } from "framer-motion";
import { useInView } from "framer-motion";
import { useAnimate } from "framer-motion";
import { useEffect, useState } from "react";

export const TypewriterEffect = ({
    words,
    className,
    cursorClassName,
}: {
    words: {
        text: string;
        className?: string;
    }[];
    className?: string;
    cursorClassName?: string;
}) => {
    // split text inside of words into array of characters
    const wordsArray = words.map((word) => {
        return {
            ...word,
            text: word.text.split(""),
        };
    });

    const [scope, animate] = useAnimate();
    const isInView = useInView(scope);
    useEffect(() => {
        if (isInView) {
            animate(
                "span",
                {
                    display: "inline-block",
                    opacity: 1,
                    width: "fit-content",
                },
                {
                    duration: 0.3,
                    delay: stagger(0.1),
                    ease: "easeInOut",
                }
            );
        }
    }, [isInView]);

    const renderWords = () => {
        return (
            <motion.div ref={scope} className="inline">
                {wordsArray.map((word, idx) => {
                    return (
                        <div key={`word-${idx}`} className="inline-block">
                            {word.text.map((char, index) => (
                                <motion.span
                                    initial={{}}
                                    key={`char-${index}`}
                                    className={cn(
                                        `dark:text-white text-black opacity-0 hidden`,
                                        word.className
                                    )}
                                >
                                    {char}
                                </motion.span>
                            ))}
                            &nbsp;
                        </div>
                    );
                })}
            </motion.div>
        );
    };
    return (
        <div
            className={cn(
                "text-base sm:text-xl md:text-3xl lg:text-5xl font-bold text-center",
                className
            )}
        >
            {renderWords()}
            <motion.span
                initial={{
                    opacity: 0,
                }}
                animate={{
                    opacity: 1,
                }}
                transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    repeatType: "reverse",
                }}
                className={cn(
                    "inline-block rounded-sm w-[4px] h-4 md:h-6 lg:h-10 bg-blue-500",
                    cursorClassName
                )}
            ></motion.span>
        </div>
    );
};

export const TypewriterEffectSmooth = ({
    words,
    className,
    cursorClassName,
}: {
    words: {
        text: string;
        className?: string;
    }[];
    className?: string;
    cursorClassName?: string;
}) => {
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [currentCharIndex, setCurrentCharIndex] = useState(0);
    const [, setIsTyping] = useState(true);

    useEffect(() => {
        if (currentWordIndex < words.length) {
            const timeout = setTimeout(() => {
                if (words[currentWordIndex] && currentCharIndex < words[currentWordIndex].text.length) {
                    setCurrentCharIndex((prev) => prev + 1);
                } else {
                    setCurrentWordIndex((prev) => prev + 1);
                    setCurrentCharIndex(0);
                }
            }, 100);

            return () => clearTimeout(timeout);
        } else {
            setIsTyping(false);
            return () => { };
        }
    }, [currentWordIndex, currentCharIndex, words]);

    return (
        <div className={cn("flex flex-wrap gap-2", className)}>
            {words.map((word, idx) => {
                const isCurrentWord = idx === currentWordIndex;
                const isPastWord = idx < currentWordIndex;
                const isFutureWord = idx > currentWordIndex;

                return (
                    <span
                        key={idx}
                        className={cn(
                            "text-6xl font-semibold leading-tight",
                            word.className,
                            isPastWord && "opacity-100",
                            isCurrentWord && "opacity-100",
                            isFutureWord && "opacity-0"
                        )}
                    >
                        {isPastWord
                            ? word.text
                            : isCurrentWord
                                ? word.text.slice(0, currentCharIndex)
                                : ""}
                        {isCurrentWord && currentCharIndex < word.text.length && (
                            <span
                                className={cn(
                                    "inline-block w-1 h-8 bg-blue-500 ml-1 animate-blink",
                                    cursorClassName
                                )}
                            />
                        )}
                    </span>
                );
            })}
        </div>
    );
};
