"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Lightbulb, FileText, Calendar, PlusCircle, ClipboardList } from 'lucide-react'

interface SuggestionDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSelect: (suggestion: string) => void
}

export function SuggestionDialog({ open, onOpenChange, onSelect }: SuggestionDialogProps) {
    const [activeTab, setActiveTab] = useState("care")

    const suggestions = {
        care: [
            {
                title: "Care Plan Creation",
                items: [
                    "Create a care plan for a patient with diabetes",
                    "Generate a fall prevention care plan",
                    "Develop a nutrition care plan for elderly patients",
                    "Create a post-surgery recovery care plan"
                ]
            },
            {
                title: "Patient Assessment",
                items: [
                    "How to conduct a comprehensive geriatric assessment",
                    "Best practices for pain assessment documentation",
                    "Mental health assessment guidelines",
                    "Cognitive impairment screening tools"
                ]
            }
        ],
        documentation: [
            {
                title: "Progress Notes",
                items: [
                    "Write a SOAP note for a patient visit",
                    "Document a patient's medication response",
                    "Record behavioral observations",
                    "Document vital signs with interpretation"
                ]
            },
            {
                title: "Reports",
                items: [
                    "Generate a weekly care summary report",
                    "Create an incident report",
                    "Summarize patient progress over 30 days",
                    "Document family communication"
                ]
            }
        ],
        scheduling: [
            {
                title: "Appointments",
                items: [
                    "Schedule a follow-up appointment",
                    "Create a recurring appointment series",
                    "Schedule a team care conference",
                    "Set up a telehealth consultation"
                ]
            },
            {
                title: "Staff Management",
                items: [
                    "Create a caregiver rotation schedule",
                    "Schedule staff training sessions",
                    "Optimize care team assignments",
                    "Generate a monthly staff schedule"
                ]
            }
        ]
    }

    const handleSelect = (suggestion: string) => {
        onSelect(suggestion)
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[550px] p-0">
                <DialogHeader className="px-4 pt-4 pb-0">
                    <DialogTitle>Suggestions</DialogTitle>
                </DialogHeader>

                <Tabs defaultValue="care" value={activeTab} onValueChange={setActiveTab} className="mt-2">
                    <div className="px-4">
                        <TabsList className="w-full">
                            <TabsTrigger value="care" className="flex-1">
                                <ClipboardList className="mr-2 h-4 w-4" />
                                Care Plans
                            </TabsTrigger>
                            <TabsTrigger value="documentation" className="flex-1">
                                <FileText className="mr-2 h-4 w-4" />
                                Documentation
                            </TabsTrigger>
                            <TabsTrigger value="scheduling" className="flex-1">
                                <Calendar className="mr-2 h-4 w-4" />
                                Scheduling
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <ScrollArea className="max-h-[60vh] mt-2">
                        <TabsContent value="care" className="m-0 py-2">
                            {suggestions.care.map((category, i) => (
                                <div key={i} className="mb-4">
                                    <h3 className="px-4 text-sm font-medium text-muted-foreground mb-2">{category.title}</h3>
                                    {category.items.map((item, j) => (
                                        <Button
                                            key={j}
                                            variant="ghost"
                                            className="w-full justify-start px-4 py-3 h-auto text-left"
                                            onClick={() => handleSelect(item)}
                                        >
                                            <Lightbulb className="mr-2 h-4 w-4 flex-shrink-0" />
                                            <span>{item}</span>
                                        </Button>
                                    ))}
                                </div>
                            ))}
                        </TabsContent>

                        <TabsContent value="documentation" className="m-0 py-2">
                            {suggestions.documentation.map((category, i) => (
                                <div key={i} className="mb-4">
                                    <h3 className="px-4 text-sm font-medium text-muted-foreground mb-2">{category.title}</h3>
                                    {category.items.map((item, j) => (
                                        <Button
                                            key={j}
                                            variant="ghost"
                                            className="w-full justify-start px-4 py-3 h-auto text-left"
                                            onClick={() => handleSelect(item)}
                                        >
                                            <FileText className="mr-2 h-4 w-4 flex-shrink-0" />
                                            <span>{item}</span>
                                        </Button>
                                    ))}
                                </div>
                            ))}
                        </TabsContent>

                        <TabsContent value="scheduling" className="m-0 py-2">
                            {suggestions.scheduling.map((category, i) => (
                                <div key={i} className="mb-4">
                                    <h3 className="px-4 text-sm font-medium text-muted-foreground mb-2">{category.title}</h3>
                                    {category.items.map((item, j) => (
                                        <Button
                                            key={j}
                                            variant="ghost"
                                            className="w-full justify-start px-4 py-3 h-auto text-left"
                                            onClick={() => handleSelect(item)}
                                        >
                                            <Calendar className="mr-2 h-4 w-4 flex-shrink-0" />
                                            <span>{item}</span>
                                        </Button>
                                    ))}
                                </div>
                            ))}
                        </TabsContent>
                    </ScrollArea>
                </Tabs>
            </DialogContent>
        </Dialog>
    )
}
