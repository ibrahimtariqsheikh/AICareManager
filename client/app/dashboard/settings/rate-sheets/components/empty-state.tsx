import type { ReactNode } from "react"

interface EmptyStateProps {
    title: string
    description: string
    icon: ReactNode
    action?: ReactNode
}

export function EmptyState({ title, description, icon, action }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg bg-muted/10">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted/30 mb-4">{icon}</div>
            <h3 className="text-lg font-medium mb-1">{title}</h3>
            <p className="text-sm text-muted-foreground mb-4">{description}</p>
            {action}
        </div>
    )
}
