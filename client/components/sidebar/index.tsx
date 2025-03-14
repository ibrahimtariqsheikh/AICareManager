import React from "react";
import { sidebarOpt } from "../../lib/constants";
import MenuOptions from "./menu-options";

type Props = {
    id: string;
    type: "chatbot" | "workspace";
};

const Sidebar = async ({ id, type }: Props) => {
    return (
        <>
            {/* For Desktop */}
            <MenuOptions
                defaultOpen={true}
                id={id}
                sidebarOpt={sidebarOpt}
                type={type}
            />
            {/* For Mobile */}
            <MenuOptions id={id} sidebarOpt={sidebarOpt} type={type} />
        </>
    );
};

export default Sidebar;