"use client";

import * as React from "react";

import { useIsMobile } from "../../hooks/use-mobile";

const SIDEBAR_COOKIE_NAME = "sidebar:state";
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

type SidebarContext = {
    state: "expanded" | "collapsed";
    open: boolean;
    setOpen: (open: boolean) => void;
    openMobile: boolean;
    setOpenMobile: (open: boolean) => void;
    isMobile: boolean;
    toggleSidebar: () => void;
};

const SidebarContext = React.createContext<SidebarContext | null>(null);

export function useSidebar() {
    const context = React.useContext(SidebarContext);
    if (!context) {
        throw new Error("useSidebar must be used within a SidebarProvider");
    }
    return context;
}

interface SidebarProviderProps {
    children: React.ReactNode;
    defaultOpen?: boolean;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    className?: string;
    style?: React.CSSProperties;
}

export function SidebarProvider({
    children,
    defaultOpen = true,
    open: openProp,
    onOpenChange: setOpenProp,
    className,
    style,
    ...props
}: SidebarProviderProps) {
    const isMobile = useIsMobile();
    const [openMobile, setOpenMobile] = React.useState(false);

    // Internal state of the sidebar
    const [_open, _setOpen] = React.useState(defaultOpen);
    const open = openProp ?? _open;
    const setOpen = React.useCallback(
        (value: boolean | ((value: boolean) => boolean)) => {
            const openState = typeof value === "function" ? value(open) : value;
            if (setOpenProp) {
                setOpenProp(openState);
            } else {
                _setOpen(openState);
            }

            // Set cookie to keep sidebar state
            if (typeof document !== "undefined") {
                document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
            }
        },
        [setOpenProp, open]
    );

    // Helper to toggle the sidebar
    const toggleSidebar = React.useCallback(() => {
        return isMobile ? setOpenMobile((open) => !open) : setOpen((open) => !open);
    }, [isMobile, setOpen, setOpenMobile]);

    // State for expanded/collapsed
    const state = open ? "expanded" : "collapsed";

    const contextValue = React.useMemo<SidebarContext>(
        () => ({
            state,
            open,
            setOpen,
            isMobile,
            openMobile,
            setOpenMobile,
            toggleSidebar,
        }),
        [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar]
    );

    return (
        <SidebarContext.Provider value={contextValue}>
            <div
                className={`group/sidebar-wrapper flex min-h-screen w-full ${className || ""}`}
                style={style}
                {...props}
            >
                {children}
            </div>
        </SidebarContext.Provider>
    );
}
