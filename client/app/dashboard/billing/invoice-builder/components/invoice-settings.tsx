"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarIcon, Plus, X } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useAppSelector, useAppDispatch } from "@/state/redux"
import { setInvoiceData, setInvoiceNumber } from "@/state/slices/invoiceSlice"
import { useGetCurrentInvoiceNumberQuery } from "@/state/api"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calender"

// Define a tax item interface
interface TaxItem {
  id: string
  name: string
  rate: number
}



export function InvoiceSettings() {
  const invoiceData = useAppSelector((state) => state.invoice.invoiceData)
  const { data: invoiceNumber } = useGetCurrentInvoiceNumberQuery()
  const [newTaxName, setNewTaxName] = useState("")
  const [newTaxRate, setNewTaxRate] = useState("")

  const getFormattedInvoiceNumber = () => {
    if (invoiceNumber) {
      const invoiceNumberString = invoiceNumber.toString()
      const formattedInvoiceNumber = "ACM" + invoiceNumberString + format(new Date(), "yyyy")
      dispatch(setInvoiceNumber(formattedInvoiceNumber))
      return formattedInvoiceNumber
    }
    return ""
  }

  const dispatch = useAppDispatch()

  // Initialize taxes array if it doesn't exist
  const taxes: TaxItem[] = []

  // Function to add a new tax
  const addTax = () => {
    if (!newTaxName || !newTaxRate) return

    const newTax: TaxItem = {
      id: Date.now().toString(),
      name: newTaxName,
      rate: Number.parseFloat(newTaxRate),
    }

    const updatedTaxes = [...taxes, newTax]
    dispatch(
      setInvoiceData({
        ...invoiceData,
        taxes: updatedTaxes,
        taxEnabled: true, // Automatically enable taxes when adding a tax
      }),
    )

    // Reset input fields
    setNewTaxName("")
    setNewTaxRate("")
  }

  // Function to remove a tax
  const removeTax = (id: string) => {
    const updatedTaxes = taxes.filter((tax: TaxItem) => tax.id !== id)
    dispatch(
      setInvoiceData({
        ...invoiceData,
        taxes: updatedTaxes,
        // If no taxes remain, disable tax option
        taxEnabled: updatedTaxes.length > 0 ? invoiceData?.taxEnabled : false,
      }),
    )
  }

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
            <Input id="invoiceNumber" value={getFormattedInvoiceNumber()} disabled />
          </div>

          <div className="space-y-2">
            <Label htmlFor="issueDate">Issue Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !invoiceData?.issueDate && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {invoiceData?.issueDate ? format(new Date(invoiceData?.issueDate), "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={invoiceData?.issueDate ? new Date(invoiceData.issueDate) : new Date()}
                  onSelect={(date) =>
                    dispatch(
                      setInvoiceData({
                        ...invoiceData,
                        issueDate: date ? format(date, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd"),
                      })
                    )
                  }
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
                    !invoiceData?.dueDate && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {invoiceData?.dueDate ? format(new Date(invoiceData?.dueDate), "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={invoiceData?.dueDate ? new Date(invoiceData?.dueDate) : new Date()}
                  onSelect={(date) =>
                    dispatch(setInvoiceData({
                      ...invoiceData,
                      dueDate: date ? format(date, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd")
                    }))
                  }
                  className="w-full"
                  classNames={{
                    day: "hover:bg-accent hover:text-accent-foreground",
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Switch
                id="taxEnabled"
                checked={invoiceData?.taxEnabled ?? false}
                onCheckedChange={(checked: boolean) =>
                  dispatch(setInvoiceData({ ...invoiceData, taxEnabled: checked }))
                }
              />
              <Label htmlFor="taxEnabled">Enable Tax</Label>
            </div>
          </div>

          {invoiceData?.taxEnabled && (
            <div className="space-y-4 border rounded-md p-4 bg-muted/10">
              <h3 className="text-sm font-medium">Tax Settings</h3>

              {/* Display existing taxes */}
              {taxes.length > 0 && (
                <div className="space-y-2 mb-4">
                  <Label>Added Taxes</Label>
                  <div className="space-y-2">
                    {taxes.map((tax: TaxItem) => (
                      <div
                        key={tax.id}
                        className="flex items-center justify-between bg-background p-2 rounded-md border"
                      >
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">{tax.rate}%</Badge>
                          <span>{tax.name}</span>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => removeTax(tax.id)} className="h-8 w-8 p-0">
                          <X className="h-4 w-4" />
                          <span className="sr-only">Remove</span>
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Add new tax form */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="taxName">Tax Name</Label>
                  <Input
                    id="taxName"
                    placeholder="VAT, GST, Sales Tax, etc."
                    value={newTaxName}
                    onChange={(e) => setNewTaxName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="taxRate">Tax Rate (%)</Label>
                  <Input
                    id="taxRate"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="e.g. 20"
                    value={newTaxRate}
                    onChange={(e) => setNewTaxRate(e.target.value)}
                  />
                </div>

                <div className="flex items-end">
                  <Button onClick={addTax} className="mb-2" disabled={!newTaxName || !newTaxRate}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add Tax
                  </Button>
                </div>
              </div>

              {/* Legacy tax rate field - can be removed if not needed */}
              {taxes.length === 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="taxRate">Default Tax Rate (%)</Label>
                    <Input
                      id="taxRate"
                      type="number"
                      min="0"
                      step="0.01"
                      value={invoiceData?.taxRate}
                      onChange={(e) =>
                        dispatch(setInvoiceData({ ...invoiceData, taxRate: Number.parseFloat(e.target.value) || 0 }))
                      }
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
