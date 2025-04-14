"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sparkles, Target, Minus, Plus, Save, Calculator, BarChart3 } from "lucide-react"

export function ProfitCalculator() {
    const [activeTab, setActiveTab] = useState("configure")
    const [serviceType, setServiceType] = useState("personal-care")

    const [profitConfig, setProfitConfig] = useState({
        officeLocation: "West Lake",
        shiftMethod: "Hourly",
        payerType: "Private Pay",
        payer: "Any",
        deductions: [
            { id: "cogs", name: "COGS", type: "percentage", value: 1.5 },
            { id: "gna", name: "G&A Expenses", type: "fixed", value: 14.5 },
        ],
        netProfitTarget: 5.96,
    })

    const handleAddDeduction = () => {
        setProfitConfig({
            ...profitConfig,
            deductions: [
                ...profitConfig.deductions,
                { id: `deduction-${profitConfig.deductions.length + 1}`, name: "", type: "percentage", value: 0 },
            ],
        })
    }

    const handleRemoveDeduction = (id: string) => {
        setProfitConfig({
            ...profitConfig,
            deductions: profitConfig.deductions.filter((d) => d.id !== id),
        })
    }

    const handleDeductionChange = (id: string, field: string, value: any) => {
        setProfitConfig({
            ...profitConfig,
            deductions: profitConfig.deductions.map((d) => (d.id === id ? { ...d, [field]: value } : d)),
        })
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-2/3">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl flex items-center gap-2">
                                <Target className="h-6 w-6 text-primary" />
                                Configure net profit calculations for your business
                            </CardTitle>
                            <CardDescription>
                                Customize net profit targets for services based on payer types, shift methods, and office locations.
                                Include deductions for anything, like G&A expenses and COGS.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Tabs value={activeTab} onValueChange={setActiveTab}>
                                <TabsList className="mb-4">
                                    <TabsTrigger value="configure">Configure</TabsTrigger>
                                    <TabsTrigger value="analyze">Analyze Performance</TabsTrigger>
                                </TabsList>

                                <TabsContent value="configure" className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <div>
                                                <Label htmlFor="service-type">Service Type</Label>
                                                <Select value={serviceType} onValueChange={setServiceType}>
                                                    <SelectTrigger id="service-type">
                                                        <SelectValue placeholder="Select service type" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="personal-care">Personal Care</SelectItem>
                                                        <SelectItem value="skilled-nursing">Skilled Nursing</SelectItem>
                                                        <SelectItem value="therapy">Therapy</SelectItem>
                                                        <SelectItem value="companion-care">Companion Care</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div>
                                                <Label htmlFor="office-location">Office Location</Label>
                                                <Select
                                                    value={profitConfig.officeLocation}
                                                    onValueChange={(value) => setProfitConfig({ ...profitConfig, officeLocation: value })}
                                                >
                                                    <SelectTrigger id="office-location">
                                                        <SelectValue placeholder="Select office location" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="West Lake">West Lake</SelectItem>
                                                        <SelectItem value="Downtown">Downtown</SelectItem>
                                                        <SelectItem value="North Hills">North Hills</SelectItem>
                                                        <SelectItem value="East Side">East Side</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div>
                                                <Label htmlFor="shift-method">Shift Method</Label>
                                                <Select
                                                    value={profitConfig.shiftMethod}
                                                    onValueChange={(value) => setProfitConfig({ ...profitConfig, shiftMethod: value })}
                                                >
                                                    <SelectTrigger id="shift-method">
                                                        <SelectValue placeholder="Select shift method" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Hourly">Hourly</SelectItem>
                                                        <SelectItem value="Visit">Visit</SelectItem>
                                                        <SelectItem value="Daily">Daily</SelectItem>
                                                        <SelectItem value="Live-In">Live-In</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div>
                                                <Label htmlFor="payer-type">Payer Type</Label>
                                                <Select
                                                    value={profitConfig.payerType}
                                                    onValueChange={(value) => setProfitConfig({ ...profitConfig, payerType: value })}
                                                >
                                                    <SelectTrigger id="payer-type">
                                                        <SelectValue placeholder="Select payer type" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Private Pay">Private Pay</SelectItem>
                                                        <SelectItem value="Long-Term Care Insurance">Long-Term Care Insurance</SelectItem>
                                                        <SelectItem value="Medicare">Medicare</SelectItem>
                                                        <SelectItem value="Medicaid">Medicaid</SelectItem>
                                                        <SelectItem value="VA">VA</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div>
                                                <Label htmlFor="payer">Payer</Label>
                                                <Select
                                                    value={profitConfig.payer}
                                                    onValueChange={(value) => setProfitConfig({ ...profitConfig, payer: value })}
                                                >
                                                    <SelectTrigger id="payer">
                                                        <SelectValue placeholder="Select payer" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Any">Any</SelectItem>
                                                        <SelectItem value="Genworth">Genworth</SelectItem>
                                                        <SelectItem value="Hancock">Hancock</SelectItem>
                                                        <SelectItem value="Mutual of Omaha">Mutual of Omaha</SelectItem>
                                                        <SelectItem value="New York Life">New York Life</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <Label>Deductions</Label>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={handleAddDeduction}
                                                className="flex items-center gap-1"
                                            >
                                                <Plus className="h-4 w-4" />
                                                Add Deduction
                                            </Button>
                                        </div>

                                        <div className="space-y-3">
                                            {profitConfig.deductions.map((deduction) => (
                                                <div key={deduction.id} className="flex items-end gap-3">
                                                    <div className="flex-1">
                                                        <Label htmlFor={`deduction-name-${deduction.id}`}>Name</Label>
                                                        <Input
                                                            id={`deduction-name-${deduction.id}`}
                                                            value={deduction.name}
                                                            onChange={(e) => handleDeductionChange(deduction.id, "name", e.target.value)}
                                                            placeholder="Deduction name"
                                                        />
                                                    </div>
                                                    <div className="w-32">
                                                        <Label htmlFor={`deduction-type-${deduction.id}`}>Type</Label>
                                                        <Select
                                                            value={deduction.type}
                                                            onValueChange={(value) => handleDeductionChange(deduction.id, "type", value)}
                                                        >
                                                            <SelectTrigger id={`deduction-type-${deduction.id}`}>
                                                                <SelectValue placeholder="Type" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="percentage">Percentage</SelectItem>
                                                                <SelectItem value="fixed">Fixed Amount</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <div className="w-32">
                                                        <Label htmlFor={`deduction-value-${deduction.id}`}>Value</Label>
                                                        <Input
                                                            id={`deduction-value-${deduction.id}`}
                                                            type="number"
                                                            value={deduction.value}
                                                            onChange={(e) =>
                                                                handleDeductionChange(deduction.id, "value", Number.parseFloat(e.target.value))
                                                            }
                                                            placeholder="Value"
                                                        />
                                                    </div>
                                                    <Button variant="ghost" size="icon" onClick={() => handleRemoveDeduction(deduction.id)}>
                                                        <Minus className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="net-profit-target">Net Profit Target</Label>
                                        <div className="flex items-center gap-2">
                                            <Input
                                                id="net-profit-target"
                                                type="number"
                                                value={profitConfig.netProfitTarget}
                                                onChange={(e) =>
                                                    setProfitConfig({ ...profitConfig, netProfitTarget: Number.parseFloat(e.target.value) })
                                                }
                                                className="w-32"
                                            />
                                            <span>%</span>
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-2">
                                        <Button variant="outline">Cancel</Button>
                                        <Button className="flex items-center gap-1">
                                            <Save className="h-4 w-4" />
                                            Save Configuration
                                        </Button>
                                    </div>
                                </TabsContent>

                                <TabsContent value="analyze" className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-medium">AI Performance Analysis</h3>
                                        <Button className="flex items-center gap-1">
                                            <Sparkles className="h-4 w-4" />
                                            Generate Analysis
                                        </Button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <Card>
                                            <CardHeader className="pb-2">
                                                <CardTitle className="text-base">Profit by Service Type</CardTitle>
                                            </CardHeader>
                                            <CardContent className="h-64 flex items-center justify-center bg-muted/30 rounded-md">
                                                <BarChart3 className="h-12 w-12 text-muted-foreground" />
                                            </CardContent>
                                        </Card>

                                        <Card>
                                            <CardHeader className="pb-2">
                                                <CardTitle className="text-base">Profit by Payer Type</CardTitle>
                                            </CardHeader>
                                            <CardContent className="h-64 flex items-center justify-center bg-muted/30 rounded-md">
                                                <BarChart3 className="h-12 w-12 text-muted-foreground" />
                                            </CardContent>
                                        </Card>
                                    </div>

                                    <Card>
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-base">AI Insights</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <p className="text-muted-foreground">
                                                Use AI to quickly request summaries of actual or projected net profit, categorized by services,
                                                shift types, locations, and more.
                                            </p>
                                            <div className="flex items-center gap-2">
                                                <Input placeholder="Ask AI about your profit performance..." className="flex-1" />
                                                <Button className="flex items-center gap-1">
                                                    <Sparkles className="h-4 w-4" />
                                                    Ask AI
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                    </Card>
                </div>

                <div className="md:w-1/3">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Personal Care</CardTitle>
                            <CardDescription>Net Profit Calculation</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-2">
                                <div className="text-sm text-muted-foreground">Office Location</div>
                                <div className="text-sm font-medium text-right">{profitConfig.officeLocation}</div>

                                <div className="text-sm text-muted-foreground">Shift Method</div>
                                <div className="text-sm font-medium text-right">{profitConfig.shiftMethod}</div>

                                <div className="text-sm text-muted-foreground">Payer Type</div>
                                <div className="text-sm font-medium text-right">{profitConfig.payerType}</div>

                                <div className="text-sm text-muted-foreground">Payer</div>
                                <div className="text-sm font-medium text-right">{profitConfig.payer}</div>
                            </div>

                            <div className="border-t pt-4 space-y-2">
                                {profitConfig.deductions.map((deduction) => (
                                    <div key={deduction.id} className="flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                            <span className="text-sm">{deduction.name}</span>
                                            <span className="text-xs text-muted-foreground">
                                                {deduction.type === "percentage" ? "Deduction" : "Deduction"}
                                            </span>
                                        </div>
                                        <div className="text-sm font-medium">
                                            {deduction.type === "percentage" ? `${deduction.value}%` : `$${deduction.value.toFixed(2)}`}
                                        </div>
                                    </div>
                                ))}

                                <div className="flex justify-between items-center pt-2 border-t">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                        <span className="text-sm">Net Profit</span>
                                        <span className="text-xs text-muted-foreground">Target</span>
                                    </div>
                                    <div className="text-sm font-medium text-green-600">{profitConfig.netProfitTarget}%</div>
                                </div>
                            </div>

                            <div className="pt-4">
                                <Button variant="outline" className="w-full flex items-center gap-1">
                                    <Calculator className="h-4 w-4" />
                                    Calculate Recommended Rates
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
