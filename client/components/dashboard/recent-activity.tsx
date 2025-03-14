"use client"

import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar"

export function RecentActivity() {
    const activities = [
        {
            id: 1,
            user: "John Doe",
            action: "accepted invitation",
            role: "CLIENT",
            time: "2 hours ago",
            initials: "JD",
        },
        {
            id: 2,
            user: "Sarah Johnson",
            action: "was invited as",
            role: "CARE_WORKER",
            time: "5 hours ago",
            initials: "SJ",
        },
        {
            id: 3,
            user: "Michael Brown",
            action: "was invited as",
            role: "OFFICE_STAFF",
            time: "1 day ago",
            initials: "MB",
        },
        {
            id: 4,
            user: "Emily Wilson",
            action: "accepted invitation",
            role: "CARE_WORKER",
            time: "2 days ago",
            initials: "EW",
        },
        {
            id: 5,
            user: "Robert Garcia",
            action: "was invited as",
            role: "CLIENT",
            time: "3 days ago",
            initials: "RG",
        },
    ]

    return (
        <div className="space-y-8">
            {activities.map((activity) => (
                <div className="flex items-center" key={activity.id}>
                    <Avatar className="h-9 w-9">
                        <AvatarImage alt={activity.user} />
                        <AvatarFallback>{activity.initials}</AvatarFallback>
                    </Avatar>
                    <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none">
                            {activity.user}
                        </p>
                        <p className="text-sm text-muted-foreground">
                            {activity.action}{" "}
                            <span className="font-medium">{activity.role}</span>
                        </p>
                    </div>
                    <div className="ml-auto text-xs text-muted-foreground">
                        {activity.time}
                    </div>
                </div>
            ))}
        </div>
    )
}
