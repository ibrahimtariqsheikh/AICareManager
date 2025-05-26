import { Search, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CustomInput } from "@/components/ui/custom-input"

interface ExpensesActionsProps {
    showFilters: boolean
}

export function ExpensesActions({ showFilters }: ExpensesActionsProps) {
    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <CustomInput
                    icon={<Search className="h-3.5 w-3.5" />}
                    placeholder="Search expenses..."
                    className="w-full h-8"
                />
                <Button variant="outline" size="sm" className="h-8">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                </Button>
            </div>
        </div>
    )
} 