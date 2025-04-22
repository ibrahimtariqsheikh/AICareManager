import { ColumnDef } from "@tanstack/react-table"
import { Role, User } from "@/types/prismaTypes"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Mail, X } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export const columns: ColumnDef<User>[] = [
    {
        accessorKey: "user",
        header: "User",
        cell: ({ row }) => {
            const user = row.original
            const getInitials = (user: User) => {
                const firstInitial = user.fullName?.[0]?.toUpperCase() || ''
                return firstInitial || 'U'
            }

            return (
                <div className="flex items-center gap-2">
                    <Avatar>
                        <AvatarImage src={user.profile?.avatarUrl} />
                        <AvatarFallback>
                            {getInitials(user)}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <div className="font-medium">{user.fullName || 'Unknown'}</div>
                        <div className="text-sm text-gray-500">{user.role}</div>
                    </div>
                </div>
            )
        },
    },
    {
        accessorKey: "email",
        header: "Email",
    },
    {
        accessorKey: "role",
        header: "Role",
        cell: ({ row }) => {
            return <Badge variant="outline">{row.original.role}</Badge>
        },
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            return <Badge variant="default">Active</Badge>
        },
    },
    {
        id: "actions",
        cell: ({ row, table }) => {
            const user = row.original
            const meta = table.options.meta as {
                onSendInvite?: (email: string, role: Role) => Promise<void>
                onCancelInvitation?: (invitationId: string) => Promise<void>
                isCreatingInvitation?: boolean
                isCancellingInvitation?: boolean
            }

            return (
                <div className="text-right">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem
                                onClick={() => meta.onSendInvite?.(user.email, user.role)}
                                disabled={meta.isCreatingInvitation}
                            >
                                <Mail className="h-4 w-4 mr-2" />
                                Resend Invite
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => meta.onCancelInvitation?.(user.id)}
                                disabled={meta.isCancellingInvitation}
                            >
                                <X className="h-4 w-4 mr-2" />
                                Cancel Invite
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )
        },
    },
] 