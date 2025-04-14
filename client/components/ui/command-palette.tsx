"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
    Command,
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command"
import { useSidebar } from "./sidebar"
import {
    LayoutDashboardIcon,
    UsersIcon,
    BarChart3,
    Calendar,
    Settings,
    HelpCircle,
    File,
    Mail,
    Bot,
} from "lucide-react"

export function CommandPalette() {
    const [open, setOpen] = React.useState(false)
    const router = useRouter()
    const { toggleSidebar } = useSidebar()

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen((open) => !open)
            }
        }

        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [])

    const runCommand = React.useCallback((command: () => unknown) => {
        setOpen(false)
        command()
    }, [])

    return (
        <>
            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput placeholder="Type a command or search..." />
                <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup heading="Overview">
                        <CommandItem
                            onSelect={() => runCommand(() => router.push("/dashboard"))}
                        >
                            <LayoutDashboardIcon className="mr-2 h-4 w-4" />
                            Dashboard
                        </CommandItem>
                        <CommandItem
                            onSelect={() => runCommand(() => router.push("/dashboard/chatbot"))}
                        >
                            <Bot className="mr-2 h-4 w-4" />
                            AI Assistant
                        </CommandItem>
                    </CommandGroup>
                    <CommandSeparator />
                    <CommandGroup heading="Management">
                        <CommandItem
                            onSelect={() => runCommand(() => router.push("/dashboard/users"))}
                        >
                            <UsersIcon className="mr-2 h-4 w-4" />
                            Users
                        </CommandItem>
                        <CommandItem
                            onSelect={() => runCommand(() => router.push("/dashboard/reports"))}
                        >
                            <File className="mr-2 h-4 w-4" />
                            Reports
                        </CommandItem>
                        <CommandItem
                            onSelect={() => runCommand(() => router.push("/dashboard/schedule"))}
                        >
                            <Calendar className="mr-2 h-4 w-4" />
                            Schedule
                        </CommandItem>
                        <CommandItem
                            onSelect={() => runCommand(() => router.push("/dashboard/invites"))}
                        >
                            <Mail className="mr-2 h-4 w-4" />
                            Invites
                        </CommandItem>
                    </CommandGroup>
                    <CommandSeparator />
                    <CommandGroup heading="Settings">
                        <CommandItem
                            onSelect={() => runCommand(() => router.push("/dashboard/settings"))}
                        >
                            <Settings className="mr-2 h-4 w-4" />
                            Preferences
                        </CommandItem>
                        <CommandItem
                            onSelect={() => runCommand(() => router.push("/dashboard/help"))}
                        >
                            <HelpCircle className="mr-2 h-4 w-4" />
                            Help
                        </CommandItem>
                    </CommandGroup>
                    <CommandSeparator />
                    <CommandGroup heading="Actions">
                        <CommandItem
                            onSelect={() => runCommand(() => toggleSidebar())}
                        >
                            Toggle Sidebar
                        </CommandItem>
                    </CommandGroup>
                </CommandList>
            </CommandDialog>
        </>
    )
} 