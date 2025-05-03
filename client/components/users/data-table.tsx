"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
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

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CustomInput } from "../ui/custom-input"
import { useAppSelector } from "@/hooks/useAppSelector"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
}

export function DataTable<TData extends { id: string }, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})
    const router = useRouter()

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

    const activeUserType = useAppSelector((state) => state.user.activeUserType)

    return (
        <div className="space-y-4 bg-white border border-neutral-300 rounded-lg p-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <CustomInput
                        placeholder={`Search ${activeUserType === "CLIENT" ? "Client" : activeUserType === "OFFICE_STAFF" ? "Staff" : activeUserType === "CARE_WORKER" ? "Care Worker" : "User"}...`}
                        value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                        onChange={(value: string) => table.getColumn("name")?.setFilterValue(value)}
                        className="w-[200px] bg-neutral-100/70"
                    />
                </div>

            </div>
            <div className="border-0 shadow-none">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
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
                                    className="cursor-pointer"
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell
                                            key={cell.id}
                                            className={cell.column.id === 'actions' ? 'cursor-default' : ''}
                                        >
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-between">
                <div className="flex-1 text-sm text-muted-foreground">
                    {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s)
                    selected.
                </div>
                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>
                    <div className="flex items-center justify-center">
                        {Array.from({ length: table.getPageCount() }, (_, i) => i + 1).map((page) => (
                            <Button
                                key={page}
                                variant={table.getState().pagination.pageIndex + 1 === page ? "outline" : "ghost"}
                                size="sm"
                                className="mx-0.5 h-8 w-8"
                                onClick={() => table.setPageIndex(page - 1)}
                            >
                                {page}
                            </Button>
                        ))}
                    </div>
                    <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                        Next
                    </Button>
                </div>
            </div>
        </div>
    )
}
