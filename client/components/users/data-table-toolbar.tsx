"use client"

import { Table } from "@tanstack/react-table"
import { useAppSelector } from "@/hooks/useAppSelector"
import { useTheme } from "next-themes"

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
                {/* Toolbar content can be added here if needed */}
            </div>
        </div>
    )
} 