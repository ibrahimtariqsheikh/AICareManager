"use client"

import { Button } from "@/components/ui/button"
import { SUGGESTIONS } from "./chat-suggestions"

export function SuggestionBar({ onSelect }: { onSelect: (text: string) => void }) {
    return (
        <div className="grid grid-cols-4 gap-2 mb-2 overflow-x-auto pb-2">
            {SUGGESTIONS.map((suggestion, index) => (
                <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2 whitespace-nowrap"
                    onClick={() => onSelect(suggestion.prompt)}
                >
                    <suggestion.icon className="h-4 w-4" />
                    {suggestion.text}
                </Button>
            ))}
        </div>
    )
}
