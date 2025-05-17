"use client"

import { Table } from "@tanstack/react-table"
import { CustomInput } from "../ui/custom-input"
import { useAppSelector } from "@/hooks/useAppSelector"
import { useTheme } from "next-themes"
import { Search } from "lucide-react"

interface DataTableToolbarProps<TData> {
    table: Table<TData>
}

export function DataTableToolbar<TData>({
    table,
}: DataTableToolbarProps<TData>) {
    const { theme } = useTheme()
    const activeUserType = useAppSelector((state) => state.user.activeUserType)

    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center p-2">
                <CustomInput
                    placeholder={`Search ${activeUserType === "CLIENT" ? "Client" : activeUserType === "OFFICE_STAFF" ? "Staff" : activeUserType === "CARE_WORKER" ? "Care Worker" : "User"}...`}
                    value={(table.getState().globalFilter as string) ?? ""}
                    onChange={(value: string) => table.setGlobalFilter(value)}
                    className={`w-[200px] ${theme === "dark" ? "bg-zinc-800" : "bg-neutral-100/70"}`}
                    icon={<Search className="h-4 w-4" />}
                />
            </div>
        </div>
    )
} 