import {
  Calendar,
  CalendarClock,
  DollarSign,
  AlertTriangle,
  UserPlus,
  UserCheck,
  MessageSquare,
  CalendarX,
  BarChart,
  Mail,
  FileText,
} from "lucide-react"

export const SUGGESTIONS = [
  {
    text: "Check schedule",
    icon: Calendar,
    prompt: "What's the schedule for client",
  },
  {
    text: "Create schedule",
    icon: CalendarClock,
    prompt: "Create a new schedule for care worker",
  },
  {
    text: "Generate payroll",
    icon: DollarSign,
    prompt: "Generate payroll summary for",
  },
  {
    text: "View alerts",
    icon: AlertTriangle,
    prompt: "Show me unresolved alerts for",
  },
  {
    text: "Create client",
    icon: UserPlus,
    prompt: "Create a new client profile for",
  },
  {
    text: "Assign cover",
    icon: UserCheck,
    prompt: "Assign cover for client",
  },
  {
    text: "Send message",
    icon: MessageSquare,
    prompt: "Send message to care workers",
  },
  {
    text: "Request holiday",
    icon: CalendarX,
    prompt: "Request holiday for care worker",
  },
  {
    text: "Generate revenue report",
    icon: BarChart,
    prompt: "Generate revenue report for",
  },
  {
    text: "Send onboarding invite",
    icon: Mail,
    prompt: "Send onboarding invite to",
  },
  {
    text: "Generate care plan",
    icon: FileText,
    prompt: "Generate care plan for client",
  },
]
