import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Card, CardContent } from "../ui/card"
import { Input } from "../ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { ChevronRight, Download, Filter, Plus, Search } from "lucide-react"

const clients = [
    {
        id: 1,
        name: "Alex Smith",
        avatar: "/placeholder.svg",
        initials: "AS",
        address: "123 Main St, Anytown",
        careWorker: "Sarah Johnson",
        status: "ACTIVE",
        lastVisit: "2 days ago",
    },
    {
        id: 2,
        name: "Emma Davis",
        avatar: "/placeholder.svg",
        initials: "ED",
        address: "456 Oak Ave, Somewhere",
        careWorker: "Michael Chen",
        status: "ACTIVE",
        lastVisit: "1 week ago",
    },
    {
        id: 3,
        name: "Robert Johnson",
        avatar: "/placeholder.svg",
        initials: "RJ",
        address: "789 Pine Rd, Elsewhere",
        careWorker: "Jessica Williams",
        status: "INACTIVE",
        lastVisit: "3 weeks ago",
    },
    {
        id: 4,
        name: "Olivia Brown",
        avatar: "/placeholder.svg",
        initials: "OB",
        address: "101 Cedar Ln, Nowhere",
        careWorker: "David Miller",
        status: "ACTIVE",
        lastVisit: "Yesterday",
    },
    {
        id: 5,
        name: "William Taylor",
        avatar: "/placeholder.svg",
        initials: "WT",
        address: "202 Maple Dr, Anywhere",
        careWorker: "Lisa Thompson",
        status: "PENDING",
        lastVisit: "Never",
    },
]

export function ClientStats() {
    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search clients..." className="pl-9 w-full" />
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                        <Filter className="mr-2 h-4 w-4" />
                        Filter
                    </Button>
                    <Button variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Export
                    </Button>
                    <Button size="sm">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Client
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="all" className="w-full">
                <TabsList>
                    <TabsTrigger value="all">All Clients</TabsTrigger>
                    <TabsTrigger value="active">Active</TabsTrigger>
                    <TabsTrigger value="inactive">Inactive</TabsTrigger>
                    <TabsTrigger value="pending">Pending</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="mt-4">
                    <Card>
                        <CardContent className="p-0">
                            <div className="rounded-md border">
                                <div className="grid grid-cols-6 p-4 text-sm font-medium text-muted-foreground border-b">
                                    <div className="col-span-2">Client</div>
                                    <div>Address</div>
                                    <div>Care Worker</div>
                                    <div>Status</div>
                                    <div>Last Visit</div>
                                </div>
                                <div className="divide-y">
                                    {clients.map((client) => (
                                        <div
                                            key={client.id}
                                            className="grid grid-cols-6 p-4 items-center hover:bg-muted/50 transition-colors"
                                        >
                                            <div className="col-span-2 flex items-center gap-3">
                                                <Avatar className="h-9 w-9">
                                                    <AvatarImage src={client.avatar} alt={client.name} />
                                                    <AvatarFallback>{client.initials}</AvatarFallback>
                                                </Avatar>
                                                <div className="font-medium">{client.name}</div>
                                            </div>
                                            <div className="text-sm text-muted-foreground">{client.address}</div>
                                            <div className="text-sm">{client.careWorker}</div>
                                            <div>
                                                <Badge
                                                    variant="outline"
                                                    className={`${client.status === "ACTIVE"
                                                            ? "bg-green-50 text-green-700 border-green-200"
                                                            : client.status === "INACTIVE"
                                                                ? "bg-red-50 text-red-700 border-red-200"
                                                                : "bg-amber-50 text-amber-700 border-amber-200"
                                                        }`}
                                                >
                                                    {client.status}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-muted-foreground">{client.lastVisit}</span>
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <ChevronRight className="h-4 w-4" />
                                                    <span className="sr-only">View</span>
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="active" className="mt-4">
                    <Card>
                        <CardContent className="p-6">
                            <p>Active clients will appear here.</p>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="inactive" className="mt-4">
                    <Card>
                        <CardContent className="p-6">
                            <p>Inactive clients will appear here.</p>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="pending" className="mt-4">
                    <Card>
                        <CardContent className="p-6">
                            <p>Pending clients will appear here.</p>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}

