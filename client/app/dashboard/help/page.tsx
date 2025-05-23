"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
    InfoIcon,
    Download,
    Upload,
    Users,
    Calendar,
    FileText,
    ChevronRight,
    ExternalLink,
    HelpCircle,
    Building2,
    Clock,
    User,
    FileUp,
} from "lucide-react"
import Link from "next/link"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function HelpPage() {
    const [activeTab, setActiveTab] = useState("getting-started")

    return (
        <div className="container mx-auto py-8 px-4 max-w-7xl">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Main content */}
                <div className="flex-1">
                    <h1 className="text-3xl font-bold mb-2">Help Center</h1>
                    <p className="text-muted-foreground mb-8">Find answers, learn how to use AI Manager, and get support</p>

                    <Tabs defaultValue="getting-started" value={activeTab} onValueChange={setActiveTab} className="mb-8">
                        <TabsList className="grid grid-cols-3 mb-8">
                            <TabsTrigger value="getting-started">Getting Started</TabsTrigger>
                            <TabsTrigger value="import-data">Import Data</TabsTrigger>
                            <TabsTrigger value="faq">FAQ</TabsTrigger>
                        </TabsList>

                        {/* Getting Started Tab */}
                        <TabsContent value="getting-started" className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Card>
                                    <CardHeader className="pb-3">
                                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                                            <Users className="h-6 w-6 text-primary" />
                                        </div>
                                        <CardTitle>Managing Clients</CardTitle>
                                        <CardDescription>Learn how to add and manage client information</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        <p className="text-sm">
                                            Add client details, medical history, and care preferences to provide personalized care.
                                        </p>
                                    </CardContent>
                                    <CardFooter>
                                        <Button variant="outline" className="w-full" onClick={() => setActiveTab("import-data")}>
                                            Learn More <ChevronRight className="h-4 w-4 ml-1" />
                                        </Button>
                                    </CardFooter>
                                </Card>

                                <Card>
                                    <CardHeader className="pb-3">
                                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                                            <Calendar className="h-6 w-6 text-primary" />
                                        </div>
                                        <CardTitle>Scheduling</CardTitle>
                                        <CardDescription>Manage appointments and care worker schedules</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        <p className="text-sm">
                                            Create and manage appointments, assign care workers, and avoid scheduling conflicts.
                                        </p>
                                    </CardContent>
                                    <CardFooter>
                                        <Button variant="outline" className="w-full">
                                            Learn More <ChevronRight className="h-4 w-4 ml-1" />
                                        </Button>
                                    </CardFooter>
                                </Card>

                                <Card>
                                    <CardHeader className="pb-3">
                                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                                            <FileText className="h-6 w-6 text-primary" />
                                        </div>
                                        <CardTitle>Reports</CardTitle>
                                        <CardDescription>Generate and analyze care reports</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        <p className="text-sm">
                                            Create detailed care reports, track client progress, and analyze care outcomes.
                                        </p>
                                    </CardContent>
                                    <CardFooter>
                                        <Button variant="outline" className="w-full">
                                            Learn More <ChevronRight className="h-4 w-4 ml-1" />
                                        </Button>
                                    </CardFooter>
                                </Card>

                                <Card>
                                    <CardHeader className="pb-3">
                                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                                            <HelpCircle className="h-6 w-6 text-primary" />
                                        </div>
                                        <CardTitle>Getting Support</CardTitle>
                                        <CardDescription>Contact our support team for assistance</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        <p className="text-sm">
                                            Reach out to our support team for technical issues, feature requests, or general questions.
                                        </p>
                                    </CardContent>
                                    <CardFooter>
                                        <Button variant="outline" className="w-full">
                                            Contact Support <ChevronRight className="h-4 w-4 ml-1" />
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </div>

                            <Alert>
                                <InfoIcon className="h-4 w-4" />
                                <AlertTitle>New features available</AlertTitle>
                                <AlertDescription>
                                    We&apos;ve recently added new reporting features and improved the scheduling interface. Check out our{" "}
                                    <Link href="#" className="underline text-primary">
                                        What&apos;s New
                                    </Link>{" "}
                                    page for details.
                                </AlertDescription>
                            </Alert>
                        </TabsContent>

                        {/* Import Data Tab */}
                        <TabsContent value="import-data" className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Import Clients Section */}
                                <Card className="overflow-hidden">
                                    <CardHeader className="pb-4 flex flex-col items-center">
                                        <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-2 relative">
                                            <User className="h-8 w-8 text-blue-600" />
                                            <div className="absolute -right-1 -bottom-1 bg-blue-500 rounded-full p-1.5">
                                                <Upload className="h-4 w-4 text-white" />
                                            </div>
                                        </div>
                                        <CardTitle className="text-xl text-center">Import clients</CardTitle>
                                        <CardDescription className="text-center">
                                            You can import up to 10,000 rows at a time.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex items-start gap-2">
                                            <InfoIcon className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                                            <div className="text-sm">
                                                <p>
                                                    For accurate mapping, please include at least one of these fields: Client Name, Date of Birth,
                                                    Address, Phone Number, Email. For more information, please visit our{" "}
                                                    <Link href="#" className="text-blue-500 hover:underline">
                                                        help center
                                                    </Link>
                                                </p>
                                            </div>
                                        </div>

                                        <div className="text-sm text-muted-foreground">
                                            By clicking &quot;Select CSV File&quot; below, I acknowledge that client data submitted from my CSV file to
                                            AI Manager may be used to provide and improve AI Manager&apos;s services as further described
                                            in our{" "}
                                            <Link href="#" className="text-blue-500 hover:underline">
                                                Terms of Service
                                            </Link>
                                            .{" "}
                                            <Link href="#" className="text-blue-500 hover:underline">
                                                Learn more
                                            </Link>{" "}
                                            about data sharing.
                                        </div>
                                    </CardContent>
                                    <CardFooter className="flex flex-col items-center gap-4">
                                        <Button className="bg-blue-600 hover:bg-blue-500 text-white w-full">Select CSV File</Button>
                                        <Button variant="ghost" className="text-blue-500 flex items-center gap-1">
                                            <Download className="h-4 w-4" />
                                            Download sample template
                                        </Button>
                                    </CardFooter>
                                </Card>

                                {/* Import Care Workers Section */}
                                <Card className="overflow-hidden">
                                    <CardHeader className="pb-4 flex flex-col items-center">
                                        <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-2 relative">
                                            <Building2 className="h-8 w-8 text-blue-600" />
                                            <div className="absolute -right-1 -bottom-1 bg-blue-500 rounded-full p-1.5">
                                                <Upload className="h-4 w-4 text-white" />
                                            </div>
                                        </div>
                                        <CardTitle className="text-xl text-center">Import care workers</CardTitle>
                                        <CardDescription className="text-center">
                                            You can import up to 10,000 rows at a time.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex items-start gap-2">
                                            <InfoIcon className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                                            <div className="text-sm">
                                                <p>
                                                    For accurate mapping, please include at least one of these fields: Full Name, Email, Phone
                                                    Number, Role. For more information, please visit our{" "}
                                                    <Link href="#" className="text-blue-500 hover:underline">
                                                        help center
                                                    </Link>
                                                </p>
                                            </div>
                                        </div>

                                        <div className="text-sm text-muted-foreground">
                                            By clicking &quot;Select CSV File&quot; below, I acknowledge that care worker data submitted from my CSV
                                            file to AI Manager may be used to provide and improve AI Manager&apos;s services as further
                                            described in our{" "}
                                            <Link href="#" className="text-blue-500 hover:underline">
                                                Terms of Service
                                            </Link>
                                            .{" "}
                                            <Link href="#" className="text-blue-500 hover:underline">
                                                Learn more
                                            </Link>{" "}
                                            about data sharing.
                                        </div>
                                    </CardContent>
                                    <CardFooter className="flex flex-col items-center gap-4">
                                        <Button variant="outline" className="w-full bg-blue-600 hover:bg-blue-500 text-white">
                                            Select CSV File
                                        </Button>
                                        <Button variant="ghost" className="text-blue-500 flex items-center gap-1">
                                            <Download className="h-4 w-4" />
                                            Download sample template
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </div>

                            {/* Import Schedules Section */}
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center gap-2">
                                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                                            <Clock className="h-5 w-5 text-green-600" />
                                        </div>
                                        <div>
                                            <CardTitle>Import schedules</CardTitle>
                                            <CardDescription>Import existing schedules from another system</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm mb-4">
                                        You can import schedules from other care management systems. Our system supports various formats and
                                        will map fields automatically.
                                    </p>
                                    <Button className="flex items-center gap-2">
                                        <FileUp className="h-4 w-4" />
                                        Import Schedules
                                    </Button>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* FAQ Tab */}
                        <TabsContent value="faq">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Frequently Asked Questions</CardTitle>
                                    <CardDescription>Find answers to common questions about AI Manager</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Accordion type="single" collapsible className="w-full">
                                        <AccordionItem value="item-1">
                                            <AccordionTrigger>Can I filter my uploaded CSV in the system?</AccordionTrigger>
                                            <AccordionContent>
                                                Yes, after uploading your CSV file, you can filter and sort the data in various ways. Navigate
                                                to the relevant section (Clients, Care Workers, or Schedules), and use the filter options in the
                                                top right corner of the table.
                                            </AccordionContent>
                                        </AccordionItem>

                                        <AccordionItem value="item-2">
                                            <AccordionTrigger>
                                                How do I upload my CSV to find relevant matches with minimal manual work?
                                            </AccordionTrigger>
                                            <AccordionContent>
                                                To minimize manual work, ensure your CSV includes all recommended fields. Our system uses AI to
                                                match records based on names, addresses, and other identifiers. After upload, you&apos;ll see
                                                potential matches highlighted for review, allowing you to confirm or adjust as needed.
                                            </AccordionContent>
                                        </AccordionItem>

                                        <AccordionItem value="item-3">
                                            <AccordionTrigger>How do I map custom fields with CSV data?</AccordionTrigger>
                                            <AccordionContent>
                                                During the import process, you&apos;ll see a field mapping screen where you can match your CSV
                                                columns to our system fields. For custom fields, select &quot;Map to custom field&quot; and either choose
                                                an existing custom field or create a new one. You can save this mapping for future imports.
                                            </AccordionContent>
                                        </AccordionItem>

                                        <AccordionItem value="item-4">
                                            <AccordionTrigger>Can I enrich client data after I upload it?</AccordionTrigger>
                                            <AccordionContent>
                                                Yes, AI Manager offers data enrichment options. After upload, go to the client profile and
                                                click &quot;Enrich Data.&quot; Our system can add missing contact information, verify addresses, and
                                                suggest additional details based on available information.
                                            </AccordionContent>
                                        </AccordionItem>

                                        <AccordionItem value="item-5">
                                            <AccordionTrigger>How do I properly format CSV files for import?</AccordionTrigger>
                                            <AccordionContent>
                                                For best results, ensure your CSV file has a header row with column names, uses UTF-8 encoding,
                                                and has consistent formatting for dates (YYYY-MM-DD) and phone numbers. Download our sample
                                                templates for reference. If your file has special characters or complex formatting, consider
                                                saving it as UTF-8 CSV from your spreadsheet program.
                                            </AccordionContent>
                                        </AccordionItem>

                                        <AccordionItem value="item-6">
                                            <AccordionTrigger>Can I import multiple CSV files?</AccordionTrigger>
                                            <AccordionContent>
                                                Yes, you can import multiple CSV files sequentially. Our system will detect and help you manage
                                                potential duplicates. For large datasets exceeding 10,000 rows, we recommend splitting them into
                                                multiple files and importing them one after another.
                                            </AccordionContent>
                                        </AccordionItem>
                                    </Accordion>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>

                {/* Sidebar */}
                <div className="w-full md:w-80 space-y-6 border-l border-neutral-300 pl-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Learn more</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-2">
                                <FileUp className="h-4 w-4 text-neutral-900" />
                                <Link href="#" className="text-neutral-900 hover:underline text-sm">
                                    Upload a CSV of Clients
                                </Link>
                            </div>
                            <div className="flex items-center gap-2">
                                <FileUp className="h-4 w-4 text-neutral-900" />
                                <Link href="#" className="text-neutral-900 hover:underline text-sm">
                                    Upload a CSV of Care Workers
                                </Link>
                            </div>
                            <div className="flex items-center gap-2">
                                <FileUp className="h-4 w-4 text-neutral-900" />
                                <Link href="#" className="text-neutral-900 hover:underline text-sm">
                                    Import data from another system
                                </Link>
                            </div>
                            <div className="flex items-center gap-2">
                                <ExternalLink className="h-4 w-4 text-neutral-900" />
                                <Link href="#" className="text-neutral-900 hover:underline text-sm">
                                    View more at our help center
                                </Link>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Need help?</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm">Our support team is available to assist you with any questions or issues.</p>
                            <Button className="w-full">Contact Support</Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Video tutorials</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <div className="relative aspect-video bg-muted rounded-md overflow-hidden">
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Button variant="outline" size="icon" className="rounded-full bg-white/80 hover:bg-white">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                                fill="currentColor"
                                                className="w-6 h-6"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </Button>
                                    </div>
                                </div>
                                <p className="text-sm font-medium">Getting Started with AI Manager</p>
                                <p className="text-xs text-muted-foreground">3:45 • Basic overview</p>
                            </div>

                            <div className="space-y-2">
                                <div className="relative aspect-video bg-muted rounded-md overflow-hidden">
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Button variant="outline" size="icon" className="rounded-full bg-white/80 hover:bg-white">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                                fill="currentColor"
                                                className="w-6 h-6"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </Button>
                                    </div>
                                </div>
                                <p className="text-sm font-medium">Importing and Managing Client Data</p>
                                <p className="text-xs text-muted-foreground">5:12 • Advanced tutorial</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
