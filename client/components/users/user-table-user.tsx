"use client"
import type { User } from "@/types/prismaTypes"
import { columns } from "./columns"
import { DataTable } from "./data-table"
import { useTheme } from "next-themes"

interface UserTableUserProps {
    users: User[]
    isLoading: boolean
}

export function UserTableUser({ users, isLoading }: UserTableUserProps) {
    const { theme } = useTheme()

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className={`animate-spin rounded-full h-8 w-8 border-b-2 ${theme === "dark" ? "border-gray-100" : "border-gray-900"}`}></div>
            </div>
        )
    }

    return <div className="m-0 p-0">
        <DataTable columns={columns} data={users} />
    </div>
}
