"use client"
import { ChevronLeft, ChevronRight, Search, X, Plus } from "lucide-react"
import { Button } from "../../ui/button"
import { Input } from "../../ui/input"
import { Tabs, TabsList, TabsTrigger } from "../../ui/tabs"
import { cn } from "../../../lib/utils"
import type { SidebarMode } from "./types"
import { motion, AnimatePresence } from "framer-motion"

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
    searchInputRef: React.RefObject<HTMLInputElement | null>
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
    searchInputRef,
    spaceTheme = false,
}: CalendarHeaderProps) {
    return (
        <div className={`flex flex-col space-y-2 mb-4 z-10 ${spaceTheme ? "text-white" : ""}`}>
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleNavigate("PREV")}
                        className={spaceTheme ? "hover:bg-slate-800" : ""}
                    >
                        <ChevronLeft className="h-4 w-4" />
                        <span className="sr-only">Previous</span>
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleNavigate("NEXT")}
                        className={spaceTheme ? "hover:bg-slate-800" : ""}
                    >
                        <ChevronRight className="h-4 w-4" />
                        <span className="sr-only">Next</span>
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleNavigate("TODAY")}
                        className={`text-xs ${spaceTheme ? "hover:bg-slate-800" : ""}`}
                    >
                        Today
                    </Button>

                </div>
                <div className="flex">                    <h2 className={`text-lg font-semibold ${spaceTheme ? "text-white" : ""}`}>{formatDateRange()}</h2></div>
                <div className="flex items-center space-x-2">
                    <AnimatePresence initial={false} mode="wait">
                        {isSearchOpen ? (
                            <motion.div
                                className="relative"
                                initial={{ width: 0, opacity: 0 }}
                                animate={{ width: "auto", opacity: 1 }}
                                exit={{ width: 0, opacity: 0 }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                key="search-input"
                            >
                                <Input
                                    type="text"
                                    placeholder="Search events, staff, or clients..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className={`w-64 h-8 text-sm border-0 ${spaceTheme ? "bg-slate-800 text-white placeholder:text-slate-400" : ""}`}
                                    ref={searchInputRef}
                                />
                                {searchQuery && (
                                    <motion.button
                                        className="absolute right-8 top-1/2 transform -translate-y-1/2"
                                        onClick={() => setSearchQuery("")}
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0.8, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                                    </motion.button>
                                )}
                                <motion.button
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                                    onClick={toggleSearch}
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.8, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    whileHover={{ scale: 1.1 }}
                                >
                                    <X className={`h-4 w-4 ${spaceTheme ? "text-gray-300 hover:text-white" : "text-gray-500 hover:text-gray-700"}`} />
                                </motion.button>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="search-button"
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                >
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={toggleSearch}
                                        className={spaceTheme ? "hover:bg-slate-800" : ""}
                                    >
                                        <Search className="h-4 w-4" />
                                        <span className="sr-only">Search</span>
                                    </Button>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <div className="flex items-center justify-between">
                <Tabs
                    defaultValue={activeView}
                    value={activeView}
                    onValueChange={(value) => handleViewChange(value as "day" | "week" | "month")}
                    className="w-auto"
                >
                    <TabsList className={cn("grid w-auto grid-cols-3 border-0", spaceTheme ? "bg-slate-800" : "")}>
                        <TabsTrigger value="day" className="text-xs px-3 border-0">
                            Day
                        </TabsTrigger>
                        <TabsTrigger value="week" className="text-xs px-3 border-0">
                            Week
                        </TabsTrigger>
                        <TabsTrigger value="month" className="text-xs px-3 border-0">
                            Month
                        </TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>
        </div>
    )
}
