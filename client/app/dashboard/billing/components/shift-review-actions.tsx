import { Search, Download, AlertCircle, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CustomInput } from "@/components/ui/custom-input"

import { cn } from "@/lib/utils"


interface ShiftReviewActionsProps {
    showFilters: boolean
    activeTab: string
    onTabChange: (value: string) => void
    pendingCount: number
    approvedCount: number
}



export function ShiftReviewActions({ showFilters, activeTab, onTabChange, pendingCount, approvedCount }: ShiftReviewActionsProps) {
    return (
        <div className="flex items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
                <Button
                    variant={activeTab === "pending" ? "default" : "outline"}
                    size="sm"
                    className={cn(
                        "h-8 px-3",

                        activeTab === "pending" ? "bg-primary text-primary-foreground" : "bg-muted border-muted-foreground/40"
                    )}
                    onClick={() => onTabChange("pending")}
                >
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Pending Review
                </Button>
                <Button
                    variant={activeTab === "approved" ? "default" : "outline"}
                    size="sm"
                    className={cn(
                        "h-8 px-3",

                        activeTab === "approved" ? "bg-primary text-primary-foreground" : "bg-muted border-muted-foreground/40"
                    )}
                    onClick={() => onTabChange("approved")}
                >
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Approved
                </Button>
            </div>

            <div className="flex items-center gap-2">
                <CustomInput
                    icon={<Search className="h-3 w-3" />}
                    placeholder="Search shifts..."
                    className="w-full h-8"
                />
                <Button variant="outline" size="sm" className={cn("h-8")}>
                    <Download className="mr-1 h-3 w-3" />
                    Export
                </Button>
            </div>
        </div>
    )
} 