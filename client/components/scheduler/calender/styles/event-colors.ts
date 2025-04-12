export interface EventStyles {
  bg: string
  hoverBg: string
  activeBg: string
  border: string
  text: string
  mutedText: string
}

// Base styles that apply to all events
export const baseEventStyles: EventStyles = {
  bg: "bg-blue-50",
  hoverBg: "bg-blue-100",
  activeBg: "bg-blue-200",
  border: "border-blue-200",
  text: "text-blue-700",
  mutedText: "text-blue-500",
}

// Type-specific styles
export const eventTypeStyles: Record<string, EventStyles> = {
  meeting: {
    bg: "bg-blue-50",
    hoverBg: "bg-blue-100",
    activeBg: "bg-blue-200",
    border: "border-blue-200",
    text: "text-blue-700",
    mutedText: "text-blue-500",
  },
  call: {
    bg: "bg-emerald-50",
    hoverBg: "bg-emerald-100",
    activeBg: "bg-emerald-200",
    border: "border-emerald-200",
    text: "text-emerald-700",
    mutedText: "text-emerald-500",
  },
  appointment: {
    bg: "bg-purple-50",
    hoverBg: "bg-purple-100",
    activeBg: "bg-purple-200",
    border: "border-purple-200",
    text: "text-purple-700",
    mutedText: "text-purple-500",
  },
  reminder: {
    bg: "bg-amber-50",
    hoverBg: "bg-amber-100",
    activeBg: "bg-amber-200",
    border: "border-amber-200",
    text: "text-amber-700",
    mutedText: "text-amber-500",
  },
  task: {
    bg: "bg-rose-50",
    hoverBg: "bg-rose-100",
    activeBg: "bg-rose-200",
    border: "border-rose-200",
    text: "text-rose-700",
    mutedText: "text-rose-500",
  },
} 