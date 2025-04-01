import { Badge } from "./badge"
import { cn } from "../../lib/utils"
import { CheckCircle, Clock, AlertCircle, X } from "lucide-react"

type StatusType = "PENDING" | "ACCEPTED" | "EXPIRED" | "CANCELED" | "ACTIVE" | "INACTIVE" | string

interface StatusBadgeProps {
    status: StatusType
    className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
    const getStatusConfig = (status: StatusType) => {
        switch (status) {
            case "PENDING":
                return {
                    text: "Pending",
                    className: "text-yellow-600 bg-yellow-50 border-yellow-100",
                }
            case "ACCEPTED":
            case "ACTIVE":
                return {
                    text: "Accepted",
                    className: "text-green-600 bg-green-50 border-green-100",
                }
            case "EXPIRED":
                return {
                    text: "Expired",
                    className: "text-orange-600 bg-orange-50 border-orange-100",
                }
            case "CANCELED":
            case "INACTIVE":
                return {
                    text: "Inactive",
                    className: "text-red-600 bg-red-50 border-red-100",
                }
            default:
                return {
                    text: status || "Unknown",
                    className: "text-gray-600 bg-gray-50 border-gray-100",
                }
        }
    }

    const { text, className: statusClassName } = getStatusConfig(status)

    if (status === "ACCEPTED" || status === "ACTIVE") {
        return (
            <div
                className={cn(
                    "inline-flex items-center gap-1.5 px-2 py-0.5 text-sm font-medium rounded-sm",
                    statusClassName,
                    className,
                )}
            >
                <CheckCircle className="h-3.5 w-3.5" />
                <span>{text}</span>
            </div>
        )
    }

    return (
        <div
            className={cn("inline-flex items-center px-2 py-0.5 text-sm font-medium rounded-sm", statusClassName, className)}
        >
            {text}
        </div>
    )
}

