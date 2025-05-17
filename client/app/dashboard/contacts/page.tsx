"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Users, Briefcase } from "lucide-react"
import { getRandomPlaceholderImage } from "@/lib/utils"
import { CustomInput } from "@/components/ui/custom-input"
import { useAppSelector } from "@/state/redux"
import { User } from "@/types/prismaTypes"

interface Contact {
    id: string
    name: string
    role: string
    subRole?: string
    avatar?: string
}

export default function ContactsPage() {
    const [activeTab, setActiveTab] = useState("clients")
    const [searchQuery, setSearchQuery] = useState("")
    const router = useRouter()
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const [typingStatus, setTypingStatus] = useState(false)
    const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null)

    const { clients, officeStaff, careWorkers } = useAppSelector((state) => state.user)

    const formatRole = (role: string) => {
        return role
            .split("_")
            .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
            .join(" ")
    }

    const handleTyping = () => {
        setTypingStatus(true)

        if (typingTimeout) {
            clearTimeout(typingTimeout)
        }

        // Scroll to bottom when typing
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })

        const timeout = setTimeout(() => {
            setTypingStatus(false)
        }, 3000)

        setTypingTimeout(timeout)
    }

    const filteredContacts: Contact[] = (() => {
        let contacts: Contact[] = []

        switch (activeTab) {
            case "clients":
                contacts = clients.map((client: User) => ({
                    id: client.id,
                    name: client.fullName,
                    role: client.role,
                    subRole: client.subRole,
                    avatar: client.profile?.avatarUrl || getRandomPlaceholderImage()
                }))
                break
            case "officeStaff":
                contacts = officeStaff.map((staff: User) => ({
                    id: staff.id,
                    name: staff.fullName,
                    role: staff.role,
                    subRole: staff.subRole,
                    avatar: staff.profile?.avatarUrl || getRandomPlaceholderImage()
                }))
                break
            case "careWorkers":
                contacts = careWorkers.map((worker: User) => ({
                    id: worker.id,
                    name: worker.fullName,
                    role: worker.role,
                    subRole: worker.subRole,
                    avatar: worker.profile?.avatarUrl || getRandomPlaceholderImage()
                }))
                break
        }

        if (searchQuery) {
            const query = searchQuery.toLowerCase()
            return contacts.filter(contact =>
                contact.name.toLowerCase().includes(query) ||
                formatRole(contact.role).toLowerCase().includes(query) ||
                (contact.subRole && formatRole(contact.subRole).toLowerCase().includes(query))
            )
        }

        return contacts
    })()

    return (
        <div className="flex flex-col h-[calc(100vh-4rem)] w-full bg-background mt-4">
            {/* Search Bar */}
            <div className="px-4 py-2">
                <CustomInput
                    type="text"
                    placeholder="Search contacts..."
                    value={searchQuery}
                    onChange={setSearchQuery}
                    className="w-full"
                    icon={<Search className="h-4 w-4" />}
                />
            </div>

            {/* Role Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="border-b">
                    <TabsList className="h-12 w-full justify-start rounded-none border-b bg-transparent p-0">
                        <TabsTrigger
                            value="clients"
                            className="flex items-center gap-2 rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-primary"
                        >
                            <Users className="h-4 w-4" />
                            <span>Clients</span>
                        </TabsTrigger>
                        <TabsTrigger
                            value="officeStaff"
                            className="flex items-center gap-2 rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-primary"
                        >
                            <Briefcase className="h-4 w-4" />
                            <span>Office Staff</span>
                        </TabsTrigger>
                        <TabsTrigger
                            value="careWorkers"
                            className="flex items-center gap-2 rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-primary"
                        >
                            <Users className="h-4 w-4" />
                            <span>Care Workers</span>
                        </TabsTrigger>
                    </TabsList>
                </div>

                {/* Contact Lists */}
                <TabsContent value={activeTab} className="flex-1 overflow-hidden mt-0 p-0">
                    <div className="h-full overflow-y-auto">
                        {filteredContacts.length > 0 ? (
                            <div className="divide-y">
                                {filteredContacts.map((contact) => (
                                    <button
                                        key={contact.id}
                                        className="w-full flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors text-left"
                                        onClick={() => {
                                            sessionStorage.setItem('currentContact', JSON.stringify(contact));
                                            router.push(`/dashboard/messages?contactId=${contact.id}`);
                                        }}
                                    >
                                        <Avatar className="h-12 w-12 border">
                                            <AvatarImage src={contact.avatar} alt={contact.name} />
                                            <AvatarFallback>
                                                {contact.name
                                                    .split(" ")
                                                    .map((n) => n[0])
                                                    .join("")}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col">
                                            <span className="font-medium text-base">{contact.name}</span>
                                            <span className="text-sm text-muted-foreground">
                                                {contact.subRole ? formatRole(contact.subRole) : formatRole(contact.role)}
                                            </span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-[calc(100vh-12rem)] p-8 text-center">
                                <div className="rounded-full bg-muted p-3 mb-4">
                                    <Search className="h-6 w-6 text-muted-foreground" />
                                </div>
                                <h3 className="font-medium text-lg mb-1">
                                    {searchQuery
                                        ? "No Results Found"
                                        : `No ${activeTab === "clients" ? "Clients" : activeTab === "officeStaff" ? "Office Staff" : "Care Workers"} Available`}
                                </h3>
                                <p className="text-muted-foreground text-sm max-w-sm">
                                    {searchQuery
                                        ? "Please refine your search or try a different category."
                                        : "Begin by adding new contacts to your directory."}
                                </p>
                            </div>
                        )}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
