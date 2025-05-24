"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { SUGGESTIONS } from "../chat-suggestions"

interface SuggestionDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSelect: (suggestion: string) => void
}

export function SuggestionDialog({ open, onOpenChange, onSelect }: SuggestionDialogProps) {
    const handleSelect = (suggestion: string) => {
        onSelect(suggestion)
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[550px] p-0">
                <DialogHeader className="px-4 pt-4 pb-0">
                    <DialogTitle>Suggestions</DialogTitle>
                </DialogHeader>

                <ScrollArea className="max-h-[60vh] mt-2">
                    <div className="py-2">
                        {SUGGESTIONS.map((suggestion, i) => (
                            <Button
                                key={i}
                                variant="ghost"
                                className="w-full justify-start px-4 py-3 h-auto text-left"
                                onClick={() => handleSelect(suggestion.prompt)}
                            >
                                <suggestion.icon className="mr-2 h-4 w-4 flex-shrink-0" />
                                <span>{suggestion.text}</span>
                            </Button>
                        ))}
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
}
