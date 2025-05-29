"use client"

import { Table } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"

interface DataTablePaginationProps<TData> {
    table: Table<TData>
}

export function DataTablePagination<TData>({
    table,
}: DataTablePaginationProps<TData>) {
    return (
        <div className="flex flex-col sm:flex-row items-center justify-between p-4 gap-4">
            <div className="text-sm text-muted-foreground">
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
                <div className="hidden sm:flex items-center justify-center">
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
                <div className="sm:hidden text-sm">
                    Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    Next
                </Button>
            </div>
        </div>
    )
} 