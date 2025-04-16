"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import {
  Activity,
  AlertCircle,
  Bell,
  Calendar,
  CheckCircle,
  Clock,
  Heart,
  Home,
  MessageSquare,
  Phone,
  Plus,
  Settings,
  Star,
  User,
  Users,
} from "lucide-react"

interface IconSelectorProps {
  selectedIcon: string
  onSelectIcon: (iconName: string) => void
}

const availableIcons = {
  activity: Activity,
  alert: AlertCircle,
  bell: Bell,
  calendar: Calendar,
  check: CheckCircle,
  clock: Clock,
  heart: Heart,
  home: Home,
  message: MessageSquare,
  phone: Phone,
  plus: Plus,
  settings: Settings,
  star: Star,
  user: User,
  users: Users,
}

export function IconSelector({ selectedIcon, onSelectIcon }: IconSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("")

  // Filter icons based on search query
  const filteredIcons = Object.entries(availableIcons).filter(([name]) =>
    name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search icons..."
          className="pl-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <ScrollArea className="h-[200px] border rounded-md p-2">
        <div className="grid grid-cols-8 gap-2">
          {filteredIcons.map(([name, Icon]) => (
            <Button
              key={name}
              variant={selectedIcon === name ? "default" : "outline"}
              size="icon"
              className="h-10 w-10"
              onClick={() => onSelectIcon(name)}
              title={name}
            >
              <Icon className="h-5 w-5" />
            </Button>
          ))}
          {filteredIcons.length === 0 && (
            <div className="col-span-8 py-8 text-center text-muted-foreground">
              No icons found matching "{searchQuery}"
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
