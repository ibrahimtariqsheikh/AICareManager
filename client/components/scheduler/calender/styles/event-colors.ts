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
  hoverBg: "hover:bg-blue-100",
  activeBg: "active:bg-blue-200",
  border: "border-blue-200",
  text: "text-blue-700",
  mutedText: "text-blue-500",
}

// Type-specific styles
export const eventTypeStyles: Record<string, EventStyles> = {
  meeting: {
    bg: "bg-pink-50",
    hoverBg: "hover:bg-pink-100",
    activeBg: "active:bg-pink-200",
    border: "border-pink-200",
    text: "text-pink-700",
    mutedText: "text-pink-500",
  },
  call: {
    bg: "bg-pink-50",
    hoverBg: "hover:bg-pink-100",
    activeBg: "active:bg-pink-200",
    border: "border-pink-200",
    text: "text-pink-700",
    mutedText: "text-pink-500",
  },
  appointment: {
    bg: "bg-blue-50",
    hoverBg: "hover:bg-blue-100",
    activeBg: "active:bg-blue-200",
    border: "border-blue-200",
    text: "text-blue-700",
    mutedText: "text-blue-500",
  },
  reminder: {
    bg: "bg-pink-50",
    hoverBg: "hover:bg-pink-100",
    activeBg: "active:bg-pink-200",
    border: "border-pink-200",
    text: "text-pink-700",
    mutedText: "text-pink-500",
  },
  task: {
    bg: "bg-pink-50",
    hoverBg: "hover:bg-pink-100",
    activeBg: "active:bg-pink-200",
    border: "border-pink-200",
    text: "text-pink-700",
    mutedText: "text-pink-500",
  },
} 