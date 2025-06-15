"use client"

import type React from "react"
import { useState } from "react"
import { Card, } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Plus, Trash2, Pencil, FileText } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MyCustomDateRange } from "@/app/dashboard/billing/components/my-custom-date-range"
import { CustomTextarea } from "@/components/ui/custom-textarea"
import { TextSignature } from "@/components/ui/text-signature"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type { UserAllDetailsResponse } from "@/state/api"

// Schema for custom questions
const customQuestionSchema = z.object({
    id: z.string(),
    question: z.string().min(1, "Question is required"),
    type: z.enum(["text", "radio", "checkbox", "select"]),
    required: z.boolean(),
    options: z.array(z.string()),
    section: z.string(),
    answer: z.union([z.string(), z.array(z.string())]).optional(),
})

// Schema for signatures
const signaturesSchema = z.object({
    consent: z.boolean(),
    client: z.boolean(),
    staff: z.boolean(),
    coordinator: z.boolean(),
})

// Main care plan schema
const carePlanSchema = z.object({
    // Client Information
    fullName: z.string().min(1, "Full name is required"),
    dateOfBirth: z.date(),
    gender: z.enum(["male", "female", "other"]),
    nhsNumber: z.string().optional(),
    contactNumber: z.string().optional(),
    keySafeCode: z.string().optional(),
    address: z.string().optional(),
    accessInstructions: z.string().max(300).optional(),
    nextOfKin: z.string().optional(),
    emergencyContact: z.string().optional(),
    gpDetails: z.string().optional(),
    socialWorker: z.string().optional(),

    // Consent & Legal Capacity
    hasMentalCapacity: z.boolean(),
    hasGivenConsent: z.boolean(),
    hasLpaConsent: z.boolean(),
    consentFor: z.object({
        personalCare: z.boolean(),
        medicationAssistance: z.boolean(),
        sharingInformation: z.boolean(),
        emergencyResponse: z.boolean(),
        digitalRecords: z.boolean(),
        photosMediaUse: z.boolean(),
    }),
    consentNotes: z.string().max(300).optional(),
    consentSignature: z.object({
        name: z.string(),
        relationship: z.string(),
        date: z.date(),
        witness: z.string().optional(),
    }),

    // Health & Medical Overview
    medicalConditions: z.array(z.string()),
    otherMedicalConditions: z.string().optional(),
    mentalHealthConditions: z.array(z.string()),
    otherMentalHealthConditions: z.string().optional(),
    allergies: z.array(z.string()),
    otherAllergies: z.string().optional(),
    hasInfectionRisk: z.boolean(),
    healthDescription: z.string().max(400).optional(),

    // Final Signatures
    emergencyPlans: z.object({
        missedVisit: z.boolean(),
        noAnswer: z.boolean(),
        emergency: z.boolean(),
    }),
    otherNotes: z.string().max(400).optional(),
    summary: z.string().max(400).optional(),
    signatures: signaturesSchema,
    customQuestions: z.array(customQuestionSchema),
})

type CarePlanFormData = z.infer<typeof carePlanSchema>
type CustomQuestion = z.infer<typeof customQuestionSchema>

