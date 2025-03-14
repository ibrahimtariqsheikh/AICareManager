"use client";
import React, { useEffect, useMemo, useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { BarChart3, Calendar, ChevronsUpDown, Loader2, Menu, Plus, Settings, User, Users } from 'lucide-react';
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
import { AssistantType, DatasetType, ModelType, SidebarOption, icons } from "../../lib/constants";
import { usePathname, useRouter } from "next/navigation";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "../ui/card";
import { ModeDashboardToggle } from "../global/mode-dashboard";
import CustomModel from "../global/custom-model";

import { cn } from "../../lib/utils";

import { useAuthenticator } from "@aws-amplify/ui-react";
import PersonalDetails from "./personal-details";

type Props = {
    defaultOpen?: boolean;
    sidebarOpt: SidebarOption[];
    id: string;
    type: string;
};

const WorkspaceMenuOptions = ({
    sidebarOpt,
}: {
    sidebarOpt: SidebarOption[];
}) => {
    const { signOut } = useAuthenticator((context) => [context.signOut]);
    const { setOpen } = useModal();
    const pathname = usePathname();

    return (
        <>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        className="p-10 mb-10 bg-transparent border-none group hover:bg-sidebar-hover"
                        variant={"outline"}
                    >
                        <div className="flex flex-row md:w-[250px] w-full gap-4 items-center justify-between">
                            <div className="flex gap-4 items-center">
                                {/* <div className="w-10 h-10 relative">
                                    <Link href={"/"}>
                                        <Image
                                            src={"/assets/ncbai.svg"}
                                            alt="NCBP Logo"
                                            fill
                                            className="rounded-md object-contain"
                                        />
                                    </Link>
                                </div> */}

                                <div className="flex flex-col justify-start items-start">
                                    <h1 className="text-xl font-bold  dark:text-white text-primary">
                                        AI Care Manager
                                    </h1>
                                </div>
                            </div>
                            <ChevronsUpDown className="w-5 h-5 text-muted-foreground group-hover:text-secondary-foreground" />
                        </div>
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="mt-3 ml-5 w-[26rem] h-fit z-50">
                    <Card className="bg-card border dark:border-primary/50 border-border bg-gradient-to-l from-card to-card">
                        <CardHeader>
                            <CardTitle className="text-xl">NoCodeBot.ai</CardTitle>
                            <CardDescription className="text-xs">
                                Build AI applications without code
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <Button
                                    className="w-full gap-2"
                                    onClick={() => {
                                        setOpen(
                                            <CustomModel
                                                title="Create New Project"
                                                description="Enter the details below to create a new project"
                                            >
                                                <div>
                                                    HELLO
                                                    {/* <CreateProjectForm /> */}
                                                </div>
                                            </CustomModel>
                                        );
                                    }}
                                >
                                    <Plus className="w-4 h-4" />
                                    Create Project
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </PopoverContent>
            </Popover>
            <Command className="rounded-lg overflow-visible bg-transparent">
                <CommandInput placeholder="Search..." />
                <CommandList className="py-4 overflow-visible">
                    <CommandEmpty>No Results Found</CommandEmpty>
                    {sidebarOpt.map((sidebarOption) => (
                        <React.Fragment key={sidebarOption.heading}>
                            <div className=" py-2" key={sidebarOption.heading}>
                                <h3 className="text-sm text-primary font-medium">
                                    {sidebarOption.heading}
                                </h3>
                                <CommandGroup className="overflow-visible">
                                    {sidebarOption.items.map((option) => {
                                        let val;
                                        const result = icons.find(
                                            (icon) => icon.value === option.icon
                                        );
                                        if (result) {
                                            val = <result.path className="w-5 h-5" />;
                                        }
                                        return (
                                            <CommandItem
                                                key={option.name}
                                                className={clsx(
                                                    "md:w-[250px] w-full text-muted-foreground font-normal hover:bg-sidebar-hover mb-1 hover:scale-[1.02] hover:text-black dark:hover:text-white",
                                                    {
                                                        "bg-sidebar-hover text-sidebar-foreground":
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
                    <PopoverTrigger className="hover:bg-card rounded-lg p-1">
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
                                        <Button onClick={signOut} className="w-full bg-card">
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
        </>
    );
};

const ChatbotMenuOptions = () => {
    const { signOut } = useAuthenticator((context) => [context.signOut]);
    const router = useRouter();
    return (
        <>
            <div className="flex flex-col items-center justify-between gap-10 my-4 mx-2">
                <div className=" flex items-center">
                    <div className="flex flex-row gap-2">
                        <Image
                            src="/assets/ncbai.svg"
                            alt="NCBP Logo"
                            width={30}
                            height={30}
                        />
                        <h1 className="text-xl font-bold text-secondary-foreground">
                            NoCodeBot.ai
                        </h1>
                    </div>
                </div>
            </div>
            <div>
                <Popover>
                    <PopoverTrigger className="hover:bg-card rounded-lg p-1">
                        <PersonalDetails />
                    </PopoverTrigger>
                    <PopoverContent className="w-[260px] mb-2">
                        <Command>
                            <CommandList>
                                <CommandGroup heading="">
                                    <CommandItem>
                                        <Button
                                            onClick={() => {
                                                router.back();
                                            }}
                                            className="w-full bg-card"
                                        >
                                            <div className="flex justify-start w-full items-center">
                                                <Settings className="w-4 h-4 mr-4" />
                                                <p className="text-center">Manage Workspace</p>
                                            </div>
                                        </Button>
                                    </CommandItem>
                                    <CommandItem>
                                        <Button onClick={signOut} className="w-full bg-card">
                                            <div className="flex justify-start w-full items-center">
                                                <User className="w-4 h-4 mr-4" />
                                                <p className="text-center">Sign Out</p>
                                            </div>
                                        </Button>
                                    </CommandItem>
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
            </div>
        </>
    );
};

const MenuOptions = ({ id, sidebarOpt, defaultOpen, type }: Props) => {
    const [isMounted, setIsMounted] = useState(false);

    const openState = useMemo(
        () => (defaultOpen ? { open: true } : {}),
        [defaultOpen]
    );

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    return (
        <Sheet modal={false} {...openState}>
            <SheetTrigger
                asChild
                className="absolute left-4 top-4 z-[100] md:!hidden flex"
            >
                <Button variant="outline" size={"icon"}>
                    <Menu />
                </Button>
            </SheetTrigger>

            <SheetContent
                showX={!defaultOpen}
                side={"left"}
                className={clsx(
                    "backdrop-blur-xl fixed top-0 p-6 bg-sidebar shadow-none",
                    {
                        "hidden md:inline-block z-0 w-[300px]": defaultOpen,
                        "inline-block md:hidden z-[100] w-full": !defaultOpen,
                    }
                )}
            >
                <div className="flex flex-col h-full">
                    <nav className="flex flex-col justify-between h-full">
                        {type === "chatbot" ? (
                            <ChatbotMenuOptions />
                        ) : (
                            <WorkspaceMenuOptions sidebarOpt={sidebarOpt} />
                        )}
                    </nav>
                </div>
            </SheetContent>
        </Sheet>
    );
};

export default MenuOptions;
