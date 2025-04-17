"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import type { InvoiceData } from "../types"

interface InvoiceSettingsProps {
  invoiceData: InvoiceData
  setInvoiceData: (data: InvoiceData) => void
}

export function InvoiceSettings({ invoiceData, setInvoiceData }: InvoiceSettingsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Invoice Settings</CardTitle>
        <CardDescription>Configure invoice details and tax settings</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="invoiceNumber">Invoice Number</Label>
            <Input
              id="invoiceNumber"
              value={invoiceData.invoiceNumber}
              onChange={(e) => setInvoiceData({ ...invoiceData, invoiceNumber: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="issueDate">Issue Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !invoiceData.issueDate && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {invoiceData.issueDate ? format(new Date(invoiceData.issueDate), "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={new Date(invoiceData.issueDate)}
                  onSelect={(date) =>
                    setInvoiceData({ ...invoiceData, issueDate: format(date || new Date(), "yyyy-MM-dd") })
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dueDate">Due Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !invoiceData.dueDate && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {invoiceData.dueDate ? format(new Date(invoiceData.dueDate), "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={new Date(invoiceData.dueDate)}
                  onSelect={(date) =>
                    setInvoiceData({ ...invoiceData, dueDate: format(date || new Date(), "yyyy-MM-dd") })
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="mt-4 flex items-center space-x-2">
          <Switch
            id="taxEnabled"
            checked={invoiceData.taxEnabled}
            onCheckedChange={(checked) => setInvoiceData({ ...invoiceData, taxEnabled: checked })}
          />
          <Label htmlFor="taxEnabled">Enable Tax</Label>
        </div>

        {invoiceData.taxEnabled && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="taxRate">Tax Rate (%)</Label>
              <Input
                id="taxRate"
                type="number"
                min="0"
                step="0.01"
                value={invoiceData.taxRate}
                onChange={(e) => setInvoiceData({ ...invoiceData, taxRate: Number.parseFloat(e.target.value) || 0 })}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
