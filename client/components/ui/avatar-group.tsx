"use client"
import { Avatar, AvatarFallback, AvatarImage } from "./avatar"
import { cn } from "../../lib/utils"

interface AvatarGroupProps {
    users: Array<{
        name: string
        email: string
        image?: string
    }>
    max?: number
    size?: "sm" | "md" | "lg"
    className?: string
}

export function AvatarGroup({ users, max = 3, size = "md", className }: AvatarGroupProps) {
    const visibleUsers = users.slice(0, max)
    const remainingCount = users.length - max

    const sizeClasses = {
        sm: "h-6 w-6 text-xs",
        md: "h-8 w-8 text-sm",
        lg: "h-10 w-10 text-base",
    }

    const avatarSize = sizeClasses[size]

    return (
        <div className={cn("flex -space-x-2", className)}>
            {visibleUsers.map((user, index) => (
                <Avatar
                    key={index}
                    className={cn(avatarSize, "border-2 border-background ring-0", "transition-transform hover:translate-y-1")}
                >
                    {user.image ? <AvatarImage src={user.image} alt={user.name} /> : null}
                    <AvatarFallback className="bg-primary/10 text-primary">
                        {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                    </AvatarFallback>
                </Avatar>
            ))}

            {remainingCount > 0 && (
                <Avatar className={cn(avatarSize, "border-2 border-background bg-muted text-muted-foreground")}>
                    <AvatarFallback>+{remainingCount}</AvatarFallback>
                </Avatar>
            )}
        </div>
    )
}

