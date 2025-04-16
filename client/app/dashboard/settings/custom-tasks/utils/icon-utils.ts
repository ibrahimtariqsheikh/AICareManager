import type React from "react"
import * as LucideIcons from "lucide-react"

export function getIconComponent(iconName: string) {
  if (!iconName) return LucideIcons.Activity

  const IconComponent = LucideIcons[iconName as keyof typeof LucideIcons] as React.ComponentType<any>
  return IconComponent || LucideIcons.Activity
}
