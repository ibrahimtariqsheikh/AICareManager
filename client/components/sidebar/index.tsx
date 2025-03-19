"use client";
import React from "react";
import { sidebarOpt } from "../../lib/constants";
import MenuOptions from "./menu-options";

type Props = {
    id: string;
    type: "chatbot" | "workspace";
    onToggle: () => void;
};

const Sidebar = ({ id, type, onToggle }: Props) => {
    return (
        <>
            {/* For Desktop */}
            <MenuOptions
                defaultOpen={true}
                id={id}
                sidebarOpt={sidebarOpt}
                type={type}
                onToggle={onToggle}
            />
            {/* For Mobile */}
            <MenuOptions id={id} sidebarOpt={sidebarOpt} type={type} onToggle={onToggle} />
        </>
    );
};

export default Sidebar;