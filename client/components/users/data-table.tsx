"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import {
    type ColumnDef,
    type ColumnFiltersState,
    type SortingState,
    type VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import { Card } from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CustomInput } from "../ui/custom-input"
import { useAppSelector } from "@/hooks/useAppSelector"
import { DataTablePagination } from "./data-table-pagination"
import { DataTableToolbar } from "./data-table-toolbar"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
}

export function DataTable<TData extends { id: string }, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({
        role: false,
        email: false
    })
    const [rowSelection, setRowSelection] = React.useState({})
    const router = useRouter()
    const { theme } = useTheme()

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
        globalFilterFn: "includesString",
    })

    const handleRowClick = (userId: string, event: React.MouseEvent) => {
        const targetCell = event.target instanceof HTMLElement && event.target.closest('[role="cell"]')

        if (!targetCell ||
            targetCell === event.currentTarget.lastElementChild ||
            event.target instanceof HTMLElement && (
                event.target.closest('button') ||
                event.target.closest('[role="menuitem"]') ||
                event.target.closest('[role="dialog"]')
            )
        ) {
            return
        }

        router.push(`/dashboard/users/edit/${userId}`)
    }

    return (
        <>
            <DataTableToolbar table={table} />
            <Card className={`${theme === "dark" ? "bg-zinc-900 border-zinc-700" : ""} m-0 p-0`}>
                <div className="rounded-md m-0 p-0 overflow-x-auto">
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id} className="hover:bg-transparent">
                                    {headerGroup.headers.map((header) => {
                                        return (
                                            <TableHead
                                                key={header.id}
                                                colSpan={header.colSpan}
                                                className="py-2 whitespace-nowrap"
                                            >
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                            </TableHead>
                                        )
                                    })}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        data-state={row.getIsSelected() && "selected"}
                                        onClick={(event) => handleRowClick(row.original.id, event)}
                                        className={`cursor-pointer ${theme === "dark" ? "hover:bg-zinc-800" : "hover:bg-neutral-100"}`}
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell
                                                key={cell.id}
                                                className={`py-1.5 ${cell.column.id === 'actions' ? 'cursor-default' : ''} ${theme === "dark" ? "text-gray-200" : "text-gray-900"} whitespace-nowrap`}
                                            >
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length}
                                        className="h-16 text-center"
                                    >
                                        No results.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                <DataTablePagination table={table} />
            </Card>
        </>
    )
}
