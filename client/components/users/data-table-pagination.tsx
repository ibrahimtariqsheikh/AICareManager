"use client"

import { Table } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"

interface DataTablePaginationProps<TData> {
    table: Table<TData>
}

export function DataTablePagination<TData>({
    table,
}: DataTablePaginationProps<TData>) {
    const { theme } = useTheme()

    return (
        <div className="flex items-center justify-between p-4">
            <div className={`flex-1 text-sm ${theme === "dark" ? "text-gray-400" : "text-muted-foreground"}`}>
                {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s)
                selected.
            </div>
            <div className="flex items-center space-x-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                    className={theme === "dark" ? "border-zinc-700 hover:bg-zinc-800" : ""}
                >
                    Previous
                </Button>
                <div className="flex items-center justify-center">
                    {Array.from({ length: table.getPageCount() }, (_, i) => i + 1).map((page) => (
                        <Button
                            key={page}
                            variant={table.getState().pagination.pageIndex + 1 === page ? "outline" : "ghost"}
                            size="sm"
                            className={`mx-0.5 h-8 w-8 ${theme === "dark" ? "border-zinc-700 hover:bg-zinc-800" : ""}`}
                            onClick={() => table.setPageIndex(page - 1)}
                        >
                            {page}
                        </Button>
                    ))}
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                    className={theme === "dark" ? "border-zinc-700 hover:bg-zinc-800" : ""}
                >
                    Next
                </Button>
            </div>
        </div>
    )
} 