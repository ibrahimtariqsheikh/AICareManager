"use client"

import React from "react"
import { useDispatch, useSelector } from "react-redux"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Search, Filter, Calendar, FileText, AlertTriangle, Eye } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { DataTable } from "@/components/ui/data-table"
import { ReportDetails } from "./report-details"
import { setFilter, setSelectedReport } from "@/state/slices/reportSlice"
import type { AppDispatch, RootState } from "@/state/redux"
import type { User } from "@/types/prismaTypes"
import { CustomInput } from "@/components/ui/custom-input"
import { CustomSelect } from "@/components/ui/custom-select"

interface Report {
    id: string;
    clientId: string;
    agencyId: string;
    userId: string;
    visitTypeId: string;
    title: string;
    condition: string;
    summary: string;
    checkInTime: string;
    checkOutTime: string | null;
    createdAt: string;
    checkInDistance: number | null;
    checkOutDistance: number | null;
    checkInLocation: string | null;
    checkOutLocation: string | null;
    signatureImageUrl: string | null;
    status: string;
    lastEditedAt: string | null;
    lastEditedBy: string | null;
    lastEditReason: string | null;
}

export const Reports = ({ user }: { user: User }) => {
    const dispatch = useDispatch<AppDispatch>()
    const { isLoading = false, error = null, filter = {}, selectedReport = null } = useSelector((state: RootState) => state.report)
    const userReports = user.clientReports || [];

    const handleFilterChange = (key: string, value: string) => {
        dispatch(setFilter({ ...filter, [key]: value }))
    }

    const handleReportSelect = (reportId: string) => {
        const report = userReports.find((r: Report) => r.id === reportId)
        if (report) {
            dispatch(setSelectedReport(report))
        }
    }

    const getFilteredReports = () => {
        let filtered = [...userReports];

        // Filter by search term
        if (filter.search) {
            const searchTerm = filter.search.toLowerCase();
            filtered = filtered.filter(report =>
                report.title?.toLowerCase().includes(searchTerm) ||
                report.condition?.toLowerCase().includes(searchTerm) ||
                report.summary?.toLowerCase().includes(searchTerm)
            );
        }

        // Filter by status
        if (filter.status && filter.status !== 'all') {
            filtered = filtered.filter(report => report.status === filter.status);
        }

        // Filter by date range
        if (filter.dateRange && filter.dateRange !== 'all') {
            const now = new Date();
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

            filtered = filtered.filter(report => {
                const reportDate = new Date(report.checkInTime);

                switch (filter.dateRange) {
                    case 'today':
                        return reportDate >= today;
                    case 'week':
                        const weekAgo = new Date(today);
                        weekAgo.setDate(weekAgo.getDate() - 7);
                        return reportDate >= weekAgo;
                    case 'month':
                        const monthAgo = new Date(today);
                        monthAgo.setMonth(monthAgo.getMonth() - 1);
                        return reportDate >= monthAgo;
                    case 'quarter':
                        const quarterAgo = new Date(today);
                        quarterAgo.setMonth(quarterAgo.getMonth() - 3);
                        return reportDate >= quarterAgo;
                    default:
                        return true;
                }
            });
        }

        return filtered;
    }

    const filteredReports = getFilteredReports();

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "DRAFT":
                return <Badge variant="outline">Draft</Badge>
            case "COMPLETED":
                return (
                    <Badge variant="default" className="bg-green-100 text-green-800">
                        Completed
                    </Badge>
                )
            case "EDITED":
                return (
                    <Badge variant="default" className="bg-blue-100 text-blue-800">
                        Edited
                    </Badge>
                )
            case "FLAGGED":
                return (
                    <Badge variant="default" className="bg-red-100 text-red-800">
                        Flagged
                    </Badge>
                )
            case "REVIEWED":
                return (
                    <Badge variant="default" className="bg-purple-100 text-purple-800">
                        Reviewed
                    </Badge>
                )
            default:
                return <Badge>{status}</Badge>
        }
    }

    const columns = [
        {
            accessorKey: "title",
            header: "Title",
            cell: ({ row }: any) => <div className="font-medium">{row.original.title || "Untitled Report"}</div>,
        },
        {
            accessorKey: "client.fullName",
            header: "Client",
            cell: ({ row }: any) => <div>{row.original.client?.fullName || "Unknown"}</div>,
        },
        {
            accessorKey: "caregiver.fullName",
            header: "Caregiver",
            cell: ({ row }: any) => <div>{row.original.caregiver?.fullName || "Unknown"}</div>,
        },
        {
            accessorKey: "checkInTime",
            header: "Date",
            cell: ({ row }: any) => (
                <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                    {new Date(row.original.checkInTime).toLocaleDateString()}
                </div>
            ),
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }: any) => getStatusBadge(row.original.status),
        },
        {
            id: "actions",
            cell: ({ row }: any) => (
                <Button variant="ghost" size="sm" onClick={() => handleReportSelect(row.original.id)}>
                    <Eye className="h-4 w-4 mr-1" /> View
                </Button>
            ),
        },
    ]

    return (
        <Card className="w-full">
            <CardContent className="mt-6">
                <div className="flex flex-col sm:flex-row gap-2 w-full mb-6">
                    <div className="relative w-full sm:w-64">
                        <CustomInput
                            icon={<Search className="h-4 w-4" />}
                            placeholder="Search reports..."
                            value={filter?.search || ""}
                            onChange={(value) => handleFilterChange("search", value)}
                            variant="default"
                        />
                    </div>

                    <CustomSelect
                        options={[
                            { value: "all", label: "All Statuses" },
                            { value: "COMPLETED", label: "Completed" },
                            { value: "DRAFT", label: "Draft" },
                            { value: "EDITED", label: "Edited" },
                            { value: "FLAGGED", label: "Flagged" },
                            { value: "REVIEWED", label: "Reviewed" }
                        ]}
                        value={filter?.status || "all"}
                        onChange={(value) => handleFilterChange("status", value)}
                        placeholder="Status"
                        variant="default"
                        className="w-full sm:w-40"
                    />

                    <CustomSelect
                        options={[
                            { value: "all", label: "All Time" },
                            { value: "today", label: "Today" },
                            { value: "week", label: "This Week" },
                            { value: "month", label: "This Month" },
                            { value: "quarter", label: "This Quarter" }
                        ]}
                        value={filter?.dateRange || "all"}
                        onChange={(value) => handleFilterChange("dateRange", value)}
                        placeholder="Date Range"
                        variant="default"
                        className="w-full sm:w-40"
                    />
                </div>

                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                    </div>
                ) : error ? (
                    <div className="flex justify-center items-center h-64 text-red-500">
                        <AlertTriangle className="h-5 w-5 mr-2" />
                        {error}
                    </div>
                ) : filteredReports.length === 0 ? (
                    <div className="flex flex-col justify-center items-center h-64 text-muted-foreground">
                        <FileText className="h-12 w-12 mb-4" />
                        <p className="text-lg font-medium">No reports found</p>
                        <p className="text-sm">Try adjusting your filters or create a new report</p>
                    </div>
                ) : selectedReport ? (
                    <ReportDetails report={selectedReport} onBack={() => dispatch(setSelectedReport(null))} />
                ) : (
                    <DataTable columns={columns} data={filteredReports} />
                )}
            </CardContent>
        </Card>
    )
}
