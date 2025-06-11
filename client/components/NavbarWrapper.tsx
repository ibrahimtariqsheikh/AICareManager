"use client";

import { usePathname } from "next/navigation";
import { MyNavbar } from "./Navbar";

export function NavbarWrapper() {
    const pathname = usePathname();
    const isHomePage = pathname === "/";

    return <MyNavbar showHero={isHomePage} />;
} 