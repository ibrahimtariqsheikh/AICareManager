"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Plus, Search, X } from 'lucide-react'
import { Button } from "../../ui/button"
import { Tabs, TabsList, TabsTrigger } from "../../ui/tabs"
import { Input } from "../../ui/input"
import { motion, AnimatePresence } from "framer-motion"
import { type StaffMember, type Client, type EventType, type AppointmentEvent } from "./types"

interface CalendarHeaderProps {
    activeView: "day" | "week" | "month"
    handleViewChange: (view: "day" | "week" | "month") => void
    handleNavigate: (action: "PREV" | "NEXT" | "TODAY") => void
    formatDateRange: () => string
    sidebarMode: "staff" | "clients"
    setSidebarMode: (mode: "staff" | "clients") => void
    isSearchOpen: boolean
    toggleSearch: () => void
    setEditingEvent: (event: any) => void
    setIsFormOpen: (isOpen: boolean) => void
    events: AppointmentEvent[]
    staffMembers: StaffMember[]
    clients: Client[]
    eventTypes: EventType[]
    searchQuery: string
    searchInputRef: React.RefObject<HTMLInputElement>
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
    searchInputRef,
    setSearchQuery,
    spaceTheme = false,
}: CalendarHeaderProps) {
    const tabsClasses = spaceTheme
        ? "bg-slate-800/50 backdrop-blur-sm border border-indigo-500/20 text-white"
        : "";

    const tabTriggerClasses = spaceTheme
        ? "data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
        : "";

    const buttonClasses = spaceTheme
        ? "text-white hover:bg-indigo-500/20"
        : "text-gray-500";

    return (
        <div className="flex items-center justify-between mb-4 z-10">
            <Tabs
                defaultValue={activeView}
                value={activeView}
                onValueChange={(value) => handleViewChange(value as "day" | "week" | "month")}
                className="w-[300px]"
            >
                <TabsList className={`grid w-[200px] grid-cols-3 ${tabsClasses}`}>
                    <TabsTrigger value="day" className={tabTriggerClasses}>Day</TabsTrigger>
                    <TabsTrigger value="week" className={tabTriggerClasses}>Week</TabsTrigger>
                    <TabsTrigger value="month" className={tabTriggerClasses}>Month</TabsTrigger>
                </TabsList>
            </Tabs>

            <div className="flex items-center gap-2">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button variant="ghost" size="icon" onClick={() => handleNavigate("PREV")} className={buttonClasses}>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                </motion.div>

                <span className={`text-sm font-medium ${spaceTheme ? 'text-white' : 'text-gray-500'}`}>{formatDateRange()}</span>

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button variant="ghost" size="icon" onClick={() => handleNavigate("NEXT")} className={buttonClasses}>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </motion.div>

                <Tabs
                    defaultValue="staff"
                    value={sidebarMode}
                    onValueChange={(value) => {
                        setSidebarMode(value as "staff" | "clients")
                    }}
                >
                    <TabsList className={tabsClasses}>
                        <TabsTrigger value="staff" className={tabTriggerClasses}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="mr-1"
                            >
                                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                                <circle cx="9" cy="7" r="4" />
                                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                            </svg>
                            Staff
                        </TabsTrigger>
                        <TabsTrigger value="clients" className={tabTriggerClasses}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="mr-1"
                            >
                                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                                <circle cx="12" cy="7" r="4" />
                            </svg>
                            Clients
                        </TabsTrigger>
                    </TabsList>
                </Tabs>

                <motion.div whileHover={{ scale: 1.1, rotate: isSearchOpen ? 90 : 0 }} whileTap={{ scale: 0.9 }}>
                    <Button
                        variant="ghost"
                        size="icon"
                        className={`transition-colors ${isSearchOpen ? (spaceTheme ? "text-purple-400" : "text-blue-500") : buttonClasses}`}
                        onClick={toggleSearch}
                    >
                        <Search className="h-4 w-4" />
                    </Button>
                </motion.div>

                <Button
                    variant={spaceTheme ? "outline" : "default"}
                    className={spaceTheme
                        ? "bg-indigo-600/80 text-white hover:bg-indigo-700/80 border-indigo-500/50 backdrop-blur-sm ml-2"
                        : "bg-black text-white hover:bg-gray-800 ml-2"}
                    onClick={() => {
                        setEditingEvent(null)
                        setIsFormOpen(true)
                    }}
                >
                    Add Appointment
                    <Plus className="h-4 w-4 ml-2" />
                </Button>
            </div>

            {isSearchOpen && (
                <AnimatePresence>
                    <motion.div
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: "200px", opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className="relative mb-4 absolute right-0 top-16 z-10"
                    >
                        <Input
                            ref={searchInputRef}
                            type="text"
                            placeholder="Search appointments..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={`h-8 pr-8 text-sm ${spaceTheme ? 'bg-slate-800/70 border-indigo-500/30 text-white placeholder:text-white/50' : ''}`}
                        />
                        <Button
                            variant="ghost"
                            size="icon"
                            className={`absolute right-0 top-0 h-8 w-8 ${spaceTheme ? 'text-white/70' : 'text-gray-500'}`}
                            onClick={() => setSearchQuery("")}
                        >
                            <X className="h-3 w-3" />
                        </Button>
                    </motion.div>
                </AnimatePresence>
            )}
        </div>
    )
}