export default function CarePlan({ user }: { user: UserAllDetailsResponse['data'] }) {


    const [_, setSelectedSection] = useState<string>('')
    const [isEditing, setIsEditing] = useState<string | null>(null)

    // Initialize form with React Hook Form
    const form = useForm<CarePlanFormData>({
        resolver: zodResolver(carePlanSchema),
        defaultValues: {
            fullName: user?.fullName || "",
            dateOfBirth: new Date(), // Default to current date since dateOfBirth is not in the User type
            gender: "other",
            nhsNumber: user?.nhsNumber || "",
            contactNumber: user?.phoneNumber || "",
            keySafeCode: "",
            address: user?.addressLine1 ? `${user.addressLine1}${user.addressLine2 ? `, ${user.addressLine2}` : ""}, ${user.townOrCity}, ${user.county}, ${user.postalCode}` : "",
            accessInstructions: "",
            nextOfKin: "",
            emergencyContact: "",
            gpDetails: "",
            socialWorker: "",
            hasMentalCapacity: false,
            hasGivenConsent: false,
            hasLpaConsent: false,
            consentFor: {
                personalCare: false,
                medicationAssistance: false,
                sharingInformation: false,
                emergencyResponse: false,
                digitalRecords: false,
                photosMediaUse: false
            },
            consentNotes: "",
            consentSignature: {
                name: "",
                relationship: "",
                date: new Date(),
                witness: ""
            },
            medicalConditions: [],
            otherMedicalConditions: "",
            mentalHealthConditions: [],
            otherMentalHealthConditions: "",
            allergies: [],
            otherAllergies: "",
            hasInfectionRisk: false,
            healthDescription: "",
            emergencyPlans: {
                missedVisit: false,
                noAnswer: false,
                emergency: false
            },
            otherNotes: "",
            summary: "",
            signatures: {
                consent: false,
                client: false,
                staff: false,
                coordinator: false
            },
            customQuestions: []
        }
    })

    const handleSignatureChange = (type: keyof CarePlanFormData['signatures'], hasSignature: boolean) => {
        form.setValue(`signatures.${String(type)}`, hasSignature)
    }

    // const savePlan = async (data: CarePlanFormData) => {
    //     try {
    //         // Here you would typically make an API call to save the care plan
    //         ("Saving care plan:", data)
    //         alert("Care plan saved successfully!")
    //     } catch (error) {
    //         console.error("Error saving care plan:", error)
    //         alert("Failed to save care plan. Please try again.")
    //     }
    // }

    const addCustomQuestion = (sectionId: string) => {
        const newQuestion: CustomQuestion = {
            id: `q-${Date.now()}`,
            question: '',
            type: 'text',
            required: false,
            options: [],
            section: sectionId,
            answer: undefined
        }
        const currentQuestions = form.getValues("customQuestions")
        form.setValue("customQuestions", [...currentQuestions, newQuestion])
        setIsEditing(newQuestion.id)
    }

    const removeCustomQuestion = (id: string) => {
        const currentQuestions = form.getValues("customQuestions")
        form.setValue("customQuestions", currentQuestions.filter((q: CustomQuestion) => q.id !== id))
    }

    const updateCustomQuestion = (id: string, updates: Partial<CustomQuestion>) => {
        const currentQuestions = form.getValues("customQuestions")
        form.setValue("customQuestions", currentQuestions.map((q: CustomQuestion) =>
            q.id === id ? { ...q, ...updates } : q
        ))
    }

    const getQuestionsForSection = (sectionId: string): CustomQuestion[] => {
        return form.getValues("customQuestions").filter((q: CustomQuestion) => q.section === sectionId)
    }


    const saveQuestion = (questionId: string) => {
        const question = form.getValues("customQuestions").find((q: CustomQuestion) => q.id === questionId)
        if (!question || !question.question.trim()) {
            removeCustomQuestion(questionId)
            return
        }
        setIsEditing(null)
    }

    const renderQuestionInput = (question: CustomQuestion) => {
        if (isEditing === question.id) {
            return (
                <div className="p-4 border border-dashed border-neutral-200 rounded-lg bg-neutral-50/50">
                    <div className="flex justify-between items-start mb-4">
                        <div className="space-y-2 flex-1 mr-4">
                            <Input
                                placeholder="Enter your question"
                                value={question.question}
                                onChange={(e) => updateCustomQuestion(question.id, { question: e.target.value })}
                            />
                            <div className="flex items-center gap-4">
                                <Select
                                    value={question.type}
                                    onValueChange={(value) => updateCustomQuestion(question.id, { type: value as 'text' | 'radio' | 'checkbox' | 'select' })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="text">Text Input</SelectItem>
                                        <SelectItem value="radio">Radio Buttons</SelectItem>
                                        <SelectItem value="checkbox">Checkboxes</SelectItem>
                                        <SelectItem value="select">Dropdown</SelectItem>
                                    </SelectContent>
                                </Select>
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`required-${question.id}`}
                                        checked={question.required}
                                        onCheckedChange={(checked) =>
                                            updateCustomQuestion(question.id, { required: checked as boolean })}
                                    />
                                    <Label htmlFor={`required-${question.id}`} className="text-sm">
                                        Required
                                    </Label>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => saveQuestion(question.id)}
                                className="text-xs border-neutral-200"
                            >
                                Save
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeCustomQuestion(question.id)}
                                className="text-red-500 hover:text-red-600 hover:bg-red-50"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {(question.type === 'radio' || question.type === 'checkbox' || question.type === 'select') && (
                        <div className="space-y-2">
                            <Label className="text-sm text-neutral-600">Options</Label>
                            <div className="space-y-2">
                                {question.options.map((option, optionIndex) => (
                                    <div key={optionIndex} className="flex items-center gap-2">
                                        <Input
                                            value={option}
                                            onChange={(e) => {
                                                const newOptions = [...question.options]
                                                newOptions[optionIndex] = e.target.value
                                                updateCustomQuestion(question.id, { options: newOptions })
                                            }}
                                            placeholder={`Option ${optionIndex + 1}`}
                                        />
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => {
                                                const newOptions = question.options.filter((_, i) => i !== optionIndex)
                                                updateCustomQuestion(question.id, { options: newOptions })
                                            }}
                                            className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        const newOptions = [...question.options, '']
                                        updateCustomQuestion(question.id, { options: newOptions })
                                    }}
                                    className="text-xs border-neutral-200"
                                >
                                    <Plus className="h-3.5 w-3.5 mr-1" />
                                    Add Option
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            )
        }

        return (
            <div className="p-4 border border-neutral-200 rounded-lg bg-white">
                <div className="flex justify-between items-start mb-4">
                    <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <Label className="font-medium">{question.question}</Label>
                            {question.required && <span className="text-red-500 text-sm">*</span>}
                        </div>
                        {question.type === 'text' && (
                            <Input
                                placeholder="Enter your answer"
                                value={question.answer as string || ''}
                                onChange={(e) => updateCustomQuestion(question.id, { answer: e.target.value })}
                            />
                        )}
                        {question.type === 'radio' && (
                            <RadioGroup
                                value={question.answer as string}
                                onValueChange={(value) => updateCustomQuestion(question.id, { answer: value })}
                            >
                                {question.options.map((option, index) => (
                                    <div key={index} className="flex items-center space-x-2">
                                        <RadioGroupItem value={option} id={`${question.id}-${index}`} />
                                        <Label htmlFor={`${question.id}-${index}`}>{option}</Label>
                                    </div>
                                ))}
                            </RadioGroup>
                        )}
                        {question.type === 'checkbox' && (
                            <div className="space-y-2">
                                {question.options.map((option, index) => (
                                    <div key={index} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`${question.id}-${index}`}
                                            checked={(question.answer as string[] || []).includes(option)}
                                            onCheckedChange={(checked) => {
                                                const currentAnswers = question.answer as string[] || []
                                                const newAnswers = checked
                                                    ? [...currentAnswers, option]
                                                    : currentAnswers.filter(a => a !== option)
                                                updateCustomQuestion(question.id, { answer: newAnswers })
                                            }}
                                        />
                                        <Label htmlFor={`${question.id}-${index}`}>{option}</Label>
                                    </div>
                                ))}
                            </div>
                        )}
                        {question.type === 'select' && (
                            <Select
                                value={question.answer as string}
                                onValueChange={(value) => updateCustomQuestion(question.id, { answer: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select an option" />
                                </SelectTrigger>
                                <SelectContent>
                                    {question.options.map(option => (
                                        <SelectItem key={option} value={option}>
                                            {option}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsEditing(question.id)}
                        className="text-neutral-500 hover:text-neutral-700"
                    >
                        <Pencil className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Step 1: Client Information */}
            <Card className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-lg font-semibold">Client Information</h3>
                        <p className="text-xs text-muted-foreground">Enter the client's personal and contact details</p>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            setSelectedSection('client-info')
                            addCustomQuestion('client-info')
                        }}
                        className="text-xs border-neutral-200"
                    >
                        <Plus className="h-3.5 w-3.5 mr-1" />
                        Add Custom Question
                    </Button>
                </div>

                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="fullName">Full Name *</Label>
                            <Input id="fullName" placeholder="Enter full name" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="dob">Date of Birth *</Label>
                            <MyCustomDateRange oneDate={true} placeholder="Select date of birth" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Gender</Label>
                            <RadioGroup className="flex gap-4 mt-2">
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="male" id="male" />
                                    <Label htmlFor="male">Male</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="female" id="female" />
                                    <Label htmlFor="female">Female</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="other" id="other" />
                                    <Label htmlFor="other">Other</Label>
                                </div>
                            </RadioGroup>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="nhsNumber">NHS Number</Label>
                            <Input id="nhsNumber" placeholder="000 000 0000" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="contact">Contact Number</Label>
                            <Input id="contact" type="tel" placeholder="+44 1234 567890" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="keySafe">Key Safe Code (optional)</Label>
                            <Input id="keySafe" placeholder="Enter key safe code" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="address">Home Address</Label>
                        <CustomTextarea
                            id="address"
                            placeholder="Enter full address"
                            className="min-h-[100px]"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="accessInstructions">Access Instructions</Label>
                        <CustomTextarea
                            id="accessInstructions"
                            placeholder="Special instructions for accessing the property"
                            maxLength={300}
                            className="min-h-[100px]"
                        />
                        <div className="text-sm text-gray-500 text-right mt-1">0/300</div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="nextOfKin">Next of Kin Name & Contact</Label>
                            <Input id="nextOfKin" placeholder="Name and phone number" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="emergency">Emergency Contact</Label>
                            <Input id="emergency" placeholder="Name and phone number" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="gp">GP Details</Label>
                        <CustomTextarea id="gp" placeholder="GP Name, Practice Address & Phone" className="min-h-[100px]" />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="socialWorker">Social Worker / Case Manager Contact</Label>
                        <Input id="socialWorker" placeholder="Name and contact details" />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-base font-medium">Document Upload</Label>
                        <div className="border border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 hover:bg-blue-50 transition-colors cursor-pointer">
                            <FileText className="w-8 h-8 text-neutral-400 mx-auto mb-4" />
                            <p className="text-gray-600 text-sm">Click to upload ID, LPA, DOLS, or other legal documents</p>
                            <input type="file" className="hidden" multiple accept=".pdf,.jpg,.png,.doc,.docx" />
                        </div>
                    </div>

                    {/* Custom Questions for Client Information */}
                    {getQuestionsForSection('client-info').map((question) => renderQuestionInput(question))}
                </div>
            </Card>

            {/* Step 2: Consent & Legal Capacity */}
            <Card className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-lg font-semibold">Consent & Legal Capacity</h3>
                        <p className="text-xs text-muted-foreground">Document client's consent and legal capacity status</p>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            setSelectedSection('consent')
                            addCustomQuestion('consent')
                        }}
                        className="text-xs border-neutral-200"
                    >
                        <Plus className="h-3.5 w-3.5 mr-1" />
                        Add Custom Question
                    </Button>
                </div>

                <div className="space-y-6">
                    <div className="bg-neutral-100/60 p-4 rounded-lg border border-dashed border-neutral-200">
                        <h3 className="font-semibold text-gray-900 mb-4">Legal Capacity Assessment</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            <div className="flex items-center space-x-2">
                                <Checkbox id="capacity" />
                                <Label htmlFor="capacity" className="text-sm">
                                    Client has mental capacity to consent
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="consent" />
                                <Label htmlFor="consent" className="text-sm">
                                    Client has given written/verbal consent
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="lpa" />
                                <Label htmlFor="lpa" className="text-sm">
                                    Consent provided by LPA or NOK
                                </Label>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="font-semibold text-gray-900">Consent Given For:</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {[
                                "Personal care",
                                "Medication assistance",
                                "Sharing information",
                                "Emergency response",
                                "Digital records",
                                "Photos/media use",
                            ].map((item) => (
                                <div key={item} className="flex items-center space-x-2">
                                    <Checkbox id={item.replace(/\s+/g, "-").toLowerCase()} />
                                    <Label htmlFor={item.replace(/\s+/g, "-").toLowerCase()} className="text-sm">
                                        {item}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="consentNotes">Notes (optional)</Label>
                        <CustomTextarea
                            id="consentNotes"
                            placeholder="Additional consent notes"
                            maxLength={300}
                            className="min-h-[100px]"
                        />
                        <div className="text-sm text-gray-500 text-right mt-1">0/300</div>
                    </div>

                    {/* Consent Signature Section */}
                    <div className="bg-neutral-100/60 p-4 rounded-lg border border-dashed border-neutral-200">
                        <h3 className="font-semibold text-gray-900 mb-4">Consent Confirmation Signature</h3>
                        <p className="text-sm text-gray-600 mb-6">
                            By signing below, I confirm that consent has been obtained in accordance with the checkboxes selected
                            above, and I understand the care services to be provided.
                        </p>

                        <div className="bg-white p-4 rounded-lg border mb-4">
                            <Label className="font-medium mb-3 block">Client Signature (or Legal Representative)</Label>
                            <TextSignature
                                id="consentSignature"
                                onSignatureChange={(hasSignature) => handleSignatureChange("consent", hasSignature)}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                <div className="space-y-2">
                                    <Label htmlFor="printName">Print Name</Label>
                                    <Input id="printName" placeholder="Full name of person signing" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="relationship">Relationship to Client</Label>
                                    <Select>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select relationship" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="self">Self (Client)</SelectItem>
                                            <SelectItem value="spouse">Spouse/Partner</SelectItem>
                                            <SelectItem value="child">Child</SelectItem>
                                            <SelectItem value="parent">Parent</SelectItem>
                                            <SelectItem value="sibling">Sibling</SelectItem>
                                            <SelectItem value="lpa">LPA (Lasting Power of Attorney)</SelectItem>
                                            <SelectItem value="guardian">Legal Guardian</SelectItem>
                                            <SelectItem value="other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                <div className="space-y-2">
                                    <Label htmlFor="consentDate">Date of Consent</Label>
                                    <MyCustomDateRange oneDate={true} placeholder="Select date" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="witness">Witness Name (if required)</Label>
                                    <Input id="witness" placeholder="Witness name (optional)" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Custom Questions for Consent */}
                    {getQuestionsForSection('consent').map((question) => renderQuestionInput(question))}
                </div>
            </Card>

            {/* Step 3: Health & Medical Overview */}
            <Card className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-lg font-semibold">Health & Medical Overview</h3>
                        <p className="text-xs text-muted-foreground">Document client's health conditions and medical history</p>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            setSelectedSection('health')
                            addCustomQuestion('health')
                        }}
                        className="text-xs border-neutral-200"
                    >
                        <Plus className="h-3.5 w-3.5 mr-1" />
                        Add Custom Question
                    </Button>
                </div>

                <div className="space-y-6">
                    <div className="space-y-4">
                        <h3 className="font-semibold text-gray-900">Medical Conditions (tick all that apply):</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {[
                                "Dementia",
                                "Stroke",
                                "Diabetes",
                                "Parkinson's",
                                "Arthritis",
                                "COPD/Asthma",
                                "Cancer",
                                "High/Low blood pressure",
                                "Heart condition",
                                "Epilepsy",
                                "Learning Disability",
                            ].map((condition) => (
                                <div key={condition} className="flex items-center space-x-2">
                                    <Checkbox id={condition.replace(/\s+/g, "-").toLowerCase()} />
                                    <Label htmlFor={condition.replace(/\s+/g, "-").toLowerCase()} className="text-sm">
                                        {condition}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="otherConditions">Other Medical Conditions</Label>
                        <Input id="otherConditions" placeholder="Please specify any other conditions" />
                    </div>

                    <div className="space-y-4">
                        <h3 className="font-semibold text-gray-900">Mental Health Conditions:</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {["Depression", "Anxiety", "Bipolar", "Schizophrenia", "PTSD", "None"].map((condition) => (
                                <div key={condition} className="flex items-center space-x-2">
                                    <Checkbox id={`mental-${condition.replace(/\s+/g, "-").toLowerCase()}`} />
                                    <Label htmlFor={`mental-${condition.replace(/\s+/g, "-").toLowerCase()}`} className="text-sm">
                                        {condition}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="otherMentalHealth">Other Mental Health Conditions</Label>
                        <Input id="otherMentalHealth" placeholder="Please specify" />
                    </div>

                    <div className="space-y-4">
                        <h3 className="font-semibold text-gray-900">Allergies:</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                            {["None", "Medication", "Food", "Materials (latex, plasters)"].map((allergy) => (
                                <div key={allergy} className="flex items-center space-x-2">
                                    <Checkbox id={`allergy-${allergy.replace(/\s+/g, "-").toLowerCase()}`} />
                                    <Label htmlFor={`allergy-${allergy.replace(/\s+/g, "-").toLowerCase()}`} className="text-sm">
                                        {allergy}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="otherAllergies">Other Allergies</Label>
                        <Input id="otherAllergies" placeholder="Please specify" />
                    </div>

                    <div className="space-y-2">
                        <Label>Infection Risk:</Label>
                        <RadioGroup className="flex gap-4 mt-2">
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="no" id="infection-no" />
                                <Label htmlFor="infection-no">No</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="yes" id="infection-yes" />
                                <Label htmlFor="infection-yes">Yes — MRSA / Hep B or C / COVID / Other</Label>
                            </div>
                        </RadioGroup>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="healthDescription">Overall Health Condition Description</Label>
                        <CustomTextarea
                            id="healthDescription"
                            placeholder="E.g. 'Client has well-controlled diabetes and arthritis. Recently recovering from mild stroke with right-side weakness.'"
                            maxLength={400}
                            className="min-h-[100px]"
                        />
                        <div className="text-sm text-gray-500 text-right mt-1">0/400</div>
                    </div>

                    {/* Custom Questions for Health */}
                    {getQuestionsForSection('health').map((question) => renderQuestionInput(question))}
                </div>
            </Card>

            {/* Step 10: Final Signatures */}
            <Card className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-lg font-semibold">Contingency & Sign-Off</h3>
                        <p className="text-xs text-muted-foreground">Finalize the care plan with required signatures</p>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            setSelectedSection('final')
                            addCustomQuestion('final')
                        }}
                        className="text-xs border-neutral-200"
                    >
                        <Plus className="h-3.5 w-3.5 mr-1" />
                        Add Custom Question
                    </Button>
                </div>

                <div className="space-y-6">
                    <div className="space-y-4">
                        <h3 className="font-semibold text-gray-900">Emergency Plans:</h3>
                        <div className="grid grid-cols-1 gap-3">
                            {[
                                "Missed Visit – contact office after 15 mins",
                                "No Answer – retry, then call NOK",
                                "Emergency – Call 999 and log incident",
                            ].map((plan) => (
                                <div key={plan} className="flex items-center space-x-2">
                                    <Checkbox id={plan.replace(/\s+/g, "-").toLowerCase()} />
                                    <Label htmlFor={plan.replace(/\s+/g, "-").toLowerCase()} className="text-sm">
                                        {plan}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="otherNotes">Other Notes or Concerns</Label>
                        <CustomTextarea
                            id="otherNotes"
                            placeholder="E.g. 'Daughter checks in every 2 days. Client scared of strangers entering. Lock box must be used.'"
                            maxLength={400}
                            className="min-h-[100px]"
                        />
                        <div className="text-sm text-gray-500 text-right mt-1">0/400</div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="summary">Summary of Needs and Goals</Label>
                        <CustomTextarea
                            id="summary"
                            placeholder="E.g. 'Client is at moderate risk of falls, needs support with all personal care, and suffers mild cognitive decline. Priorities are safety, routine, and social engagement.'"
                            maxLength={400}
                            className="min-h-[100px]"
                        />
                        <div className="text-sm text-gray-500 text-right mt-1">0/400</div>
                    </div>

                    {/* Digital Signatures */}
                    <div className="bg-neutral-100/60 p-4 rounded-lg border border-dashed border-neutral-200">
                        <h3 className="font-semibold text-gray-900 mb-6">Digital Signatures Required:</h3>

                        {/* Client/NOK Signature */}
                        <div className="bg-white p-4 rounded-lg border mb-6">
                            <Label className="font-medium mb-3 block">Client / Next of Kin Signature</Label>
                            <TextSignature
                                id="clientSignature"
                                onSignatureChange={(hasSignature) => handleSignatureChange("client", hasSignature)}
                            />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                <div className="space-y-2">
                                    <Label>Print Name</Label>
                                    <Input placeholder="Print name" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Date & Time</Label>
                                    <MyCustomDateRange oneDate={true} placeholder="Select date and time" />
                                </div>
                            </div>
                        </div>

                        {/* Staff Member Signature */}
                        <div className="bg-white p-4 rounded-lg border mb-6">
                            <Label className="font-medium mb-3 block">Staff Member Completing</Label>
                            <TextSignature
                                id="staffSignature"
                                onSignatureChange={(hasSignature) => handleSignatureChange("staff", hasSignature)}
                            />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                <div className="space-y-2">
                                    <Label>Print Name</Label>
                                    <Input placeholder="Print name" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Date & Time</Label>
                                    <MyCustomDateRange oneDate={true} placeholder="Select date and time" />
                                </div>
                            </div>
                        </div>

                        {/* Care Coordinator Signature */}
                        <div className="bg-white p-4 rounded-lg border">
                            <Label className="font-medium mb-3 block">Care Coordinator (Review)</Label>
                            <TextSignature
                                id="coordinatorSignature"
                                onSignatureChange={(hasSignature) => handleSignatureChange("coordinator", hasSignature)}
                            />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                <div className="space-y-2">
                                    <Label>Print Name</Label>
                                    <Input placeholder="Print name" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Date & Time</Label>
                                    <MyCustomDateRange oneDate={true} placeholder="Select date and time" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Custom Questions for Final */}
                    {getQuestionsForSection('final').map((question) => renderQuestionInput(question))}
                </div>
            </Card>
        </div>
    )
}
