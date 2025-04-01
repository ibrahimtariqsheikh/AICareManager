import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Badge } from "../ui/badge"

const activities = [
    {
        id: 1,
        user: {
            name: "Sarah Johnson",
            avatar: "/placeholder.svg",
            initials: "SJ",
        },
        action: "completed a care visit",
        client: "Alex Smith",
        time: "10 minutes ago",
        type: "visit",
    },
    {
        id: 2,
        user: {
            name: "Michael Chen",
            avatar: "/placeholder.svg",
            initials: "MC",
        },
        action: "updated medication record",
        client: "Emma Davis",
        time: "32 minutes ago",
        type: "medication",
    },
    {
        id: 3,
        user: {
            name: "Jessica Williams",
            avatar: "/placeholder.svg",
            initials: "JW",
        },
        action: "submitted a care report",
        client: "Robert Johnson",
        time: "1 hour ago",
        type: "report",
    },
    {
        id: 4,
        user: {
            name: "David Miller",
            avatar: "/placeholder.svg",
            initials: "DM",
        },
        action: "rescheduled appointment",
        client: "Olivia Brown",
        time: "2 hours ago",
        type: "schedule",
    },
    {
        id: 5,
        user: {
            name: "Lisa Thompson",
            avatar: "/placeholder.svg",
            initials: "LT",
        },
        action: "added new client notes",
        client: "William Taylor",
        time: "3 hours ago",
        type: "notes",
    },
]

export function RecentActivity() {
    return (
        <div className="space-y-4">
            {activities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
                        <AvatarFallback>{activity.user.initials}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                            <p className="text-sm font-medium leading-none">{activity.user.name}</p>
                            <Badge
                                variant="outline"
                                className={`text-xs ${activity.type === "visit"
                                        ? "bg-green-50 text-green-700 border-green-200"
                                        : activity.type === "medication"
                                            ? "bg-blue-50 text-blue-700 border-blue-200"
                                            : activity.type === "report"
                                                ? "bg-purple-50 text-purple-700 border-purple-200"
                                                : activity.type === "schedule"
                                                    ? "bg-amber-50 text-amber-700 border-amber-200"
                                                    : "bg-gray-50 text-gray-700 border-gray-200"
                                    }`}
                            >
                                {activity.type}
                            </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            {activity.action} for <span className="font-medium">{activity.client}</span>
                        </p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                </div>
            ))}
        </div>
    )
}

