import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "./alert"
import { cn } from "@/lib/utils"
import { FetchBaseQueryError } from "@reduxjs/toolkit/query"
import { SerializedError } from "@reduxjs/toolkit"

interface ErrorDisplayProps {
    error: string | { status: string; error: string } | FetchBaseQueryError | SerializedError | null
    className?: string
    title?: string
}

export function ErrorDisplay({ error, className, title = "Error" }: ErrorDisplayProps) {
    if (!error) return null

    let errorMessage = "An unexpected error occurred"

    if (typeof error === "string") {
        errorMessage = error
    } else if ('status' in error && 'data' in error) {
        // Handle FetchBaseQueryError
        const data = error.data as any
        errorMessage = data?.message || data?.error || `Error ${error.status}`
    } else if ('message' in error) {
        // Handle SerializedError
        errorMessage = error.message || "An unexpected error occurred"
    } else if ('error' in error) {
        // Handle custom error object
        errorMessage = error.error
    }

    return (
        <Alert variant="destructive" className={cn("animate-in fade-in duration-300", className)}>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{title}</AlertTitle>
            <AlertDescription>
                {errorMessage}
            </AlertDescription>
        </Alert>
    )
} 