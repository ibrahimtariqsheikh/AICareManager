"use client"

import React, { useRef, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Textarea } from "@/components/ui/textarea"

interface AutoResizeTextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
    value: string
    onChange: (value: string) => void
    className?: string
    minRows?: number
    maxRows?: number
}

export const AutoResizeTextarea = React.forwardRef<HTMLTextAreaElement, AutoResizeTextareaProps>(
    ({ value, onChange, className, minRows = 1, maxRows = 5, ...props }, ref) => {
        const textareaRef = useRef<HTMLTextAreaElement | null>(null)
        const mergedRef = (node: HTMLTextAreaElement) => {
            textareaRef.current = node
            if (typeof ref === "function") {
                ref(node)
            } else if (ref) {
                ref.current = node
            }
        }

        useEffect(() => {
            const textarea = textareaRef.current
            if (!textarea) return

            // Reset height to auto to get the correct scrollHeight
            textarea.style.height = "auto"

            // Calculate line height based on the computed style
            const lineHeight = parseInt(getComputedStyle(textarea).lineHeight) || 20

            // Calculate min and max heights
            const minHeight = minRows * lineHeight
            const maxHeight = maxRows * lineHeight

            // Set the height based on scrollHeight, but constrained between min and max
            const newHeight = Math.min(Math.max(textarea.scrollHeight, minHeight), maxHeight)
            textarea.style.height = `${newHeight}px`
        }, [value, minRows, maxRows])

        const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
            onChange(e.target.value)
        }

        return (
            <Textarea
                ref={mergedRef}
                value={value}
                onChange={handleChange}
                className={cn("resize-none overflow-hidden", className)}
                {...props}
            />
        )
    }
)

AutoResizeTextarea.displayName = "AutoResizeTextarea"
