"use client"
import type { User } from "@/types/prismaTypes"
import { columns } from "./columns"
import { DataTable } from "./data-table"

interface UserTableUserProps {
    users: User[]
    isLoading: boolean
}

export function UserTableUser({ users, isLoading }: UserTableUserProps) {
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
        )
    }

    return <DataTable columns={columns} data={users} />
}
