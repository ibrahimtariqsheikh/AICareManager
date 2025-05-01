"use client"


import { useDispatch, useSelector } from "react-redux"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Filter, Calendar, FileText, AlertTriangle, Eye } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { DataTable } from "@/components/ui/data-table"
import { ReportDetails } from "./report-details"
import { setFilter, setSelectedReport } from "@/state/slices/reportSlice"
import type { AppDispatch, RootState } from "@/state/redux"
import type { User } from "@/types/prismaTypes"

export const Reports = ({ user }: { user: User }) => {
    const dispatch = useDispatch<AppDispatch>()
    const { reports = [], isLoading = false, error = null, filter = {}, selectedReport = null } = useSelector((state: RootState) => state.report)

    const handleFilterChange = (key: string, value: string) => {
        dispatch(setFilter({ ...filter, [key]: value }))
    }

    const handleReportSelect = (reportId: string) => {
        const report = reports.find((r) => r.id === reportId)
        if (report) {
            dispatch(setSelectedReport(report))
        }
    }

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
            <CardHeader>
                <CardTitle className="text-2xl font-bold">Reports</CardTitle>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="all" className="w-full">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                        <TabsList>
                            <TabsTrigger value="all">All Reports</TabsTrigger>
                            <TabsTrigger value="completed">Completed</TabsTrigger>
                            <TabsTrigger value="flagged">Flagged</TabsTrigger>
                            <TabsTrigger value="draft">Drafts</TabsTrigger>
                        </TabsList>

                        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                            <div className="relative w-full sm:w-64">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search reports..."
                                    className="pl-8"
                                    value={filter?.search || ""}
                                    onChange={(e) => handleFilterChange("search", e.target.value)}
                                />
                            </div>

                            <Select value={filter?.status || "all"} onValueChange={(value) => handleFilterChange("status", value)}>
                                <SelectTrigger className="w-full sm:w-40">
                                    <div className="flex items-center">
                                        <Filter className="mr-2 h-4 w-4" />
                                        <SelectValue placeholder="Status" />
                                    </div>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Statuses</SelectItem>
                                    <SelectItem value="COMPLETED">Completed</SelectItem>
                                    <SelectItem value="DRAFT">Draft</SelectItem>
                                    <SelectItem value="EDITED">Edited</SelectItem>
                                    <SelectItem value="FLAGGED">Flagged</SelectItem>
                                    <SelectItem value="REVIEWED">Reviewed</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={filter?.dateRange || "all"} onValueChange={(value) => handleFilterChange("dateRange", value)}>
                                <SelectTrigger className="w-full sm:w-40">
                                    <div className="flex items-center">
                                        <Calendar className="mr-2 h-4 w-4" />
                                        <SelectValue placeholder="Date Range" />
                                    </div>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Time</SelectItem>
                                    <SelectItem value="today">Today</SelectItem>
                                    <SelectItem value="week">This Week</SelectItem>
                                    <SelectItem value="month">This Month</SelectItem>
                                    <SelectItem value="quarter">This Quarter</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <TabsContent value="all" className="mt-0">
                        {isLoading ? (
                            <div className="flex justify-center items-center h-64">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                            </div>
                        ) : error ? (
                            <div className="flex justify-center items-center h-64 text-red-500">
                                <AlertTriangle className="h-5 w-5 mr-2" />
                                {error}
                            </div>
                        ) : reports.length === 0 ? (
                            <div className="flex flex-col justify-center items-center h-64 text-muted-foreground">
                                <FileText className="h-12 w-12 mb-4" />
                                <p className="text-lg font-medium">No reports found</p>
                                <p className="text-sm">Try adjusting your filters or create a new report</p>
                            </div>
                        ) : selectedReport ? (
                            <ReportDetails report={selectedReport} onBack={() => dispatch(setSelectedReport(null))} />
                        ) : (
                            <DataTable columns={columns} data={reports} />
                        )}
                    </TabsContent>

                    <TabsContent value="completed" className="mt-0">
                        {!isLoading && !error && !selectedReport && (
                            <DataTable columns={columns} data={reports.filter((r) => r.status === "COMPLETED")} />
                        )}
                    </TabsContent>

                    <TabsContent value="flagged" className="mt-0">
                        {!isLoading && !error && !selectedReport && (
                            <DataTable columns={columns} data={reports.filter((r) => r.status === "FLAGGED")} />
                        )}
                    </TabsContent>

                    <TabsContent value="draft" className="mt-0">
                        {!isLoading && !error && !selectedReport && (
                            <DataTable columns={columns} data={reports.filter((r) => r.status === "DRAFT")} />
                        )}
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    )
}
