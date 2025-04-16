"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreVertical, Pencil, Trash2, Home, Users, UserCog, HelpCircle } from "lucide-react"
import type { ClientGroup } from "../types"
import { format } from "date-fns"

interface ClientGroupListProps {
  groups: ClientGroup[]
  onEdit: (group: ClientGroup) => void
  onDelete: (group: ClientGroup) => void
}

export function ClientGroupList({ groups, onEdit, onDelete }: ClientGroupListProps) {
  const getGroupTypeIcon = (type: string) => {
    switch (type) {
      case "HOUSEHOLD":
        return <Home className="h-4 w-4" />
      case "FAMILY":
        return <Users className="h-4 w-4" />
      case "CARE_TEAM":
        return <UserCog className="h-4 w-4" />
      default:
        return <HelpCircle className="h-4 w-4" />
    }
  }

  const getGroupTypeBadge = (type: string) => {
    switch (type) {
      case "HOUSEHOLD":
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800"
          >
            <Home className="h-3 w-3 mr-1" />
            Household
          </Badge>
        )
      case "FAMILY":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
          >
            <Users className="h-3 w-3 mr-1" />
            Family
          </Badge>
        )
      case "CARE_TEAM":
        return (
          <Badge
            variant="outline"
            className="bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800"
          >
            <UserCog className="h-3 w-3 mr-1" />
            Care Team
          </Badge>
        )
      default:
        return (
          <Badge variant="outline">
            <HelpCircle className="h-3 w-3 mr-1" />
            Other
          </Badge>
        )
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {groups.map((group) => (
        <Card key={group.id} className="overflow-hidden">
          <div className="bg-muted/40 p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getGroupTypeIcon(group.type)}
              <h3 className="font-medium">{group.name}</h3>
            </div>
            <div className="flex items-center gap-2">
              {getGroupTypeBadge(group.type)}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit(group)}>
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDelete(group)} className="text-red-600 focus:text-red-600">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <CardContent className="p-4">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Members ({group.clients.length})</p>
                <div className="flex flex-wrap gap-2">
                  {group.clients.map((client) => (
                    <Badge key={client.id} variant="outline">
                      {client.firstName} {client.lastName}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="text-xs text-muted-foreground">
                Created {format(new Date(group.createdAt), "MMM d, yyyy")}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
