"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, X, Clock, ArrowRight } from 'lucide-react'
import { ScrollArea } from "@/components/ui/scroll-area"

interface SearchDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSelect: (query: string) => void
}

export function SearchDialog({ open, onOpenChange, onSelect }: SearchDialogProps) {
    const [searchQuery, setSearchQuery] = useState("")
    const [isSearching, setIsSearching] = useState(false)
    const [results, setResults] = useState<string[]>([])

    // Mock recent searches
    const recentSearches = [
        "Patient care guidelines",
        "Medication schedule",
        "Care plan templates",
        "HIPAA compliance",
    ]

    const handleSearch = () => {
        if (!searchQuery.trim()) return

        setIsSearching(true)

        // Simulate search results
        setTimeout(() => {
            const mockResults = [
                `${searchQuery} best practices`,
                `How to implement ${searchQuery}`,
                `${searchQuery} documentation`,
                `${searchQuery} guidelines`,
            ]
            setResults(mockResults)
            setIsSearching(false)
        }, 1000)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSearch()
        }
    }

    const handleSelect = (query: string) => {
        onSelect(query)
        onOpenChange(false)
    }

    const clearSearch = () => {
        setSearchQuery("")
        setResults([])
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] p-0">
                <DialogHeader className="px-4 pt-4 pb-2">
                    <DialogTitle>Search</DialogTitle>
                </DialogHeader>

                <div className="px-4 pb-2 relative">
                    <Search className="absolute left-6 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search for care resources..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="pl-10 pr-10"
                        autoFocus
                    />
                    {searchQuery && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-6 top-2 h-6 w-6"
                            onClick={clearSearch}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    )}
                </div>

                <ScrollArea className="max-h-[60vh]">
                    {isSearching ? (
                        <div className="p-8 text-center">
                            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                            <p className="mt-2 text-sm text-muted-foreground">Searching...</p>
                        </div>
                    ) : results.length > 0 ? (
                        <div className="py-2">
                            <h3 className="px-4 text-sm font-medium text-muted-foreground mb-2">Results</h3>
                            {results.map((result, i) => (
                                <Button
                                    key={i}
                                    variant="ghost"
                                    className="w-full justify-start px-4 py-6 h-auto"
                                    onClick={() => handleSelect(result)}
                                >
                                    <Search className="mr-2 h-4 w-4" />
                                    <span>{result}</span>
                                    <ArrowRight className="ml-auto h-4 w-4 opacity-60" />
                                </Button>
                            ))}
                        </div>
                    ) : (
                        <div className="py-2">
                            <h3 className="px-4 text-sm font-medium text-muted-foreground mb-2">Recent Searches</h3>
                            {recentSearches.map((search, i) => (
                                <Button
                                    key={i}
                                    variant="ghost"
                                    className="w-full justify-start px-4 py-6 h-auto"
                                    onClick={() => handleSelect(search)}
                                >
                                    <Clock className="mr-2 h-4 w-4" />
                                    <span>{search}</span>
                                </Button>
                            ))}
                        </div>
                    )}
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
}
