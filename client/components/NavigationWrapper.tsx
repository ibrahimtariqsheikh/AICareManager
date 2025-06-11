'use client';

import { usePathname } from "next/navigation";
import { MyNavbar } from "./Navbar";
import { cn } from "@/lib/utils";

export function NavigationWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isHomePage = pathname === "/";

    return (
        <div className="flex flex-col min-h-screen w-full">
            {!isHomePage && (
                <div className="fixed top-0 left-0 right-0 z-50 bg-transparent">
                    <div className="mt-12">
                        <MyNavbar showHero={false} />
                    </div>
                </div>
            )}
            <div className={cn("flex-1 w-full", isHomePage ? "pt-0" : "pt-36")}>
                {children}
            </div>
        </div>
    );
} 