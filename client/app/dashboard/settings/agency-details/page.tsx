"use client"

import type React from "react"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { Building2, MapPin, FileText, Info, Pencil, AlertCircle, CheckCircle2, Palette, ImageIcon } from "lucide-react"
import { DocumentUpload } from "./components/document-upload"
import { DocumentList } from "./components/document-list"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface AgencyInfo {
    name: string
    email: string
    address: string
    phone: string
    website: string
    description: string
    logo?: string
    primaryColor?: string
    secondaryColor?: string
}

export default function AgencyPage() {
    // Initial agency data - in a real app, this would come from an API
    const [agency, setAgency] = useState<AgencyInfo>({
        name: "AK Care",
        email: "ayan@weareoncare.com",
        address: "Kenan Street, London, NW6 NW6",
        phone: "+44 20 1234 5678",
        website: "www.akcare.com",
        description: "AK Care provides high-quality care services to clients across London.",
        primaryColor: "#4f46e5",
        secondaryColor: "#10b981",
    })

    // State for edit dialogs
    const [isGeneralEditOpen, setIsGeneralEditOpen] = useState(false)
    const [isContactEditOpen, setIsContactEditOpen] = useState(false)
    const [isBrandingEditOpen, setIsBrandingEditOpen] = useState(false)
    const [isDocumentInfoOpen, setIsDocumentInfoOpen] = useState(false)

    // Form state
    const [formData, setFormData] = useState<AgencyInfo>(agency)

    // Documents state - in a real app, this would come from an API
    const [documents, setDocuments] = useState([
        { id: "1", name: "operational_documents.pdf", type: "operational_documents", uploadedAt: new Date().toISOString() },
    ])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleGeneralSave = () => {
        setAgency((prev) => ({ ...prev, name: formData.name, email: formData.email, description: formData.description }))
        setIsGeneralEditOpen(false)
        toast.success("Agency information updated successfully")
    }

    const handleContactSave = () => {
        setAgency((prev) => ({ ...prev, address: formData.address, phone: formData.phone, website: formData.website }))
        setIsContactEditOpen(false)
        toast.success("Contact details updated successfully")
    }

    const handleBrandingSave = () => {
        setAgency((prev) => ({
            ...prev,
            logo: formData.logo,
            primaryColor: formData.primaryColor,
            secondaryColor: formData.secondaryColor,
        }))
        setIsBrandingEditOpen(false)
        toast.success("Branding settings updated successfully")
    }

    const handleDocumentUpload = (file: File) => {
        // In a real app, you would upload the file to your server
        const newDocument = {
            id: Math.random().toString(36).substring(7),
            name: file.name,
            type: "operational_documents",
            uploadedAt: new Date().toISOString(),
        }

        setDocuments((prev) => [...prev, newDocument])
        toast.success(`Document ${file.name} uploaded successfully`)
    }

    const handleDocumentDelete = (id: string) => {
        setDocuments((prev) => prev.filter((doc) => doc.id !== id))
        toast.success("Document deleted successfully")
    }

    return (
        <div className="container mx-auto py-6 space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Agency Settings</h1>
                <p className="text-muted-foreground">Manage your agency information, contact details, and documents</p>
            </div>

            <Tabs defaultValue="general" className="w-full">
                <TabsList className="grid grid-cols-4 mb-8">
                    <TabsTrigger value="general" className="flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        <span>General</span>
                    </TabsTrigger>
                    <TabsTrigger value="contact" className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>Contact</span>
                    </TabsTrigger>
                    <TabsTrigger value="documents" className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        <span>Documents</span>
                    </TabsTrigger>
                    <TabsTrigger value="branding" className="flex items-center gap-2">
                        <Palette className="h-4 w-4" />
                        <span>Branding</span>
                    </TabsTrigger>
                </TabsList>

                {/* General Information Tab */}
                <TabsContent value="general">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <div className="flex items-center space-x-2">
                                <Building2 className="h-5 w-5 text-primary" />
                                <CardTitle>General Information</CardTitle>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    setFormData(agency)
                                    setIsGeneralEditOpen(true)
                                }}
                            >
                                <Pencil className="h-4 w-4 mr-2" />
                                Edit
                            </Button>
                        </CardHeader>
                        <CardContent className="pt-4">
                            <div className="grid gap-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-sm text-muted-foreground">Agency Name</Label>
                                        <p className="font-medium">{agency.name}</p>
                                    </div>
                                    <div>
                                        <Label className="text-sm text-muted-foreground">Email</Label>
                                        <p className="font-medium">{agency.email}</p>
                                    </div>
                                </div>
                                <div>
                                    <Label className="text-sm text-muted-foreground">Description</Label>
                                    <p className="text-sm">{agency.description || "No description provided"}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Contact Details Tab */}
                <TabsContent value="contact">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <div className="flex items-center space-x-2">
                                <MapPin className="h-5 w-5 text-primary" />
                                <CardTitle>Contact Details</CardTitle>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    setFormData(agency)
                                    setIsContactEditOpen(true)
                                }}
                            >
                                <Pencil className="h-4 w-4 mr-2" />
                                Edit
                            </Button>
                        </CardHeader>
                        <CardContent className="pt-4">
                            <div className="grid gap-4">
                                <div>
                                    <Label className="text-sm text-muted-foreground">Address</Label>
                                    <p className="font-medium">{agency.address}</p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-sm text-muted-foreground">Phone</Label>
                                        <p className="font-medium">{agency.phone || "Not provided"}</p>
                                    </div>
                                    <div>
                                        <Label className="text-sm text-muted-foreground">Website</Label>
                                        <p className="font-medium">{agency.website || "Not provided"}</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Documents Tab */}
                <TabsContent value="documents">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <div className="flex items-center space-x-2">
                                <FileText className="h-5 w-5 text-primary" />
                                <CardTitle>Documents</CardTitle>
                            </div>
                            <div className="flex space-x-2">
                                <Button variant="outline" size="sm" onClick={() => setIsDocumentInfoOpen(true)}>
                                    <Info className="h-4 w-4 mr-2" />
                                    How care workers see these
                                </Button>
                                <DocumentUpload onUpload={handleDocumentUpload} />
                            </div>
                        </CardHeader>
                        <CardContent className="pt-4">
                            <Alert className="mb-4">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Important</AlertTitle>
                                <AlertDescription>
                                    Documents uploaded here will be available to all care workers in your agency.
                                </AlertDescription>
                            </Alert>

                            <DocumentList documents={documents} onDelete={handleDocumentDelete} />
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Branding Tab */}
                <TabsContent value="branding">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <div className="flex items-center space-x-2">
                                <Palette className="h-5 w-5 text-primary" />
                                <CardTitle>Branding Settings</CardTitle>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    setFormData(agency)
                                    setIsBrandingEditOpen(true)
                                }}
                            >
                                <Pencil className="h-4 w-4 mr-2" />
                                Edit
                            </Button>
                        </CardHeader>
                        <CardContent className="pt-4">
                            <div className="grid gap-6">
                                <div>
                                    <Label className="text-sm text-muted-foreground">Agency Logo</Label>
                                    <div className="mt-2 border rounded-md p-4 flex items-center justify-center bg-muted/10">
                                        {agency.logo ? (
                                            <img
                                                src={agency.logo || "/placeholder.svg"}
                                                alt={`${agency.name} logo`}
                                                className="max-h-24 max-w-full object-contain"
                                            />
                                        ) : (
                                            <div className="flex flex-col items-center justify-center p-4">
                                                <ImageIcon className="h-12 w-12 text-muted-foreground mb-2" />
                                                <p className="text-sm text-muted-foreground">No logo uploaded</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-sm text-muted-foreground">Primary Color</Label>
                                        <div className="flex items-center mt-2">
                                            <div
                                                className="w-6 h-6 rounded-full mr-2 border"
                                                style={{ backgroundColor: agency.primaryColor }}
                                            />
                                            <p className="font-mono text-sm">{agency.primaryColor}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <Label className="text-sm text-muted-foreground">Secondary Color</Label>
                                        <div className="flex items-center mt-2">
                                            <div
                                                className="w-6 h-6 rounded-full mr-2 border"
                                                style={{ backgroundColor: agency.secondaryColor }}
                                            />
                                            <p className="font-mono text-sm">{agency.secondaryColor}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4 p-4 border rounded-md bg-muted/10">
                                    <h3 className="text-sm font-medium mb-2">Preview</h3>
                                    <div className="flex flex-col gap-2">
                                        <div
                                            className="h-10 rounded-md flex items-center justify-center text-white font-medium"
                                            style={{ backgroundColor: agency.primaryColor }}
                                        >
                                            Primary Button
                                        </div>
                                        <div
                                            className="h-10 rounded-md flex items-center justify-center text-white font-medium"
                                            style={{ backgroundColor: agency.secondaryColor }}
                                        >
                                            Secondary Button
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* General Information Edit Dialog */}
            <Dialog open={isGeneralEditOpen} onOpenChange={setIsGeneralEditOpen}>
                <DialogContent className="sm:max-w-[525px]">
                    <DialogHeader>
                        <DialogTitle>Edit General Information</DialogTitle>
                        <DialogDescription>
                            Update your agency's general information. Click save when you're done.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Agency Name
                            </Label>
                            <Input id="name" name="name" value={formData.name} onChange={handleInputChange} className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="email" className="text-right">
                                Email
                            </Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="description" className="text-right">
                                Description
                            </Label>
                            <Textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                className="col-span-3"
                                rows={4}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsGeneralEditOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleGeneralSave}>Save Changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Contact Details Edit Dialog */}
            <Dialog open={isContactEditOpen} onOpenChange={setIsContactEditOpen}>
                <DialogContent className="sm:max-w-[525px]">
                    <DialogHeader>
                        <DialogTitle>Edit Contact Details</DialogTitle>
                        <DialogDescription>
                            Update your agency's contact information. Click save when you're done.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="address" className="text-right">
                                Address
                            </Label>
                            <Textarea
                                id="address"
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                className="col-span-3"
                                rows={2}
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="phone" className="text-right">
                                Phone
                            </Label>
                            <Input
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="website" className="text-right">
                                Website
                            </Label>
                            <Input
                                id="website"
                                name="website"
                                value={formData.website}
                                onChange={handleInputChange}
                                className="col-span-3"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsContactEditOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleContactSave}>Save Changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Branding Edit Dialog */}
            <Dialog open={isBrandingEditOpen} onOpenChange={setIsBrandingEditOpen}>
                <DialogContent className="sm:max-w-[525px]">
                    <DialogHeader>
                        <DialogTitle>Edit Branding Settings</DialogTitle>
                        <DialogDescription>
                            Update your agency's branding and appearance. Click save when you're done.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="logo" className="text-right">
                                Logo URL
                            </Label>
                            <Input
                                id="logo"
                                name="logo"
                                value={formData.logo || ""}
                                onChange={handleInputChange}
                                placeholder="https://example.com/logo.png"
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="primaryColor" className="text-right">
                                Primary Color
                            </Label>
                            <div className="col-span-3 flex gap-2">
                                <Input
                                    type="color"
                                    id="primaryColor"
                                    name="primaryColor"
                                    value={formData.primaryColor || "#4f46e5"}
                                    onChange={handleInputChange}
                                    className="w-12 h-10 p-1"
                                />
                                <Input
                                    id="primaryColorText"
                                    name="primaryColor"
                                    value={formData.primaryColor || "#4f46e5"}
                                    onChange={handleInputChange}
                                    className="flex-1"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="secondaryColor" className="text-right">
                                Secondary Color
                            </Label>
                            <div className="col-span-3 flex gap-2">
                                <Input
                                    type="color"
                                    id="secondaryColor"
                                    name="secondaryColor"
                                    value={formData.secondaryColor || "#10b981"}
                                    onChange={handleInputChange}
                                    className="w-12 h-10 p-1"
                                />
                                <Input
                                    id="secondaryColorText"
                                    name="secondaryColor"
                                    value={formData.secondaryColor || "#10b981"}
                                    onChange={handleInputChange}
                                    className="flex-1"
                                />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsBrandingEditOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleBrandingSave}>Save Changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Document Info Dialog */}
            <Dialog open={isDocumentInfoOpen} onOpenChange={setIsDocumentInfoOpen}>
                <DialogContent className="sm:max-w-[525px]">
                    <DialogHeader>
                        <DialogTitle>How Care Workers Access Documents</DialogTitle>
                        <DialogDescription>
                            Information about how care workers can view and access agency documents
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="flex items-start space-x-4">
                            <div className="mt-0.5">
                                <CheckCircle2 className="h-5 w-5 text-green-500" />
                            </div>
                            <div>
                                <h4 className="text-sm font-medium">Mobile App Access</h4>
                                <p className="text-sm text-muted-foreground">
                                    Care workers can access all documents through the "Documents" section in their mobile app.
                                </p>
                            </div>
                        </div>
                        <Separator />
                        <div className="flex items-start space-x-4">
                            <div className="mt-0.5">
                                <CheckCircle2 className="h-5 w-5 text-green-500" />
                            </div>
                            <div>
                                <h4 className="text-sm font-medium">Web Portal</h4>
                                <p className="text-sm text-muted-foreground">
                                    Documents are also available through the web portal under "Resources" → "Agency Documents".
                                </p>
                            </div>
                        </div>
                        <Separator />
                        <div className="flex items-start space-x-4">
                            <div className="mt-0.5">
                                <CheckCircle2 className="h-5 w-5 text-green-500" />
                            </div>
                            <div>
                                <h4 className="text-sm font-medium">Notifications</h4>
                                <p className="text-sm text-muted-foreground">
                                    Care workers receive notifications when new documents are uploaded or existing ones are updated.
                                </p>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={() => setIsDocumentInfoOpen(false)}>Close</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
