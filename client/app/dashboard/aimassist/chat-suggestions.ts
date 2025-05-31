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
    prompt: "I want to check an existing schedule.",
  },
  {
    text: "View Unresolved Alerts",
    icon: AlertTriangle,
    prompt: "Show me unresolved alerts",
  },
  {
    text: "Create schedule",
    icon: CalendarClock,
    prompt: "I want to create a new schedule. Can you tell me whats required to create a schedule?",
  },
  {
    text: "Create client",
    icon: UserPlus,
    prompt: "I want to create a new client.",
  },
  {
    text: "Send message",
    icon: MessageSquare,
    prompt: "I want to send a message to all users.",
  },
  {
    text: "Generate revenue report",
    icon: BarChart,
    prompt: "I want to generate a revenue report.",
  },
  {
    text: "Request holiday",
    icon: CalendarX,
    prompt: "I want to assign a holiday.",
  },
  {
    text: "Send onboarding invite",
    icon: Mail,
    prompt: "I want to send an onboarding invite.",
  },
  // {
  //   text: "Generate payroll",
  //   icon: DollarSign,
  //   prompt: "Generate payroll summary for",
  // },
  // {
  //   text: "Assign cover",
  //   icon: UserCheck,
  //   prompt: "Assign cover for client",
  // },
  // {
  //   text: "Generate care plan",
  //   icon: FileText,
  //   prompt: "Generate care plan for client",
  // },
]
