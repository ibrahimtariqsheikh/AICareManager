import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { ChevronRight } from "lucide-react"

const appointments = [
    {
        id: 1,
        client: {
            name: "Alex Smith",
            avatar: "/placeholder.svg",
            initials: "AS",
        },
        condition: "Hypertension",
        date: "05/04/2025",
        time: "10:00",
        type: "APPOINTMENT",
    },
    {
        id: 2,
        client: {
            name: "Sarah Jones",
            avatar: "/placeholder.svg",
            initials: "SJ",
        },
        condition: "Diabetes",
        date: "06/04/2025",
        time: "09:00",
        type: "WEEKLY_CHECKUP",
    },
    {
        id: 3,
        client: {
            name: "Samuel Dutton",
            avatar: "/placeholder.svg",
            initials: "SD",
        },
        condition: "Asthma",
        date: "07/04/2025",
        time: "10:00",
        type: "HOME_VISIT",
    },
    {
        id: 4,
        client: {
            name: "Carolina Gilson",
            avatar: "/placeholder.svg",
            initials: "CG",
        },
        condition: "Allergy",
        date: "10/04/2025",
        time: "11:30",
        type: "APPOINTMENT",
    },
]

export function UpcomingAppointments() {
    return (
        <div className="space-y-4">
            <div className="grid grid-cols-5 text-xs font-medium text-muted-foreground">
                <div className="col-span-2">Name</div>
                <div>Condition</div>
                <div>Date</div>
                <div>Time</div>
            </div>
            <div className="space-y-2">
                {appointments.map((appointment) => (
                    <div
                        key={appointment.id}
                        className="grid grid-cols-5 items-center rounded-lg border p-3 hover:bg-muted/50 transition-colors"
                    >
                        <div className="col-span-2 flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                                <AvatarImage src={appointment.client.avatar} alt={appointment.client.name} />
                                <AvatarFallback>{appointment.client.initials}</AvatarFallback>
                            </Avatar>
                            <div>
                                <div className="font-medium">{appointment.client.name}</div>
                                <Badge
                                    variant="outline"
                                    className={`mt-1 text-xs ${appointment.type === "APPOINTMENT"
                                            ? "bg-blue-50 text-blue-700 border-blue-200"
                                            : appointment.type === "WEEKLY_CHECKUP"
                                                ? "bg-green-50 text-green-700 border-green-200"
                                                : "bg-amber-50 text-amber-700 border-amber-200"
                                        }`}
                                >
                                    {appointment.type.replace("_", " ")}
                                </Badge>
                            </div>
                        </div>
                        <div>{appointment.condition}</div>
                        <div>{appointment.date}</div>
                        <div className="flex items-center justify-between">
                            <span>{appointment.time}</span>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <ChevronRight className="h-4 w-4" />
                                <span className="sr-only">Details</span>
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

