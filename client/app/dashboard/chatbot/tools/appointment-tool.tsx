import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useAppSelector } from "@/state/redux"
import { ToolInvocation } from "ai"

export function AppointmentTool(
    toolInvocation: ToolInvocation
) {
    const { agencySchedules } = useAppSelector((state) => state.schedule)
    const { clients } = useAppSelector((state) => state.user)

    if (toolInvocation.state !== "result" || !('result' in toolInvocation)) {
        return null
    }

    const client_name = toolInvocation.result.client_name
    const client = clients.find((client) => client.fullName === client_name)
    const schedule = agencySchedules.find((schedule) => schedule.clientId === client?.id)

    if (!client) {
        return <div className="text-center py-4 text-gray-500">No client found with the name {client_name}</div>
    }

    if (!schedule) {
        return <div className="text-center py-4 text-gray-500">No appointments found for {client.fullName}</div>
    }

    const formatTime = (time: string) => {
        return new Date(`2000-01-01T${time}`).toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        })
    }

    return (
        <div className="flex group my-4">
            <div className="flex flex-col items-center mr-3">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                <div className="w-0.5 h-full bg-gray-200"></div>
            </div>
            <div className="flex-1 pb-4">
                <div
                    className={cn(
                        "border-l-4 rounded-r-md p-2 transition-all",
                        schedule.status === "CONFIRMED" && "border-l-green-500 bg-green-50",
                        schedule.status === "PENDING" && "border-l-blue-500 bg-blue-50",
                        schedule.status === "CANCELED" && "border-l-red-500 bg-red-50",
                        schedule.status === "COMPLETED" && "border-l-blue-500 bg-blue-50",
                    )}
                >
                    <div className="flex justify-between items-start">
                        <div className="text-sm text-gray-500">
                            {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}
                        </div>
                        <Badge
                            className={cn(
                                "uppercase text-xs font-semibold",
                                schedule.status === "CONFIRMED" && "bg-green-100 text-green-800 border-green-200",
                                schedule.status === "PENDING" && "bg-blue-100 text-blue-800 border-blue-200",
                                schedule.status === "CANCELED" && "bg-red-100 text-red-800 border-red-200",
                                schedule.status === "COMPLETED" && "bg-blue-100 text-blue-800 border-blue-200",
                            )}
                        >
                            {schedule.status.toLowerCase()}
                        </Badge>
                    </div>

                    <div className="mt-1 space-y-1">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Care Worker:</span>
                            <span className="font-medium">{schedule.userId}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Client:</span>
                            <span className="font-medium">{client.fullName}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Date:</span>
                            <span className="font-medium">{new Date(schedule.date).toLocaleDateString()}</span>
                        </div>
                    </div>

                    {schedule.notes && (
                        <div className="mt-1 text-xs text-gray-600 bg-white p-1.5 rounded border">{schedule.notes}</div>
                    )}
                </div>
            </div>
        </div>
    )
}
