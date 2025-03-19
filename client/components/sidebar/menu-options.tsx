"use client";
import React, { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { LucideShieldQuestion, Menu, Sidebar, User } from 'lucide-react';
import clsx from "clsx";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "../ui/command";
import Link from "next/link";
import { useModal } from "../ui/model-provider";
import Image from "next/image";
import { Popover, PopoverTrigger } from "../ui/popover";
import { PopoverContent } from "@radix-ui/react-popover";
import { SidebarOption, icons } from "../../lib/constants";
import { usePathname } from "next/navigation";
import { ModeDashboardToggle } from "../global/mode-dashboard";
import { useAuthenticator } from "@aws-amplify/ui-react";
import PersonalDetails from "./personal-details";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
    defaultOpen?: boolean;
    sidebarOpt: SidebarOption[];
    id: string;
    type: string;
    onToggle?: () => void;
};

const WorkspaceMenuOptions = ({
    sidebarOpt,
    isExpanded,
    toggleExpand
}: {
    sidebarOpt: SidebarOption[];
    isExpanded: boolean;
    toggleExpand: () => void;
}) => {
    const { signOut } = useAuthenticator((context) => [context.signOut]);
    const pathname = usePathname();

    return (
        <div className="">
            <div className="flex flex-row gap-2 items-center m-4 mb-10 justify-between">
                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            className="flex flex-row gap-2 items-center justify-center"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Image src="/logos/medbox.svg" alt="Medbox Logo" width={30} height={30} />
                            <h1 className="text-xl font-bold text-primary">AICare</h1>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Command className="rounded-lg overflow-visible bg-transparent ml-2">
                            <CommandInput placeholder="Search..." />
                            <CommandList className="py-4 overflow-visible">
                                <CommandEmpty>No Results Found</CommandEmpty>
                                {sidebarOpt.map((sidebarOption) => (
                                    <React.Fragment key={sidebarOption.heading}>
                                        <div className="py-2 mb-4" key={sidebarOption.heading}>
                                            <h3 className="text-sm text-muted-foreground font-medium mb-2">
                                                {sidebarOption.heading}
                                            </h3>
                                            <CommandGroup className="overflow-visible bg-transparent">
                                                {sidebarOption.items.map((option) => {
                                                    let val;

                                                    const result = icons.find(
                                                        (icon: any) => icon.value.toLowerCase() === option.icon.toLowerCase()
                                                    );
                                                    if (result) {
                                                        const IconComponent = result.path;
                                                        val = <IconComponent className="w-5 h-5" />;
                                                    } else {
                                                        val = <LucideShieldQuestion className="w-5 h-5" />;
                                                    }
                                                    return (
                                                        <CommandItem
                                                            key={option.name}
                                                            className={clsx(
                                                                "md:w-[230px] w-full font-normal mb-1 hover:scale-[1.02] hover:text-black dark:hover:text-white hover:bg-white",
                                                                {
                                                                    "border border-muted-foreground/20 bg-white hover:bg-white":
                                                                        pathname === option.link,
                                                                }
                                                            )}
                                                        >
                                                            <Link
                                                                href={option.link}
                                                                className="flex items-center gap-4 rounded-md transition-all md:w-[250px] w-full p-1"
                                                            >
                                                                {val}
                                                                <span className="font-medium">{option.name}</span>
                                                            </Link>
                                                        </CommandItem>
                                                    );
                                                })}
                                            </CommandGroup>
                                        </div>
                                    </React.Fragment>
                                ))}
                            </CommandList>
                        </Command>
                        <section>
                            <Popover>
                                <PopoverTrigger className="hover:bg-white rounded-lg p-1">
                                    <PersonalDetails />
                                </PopoverTrigger>
                                <PopoverContent className="w-[260px] mb-2">
                                    <Command>
                                        <CommandList>
                                            <CommandGroup heading="">
                                                <CommandItem>
                                                    <ModeDashboardToggle />
                                                </CommandItem>
                                                <CommandItem>
                                                    <Button onClick={signOut} className="w-full bg-card hover:bg-white">
                                                        <div className="flex justify-start w-full items-center">
                                                            <User className="w-4 h-4 mr-4 text-muted-foreground dark:text-white" />
                                                            <p className="text-center text-muted-foreground dark:text-white">
                                                                Sign Out
                                                            </p>
                                                        </div>
                                                    </Button>
                                                </CommandItem>
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        </section>
                    </motion.div>
                )}
            </AnimatePresence>
            {!isExpanded && (
                <motion.div
                    className="flex flex-col items-center gap-4 mt-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                >
                    {sidebarOpt.map((sidebarOption) => (
                        <React.Fragment key={sidebarOption.heading}>
                            {sidebarOption.items.map((option) => {
                                let val;
                                const result = icons.find(
                                    (icon: any) => icon.value.toLowerCase() === option.icon.toLowerCase()
                                );
                                if (result) {
                                    const IconComponent = result.path;
                                    val = <IconComponent className="w-5 h-5" />;
                                } else {
                                    val = <LucideShieldQuestion className="w-5 h-5" />;
                                }
                                return (
                                    <Link
                                        key={option.name}
                                        href={option.link}
                                        className={clsx(
                                            "p-2 rounded-md hover:bg-white transition-all",
                                            {
                                                "bg-white": pathname === option.link,
                                            }
                                        )}
                                        title={option.name}
                                    >
                                        {val}
                                    </Link>
                                );
                            })}
                        </React.Fragment>
                    ))}
                </motion.div>
            )}
        </div>
    );
};

const MenuOptions = ({ id, sidebarOpt, defaultOpen, type, onToggle }: Props) => {
    const [isMounted, setIsMounted] = useState(false);
    const [isExpanded, setIsExpanded] = useState(defaultOpen || false);

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
        if (onToggle) {
            onToggle();
        }
    };

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    return (
        <Sheet modal={false} {...(defaultOpen ? { open: true } : {})}>
            <SheetTrigger
                asChild
                className="absolute left-4 top-4 z-[100] md:!hidden flex"
            >
                <Button variant="outline" size={"icon"} className="hover:bg-white">
                    <Menu />
                </Button>
            </SheetTrigger>

            <SheetContent
                showX={!defaultOpen}
                side={"left"}
                className={clsx(
                    "backdrop-blur-xl fixed top-0 p-6 bg-sidebar shadow-none transition-all duration-300",
                    {
                        "hidden md:inline-block z-0": defaultOpen,
                        "inline-block md:hidden z-[100] w-full": !defaultOpen,
                    },
                    isExpanded ? "w-[200px]" : "w-[80px]"
                )}
            >
                <motion.div
                    className="flex flex-col h-full"
                    layout
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                    <nav className="flex flex-col justify-between h-full">
                        <WorkspaceMenuOptions sidebarOpt={sidebarOpt} isExpanded={isExpanded} toggleExpand={toggleExpand} />
                    </nav>
                </motion.div>
            </SheetContent>
        </Sheet>
    );
};

export default MenuOptions;
