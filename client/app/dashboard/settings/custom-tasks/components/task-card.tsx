"use client"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trash2, Activity, AlertTriangle, CheckCircle, Calendar, Clock } from "lucide-react"
import type { CustomTask } from "../types"
import { getIconComponent } from "../utils/icon-utils"

interface TaskCardProps {
  task: CustomTask
  categoryName: string
  categoryColor: string
  onDelete: () => void
  compact?: boolean
}

export function TaskCard({ task, categoryName, categoryColor, onDelete, compact = false }: TaskCardProps) {
  const TaskIcon = getIconComponent(task.icon) || Activity

  const getPriorityBadge = () => {
    switch (task.priority) {
      case "high":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <AlertTriangle className="h-3 w-3 mr-1" />
            High Priority
          </Badge>
        )
      case "medium":
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
            Medium Priority
          </Badge>
        )
      case "low":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Low Priority
          </Badge>
        )
      default:
        return null
    }
  }

  const getFrequencyBadge = () => {
    switch (task.frequency) {
      case "daily":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <Calendar className="h-3 w-3 mr-1" />
            Daily
          </Badge>
        )
      case "weekly":
        return (
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            <Calendar className="h-3 w-3 mr-1" />
            Weekly
          </Badge>
        )
      case "as-needed":
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
            <Clock className="h-3 w-3 mr-1" />
            As Needed
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <Card className="overflow-hidden">
      <div className="h-1" style={{ backgroundColor: categoryColor }}></div>
      <CardContent className={compact ? "p-4" : "p-6"}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-md" style={{ backgroundColor: `${categoryColor}20` }}>
              <TaskIcon className="h-5 w-5" style={{ color: categoryColor }} />
            </div>
            <div>
              <h3 className="font-medium">{task.name}</h3>
              <p className="text-xs text-muted-foreground">{categoryName}</p>
            </div>
          </div>
          {!compact && (
            <Button variant="ghost" size="icon" onClick={onDelete} className="h-8 w-8">
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          )}
        </div>

        {!compact && task.placeholder && (
          <div className="mt-4">
            <p className="text-sm text-muted-foreground">Placeholder:</p>
            <p className="text-sm italic">"{task.placeholder}"</p>
          </div>
        )}

        <div className="mt-4 flex flex-wrap gap-2">
          {getPriorityBadge()}
          {getFrequencyBadge()}
        </div>

        {task.clients && task.clients.length > 0 && !compact && (
          <div className="mt-4">
            <p className="text-xs text-muted-foreground mb-1">Assigned to {task.clients.length} client(s)</p>
            <div className="flex flex-wrap gap-1">
              {task.clients.slice(0, 3).map((client) => (
                <Badge key={client.id} variant="secondary" className="text-xs">
                  {client.name}
                </Badge>
              ))}
              {task.clients.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{task.clients.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
      {compact && (
        <CardFooter className="p-2 pt-0 flex justify-end">
          <Button variant="ghost" size="sm" onClick={onDelete} className="h-8 w-8 p-0">
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
