"use client";
import { cn } from "@/lib/utils";
import { IconMenu2, IconX } from "@tabler/icons-react";
import { useRef, useState } from "react";
import Image from "next/image";
import React from "react";

interface NavbarProps {
    children: React.ReactNode;
    className?: string;
}

interface NavBodyProps {
    children: React.ReactNode;
    className?: string;
    visible?: boolean;
}

interface NavItemsProps {
    items: {
        name: string;
        link: string;
    }[];
    className?: string;
    onItemClick?: () => void;
}

interface MobileNavProps {
    children: React.ReactNode;
    className?: string;
    visible?: boolean;
}

interface MobileNavHeaderProps {
    children: React.ReactNode;
    className?: string;
}

interface MobileNavMenuProps {
    children: React.ReactNode;
    className?: string;
    isOpen: boolean;
    onClose: () => void;
}

export const Navbar = ({ children, className }: NavbarProps) => {
    return (
        <div
            className={cn(
                "sticky inset-x-0 top-4 md:top-10 z-40 w-full px-2 md:px-0",
                "scroll:translate-y-0 scroll:opacity-100",
                className
            )}
        >
            {React.Children.map(children, (child) =>
                React.isValidElement(child)
                    ? React.cloneElement(
                        child as React.ReactElement<{ visible?: boolean }>,
                        { visible: true },
                    )
                    : child,
            )}
        </div>
    );
};

export const NavBody = ({ children, className, visible }: NavBodyProps) => {
    return (
        <div
            className={cn(
                "relative z-[60] mx-auto hidden w-full max-w-7xl flex-row items-center justify-between self-start rounded-lg px-2 md:px-4 py-1 lg:flex border border-neutral-200 bg-white/60",
                "transition-[width,padding,transform,backdrop-filter] duration-500 ease-in-out",
                "scroll:w-[92%] scroll:px-6 scroll:backdrop-blur-md scroll:translate-y-2",
                "w-full px-4",
                className,
            )}
        >
            {children}
        </div>
    );
};

export const NavItems = ({ items, className, onItemClick }: NavItemsProps) => {
    const [hovered, setHovered] = useState<number | null>(null);

    return (
        <div
            onMouseLeave={() => setHovered(null)}
            className={cn(
                "absolute inset-0 hidden flex-1 flex-row items-center justify-center space-x-1 md:space-x-2 text-xs md:text-sm font-medium text-neutral-900 transition duration-200 hover:text-neutral-800 lg:flex",
                className,
            )}
        >
            {items.map((item, idx) => (
                <a
                    onMouseEnter={() => setHovered(idx)}
                    onClick={onItemClick}
                    className="relative px-2 md:px-4 py-2 text-neutral-900 dark:text-neutral-300"
                    key={`link-${idx}`}
                    href={item.link}
                >
                    {hovered === idx && (
                        <div
                            className="absolute inset-0 h-full w-full rounded-full bg-gray-100/50 dark:bg-neutral-800/50 transition-all duration-200"
                        />
                    )}
                    <span className="relative z-20">{item.name}</span>
                </a>
            ))}
        </div>
    );
};

export const MobileNav = ({ children, className, visible }: MobileNavProps) => {
    return (
        <div
            className={cn(
                "relative z-50 mx-auto flex w-full max-w-[calc(100vw-1rem)] flex-col items-center justify-between px-2 py-2 lg:hidden bg-white/60 border border-neutral-200 rounded-lg",
                "transition-[width,padding,transform,backdrop-filter,border-radius] duration-500 ease-in-out",
                "scroll:w-[97%] scroll:px-2 scroll:backdrop-blur-md scroll:translate-y-1 scroll:rounded-xl",
                "w-full px-2",
                className,
            )}
        >
            {children}
        </div>
    );
};

export const MobileNavHeader = ({
    children,
    className,
}: MobileNavHeaderProps) => {
    return (
        <div
            className={cn(
                "flex w-full flex-row items-center justify-between px-2",
                className,
            )}
        >
            {children}
        </div>
    );
};

export const MobileNavMenu = ({
    children,
    className,
    isOpen,
    onClose,
}: MobileNavMenuProps) => {
    return (
        <>
            {/* Backdrop */}
            <div
                className={cn(
                    "fixed inset-0 bg-black/20 backdrop-blur-sm z-40",
                    "transition-opacity duration-300",
                    isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
                onClick={onClose}
            />

            {/* Menu */}
            <div
                className={cn(
                    "fixed inset-y-0 right-0 w-full max-w-[100vw] z-50 bg-white/80 dark:bg-neutral-950",
                    "transition-transform duration-300 ease-in-out",
                    isOpen ? "translate-x-0" : "translate-x-full",
                    className
                )}
            >
                <div className="h-full w-full overflow-y-auto">
                    {children}
                </div>
            </div>
        </>
    );
};

export const MobileNavToggle = ({
    isOpen,
    onClick,
}: {
    isOpen: boolean;
    onClick: () => void;
}) => {
    return (
        <button
            onClick={onClick}
            className="relative z-50 p-2 rounded-lg hover:bg-gray-100/50 transition-all duration-200 touch-manipulation active:scale-95"
            aria-label={isOpen ? "Close menu" : "Open menu"}
        >
            <div className="transition-transform duration-200">
                {!isOpen && (
                    <IconMenu2 className="w-5 h-5 md:w-6 md:h-6 text-black dark:text-white" />
                )}
            </div>
        </button>
    );
};

export const NavbarLogo = () => {
    return (
        <a
            href="#"
            className="relative z-20 mr-2 md:mr-4 flex items-center space-x-2 px-1 md:px-2 py-1 text-sm font-normal text-black transition-transform duration-200 hover:scale-105"
        >
            <Image
                src="/assets/aimlogo.png"
                alt="logo"
                width={35}
                height={35}
                className="md:w-[50px] md:h-[50px]"
                quality={100}
                loading="lazy"
            />
        </a>
    );
};

export const NavbarButton = ({
    href,
    as: Tag = "a",
    children,
    className,
    variant = "primary",
    ...props
}: {
    href?: string;
    as?: React.ElementType;
    children: React.ReactNode;
    className?: string;
    variant?: "primary" | "secondary" | "dark" | "gradient";
} & (
        | React.ComponentPropsWithoutRef<"a">
        | React.ComponentPropsWithoutRef<"button">
    )) => {
    const baseStyles =
        "px-3 md:px-4 py-2 md:py-2.5 rounded-md text-xs md:text-sm font-bold relative cursor-pointer transition-all duration-200 inline-block text-center touch-manipulation hover:-translate-y-0.5 active:scale-95";

    const variantStyles = {
        primary:
            "bg-white/90 text-black shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] hover:bg-white/95",
        secondary: "bg-transparent text-black dark:text-white hover:bg-gray-100/20",
        dark: "bg-black/90 text-white shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] hover:bg-black/95",
        gradient:
            "bg-gradient-to-b from-blue-500/90 to-blue-700/90 text-white shadow-[0px_2px_0px_0px_rgba(255,255,255,0.3)_inset] hover:from-blue-500 hover:to-blue-700",
    };

    return (
        <Tag
            href={href || undefined}
            className={cn(baseStyles, variantStyles[variant], className)}
            {...props}
        >
            {children}
        </Tag>
    );
};