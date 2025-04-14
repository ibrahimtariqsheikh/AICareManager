"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"

export function BillingSettings() {
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Invoice Settings</CardTitle>
                    <CardDescription>
                        Configure how invoices are generated and sent
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label>Invoice Number Format</Label>
                        <Select defaultValue="year-month">
                            <SelectTrigger>
                                <SelectValue placeholder="Select format" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="year-month">YYYY-MM-XXXX</SelectItem>
                                <SelectItem value="sequential">INV-XXXX</SelectItem>
                                <SelectItem value="custom">Custom</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Default Payment Terms</Label>
                        <Select defaultValue="30">
                            <SelectTrigger>
                                <SelectValue placeholder="Select terms" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="7">7 days</SelectItem>
                                <SelectItem value="15">15 days</SelectItem>
                                <SelectItem value="30">30 days</SelectItem>
                                <SelectItem value="45">45 days</SelectItem>
                                <SelectItem value="60">60 days</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Tax Settings</Label>
                        <div className="flex items-center space-x-2">
                            <Switch id="tax-inclusive" />
                            <Label htmlFor="tax-inclusive">Include tax in prices</Label>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Payment Settings</CardTitle>
                    <CardDescription>
                        Configure payment processing and notifications
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label>Default Currency</Label>
                        <Select defaultValue="usd">
                            <SelectTrigger>
                                <SelectValue placeholder="Select currency" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="usd">USD ($)</SelectItem>
                                <SelectItem value="eur">EUR (€)</SelectItem>
                                <SelectItem value="gbp">GBP (£)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Payment Methods</Label>
                        <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                                <Switch id="credit-card" defaultChecked />
                                <Label htmlFor="credit-card">Credit Card</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Switch id="bank-transfer" defaultChecked />
                                <Label htmlFor="bank-transfer">Bank Transfer</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Switch id="cash" />
                                <Label htmlFor="cash">Cash</Label>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Late Payment Fee</Label>
                        <div className="flex items-center space-x-2">
                            <Input type="number" defaultValue="25" className="w-24" />
                            <span>% of invoice amount</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end">
                <Button>Save Changes</Button>
            </div>
        </div>
    )
} 