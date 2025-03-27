"use client"
import { ChevronLeft, ChevronRight, Search, X, Plus } from "lucide-react"
import { Button } from "../../ui/button"
import { Input } from "../../ui/input"
import { Tabs, TabsList, TabsTrigger } from "../../ui/tabs"
import { cn } from "../../../lib/utils"
import type { SidebarMode } from "./types"

interface CalendarHeaderProps {
    activeView: "day" | "week" | "month"
    handleViewChange: (view: "day" | "week" | "month") => void
    handleNavigate: (action: "PREV" | "NEXT" | "TODAY") => void
    formatDateRange: () => string
    sidebarMode: SidebarMode
    setSidebarMode: (mode: SidebarMode) => void
    isSearchOpen: boolean
    toggleSearch: () => void
    setEditingEvent: (event: any) => void
    setIsFormOpen: (isOpen: boolean) => void
    searchQuery: string
    setSearchQuery: (query: string) => void
    spaceTheme?: boolean
}

export function CalendarHeader({
    activeView,
    handleViewChange,
    handleNavigate,
    formatDateRange,
    sidebarMode,
    setSidebarMode,
    isSearchOpen,
    toggleSearch,
    setEditingEvent,
    setIsFormOpen,
    searchQuery,
    setSearchQuery,
    spaceTheme = false,
}: CalendarHeaderProps) {
    return (
        <div className={`flex flex-col space-y-2 mb-4 z-10 ${spaceTheme ? "text-white" : ""}`}>
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleNavigate("PREV")}
                        className={spaceTheme ? "border-slate-700 hover:bg-slate-800" : ""}
                    >
                        <ChevronLeft className="h-4 w-4" />
                        <span className="sr-only">Previous</span>
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleNavigate("NEXT")}
                        className={spaceTheme ? "border-slate-700 hover:bg-slate-800" : ""}
                    >
                        <ChevronRight className="h-4 w-4" />
                        <span className="sr-only">Next</span>
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleNavigate("TODAY")}
                        className={`text-xs ${spaceTheme ? "border-slate-700 hover:bg-slate-800" : ""}`}
                    >
                        Today
                    </Button>
                    <h2 className={`text-lg font-semibold ${spaceTheme ? "text-white" : ""}`}>{formatDateRange()}</h2>
                </div>

                <div className="flex items-center space-x-2">
                    {isSearchOpen ? (
                        <div className="relative">
                            <Input
                                type="text"
                                placeholder="Search events, staff, or clients..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className={`w-64 h-8 text-sm ${spaceTheme ? "bg-slate-800 border-slate-700 text-white placeholder:text-slate-400" : ""
                                    }`}
                            />
                            {searchQuery && (
                                <button
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                                    onClick={() => setSearchQuery("")}
                                >
                                    <X className="h-4 w-4 text-gray-400" />
                                </button>
                            )}
                        </div>
                    ) : (
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={toggleSearch}
                            className={spaceTheme ? "border-slate-700 hover:bg-slate-800" : ""}
                        >
                            <Search className="h-4 w-4" />
                            <span className="sr-only">Search</span>
                        </Button>
                    )}

                    <Button
                        size="sm"
                        onClick={() => {
                            setEditingEvent(null)
                            setIsFormOpen(true)
                        }}
                        className="text-xs"
                    >
                        <Plus className="h-3 w-3 mr-1" />
                        New Event
                    </Button>
                </div>
            </div>

            <div className="flex items-center justify-between">
                <Tabs
                    value={activeView}
                    onValueChange={(value) => handleViewChange(value as "day" | "week" | "month")}
                    className="w-auto"
                >
                    <TabsList className={cn("grid w-auto grid-cols-3", spaceTheme ? "bg-slate-800" : "")}>
                        <TabsTrigger value="day" className="text-xs px-3">
                            Day
                        </TabsTrigger>
                        <TabsTrigger value="week" className="text-xs px-3">
                            Week
                        </TabsTrigger>
                        <TabsTrigger value="month" className="text-xs px-3">
                            Month
                        </TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>
        </div>
    )
}

