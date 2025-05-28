"use client"

import type React from "react"
import { useState } from "react"
import { Card, } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Plus, Trash2, Pencil, FileText } from "lucide-react"
import { CustomInput } from "@/components/ui/custom-input"
import { CustomSelect } from "@/components/ui/custom-select"
import { MyCustomDateRange } from "@/app/dashboard/billing/components/my-custom-date-range"

import { CustomTextarea } from "@/components/ui/custom-textarea"
import { TextSignature } from "@/components/ui/text-signature"

interface CustomQuestion {
    id: string
    question: string
    type: 'text' | 'radio' | 'checkbox' | 'select'
    required: boolean
    options: string[]
    section: string
    answer?: string | string[]
}

const SECTIONS = [
    { id: 'client-info', title: 'Client Information' },
    { id: 'consent', title: 'Consent & Legal Capacity' },
    { id: 'health', title: 'Health & Medical Overview' },
    { id: 'final', title: 'Contingency & Sign-Off' }
]

export default function CarePlan({ user }: { user: User }) {
    const [progress, setProgress] = useState(30)
    const [signatures, setSignatures] = useState({
        consent: false,
        client: false,
        staff: false,
        coordinator: false,
    })
    const [customQuestions, setCustomQuestions] = useState<CustomQuestion[]>([])
    const [showCustomQuestions, setShowCustomQuestions] = useState(false)
    const [showDocumentUpload, setShowDocumentUpload] = useState(false)
    const [showPdfPreview, setShowPdfPreview] = useState(false)
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
    const [selectedSection, setSelectedSection] = useState<string>('')
    const [isEditing, setIsEditing] = useState<string | null>(null)

    const handleSignatureChange = (type: keyof typeof signatures, hasSignature: boolean) => {
        setSignatures((prev) => ({ ...prev, [type]: hasSignature }))
    }

    const savePlan = () => {
        alert("Care plan saved successfully!")
    }

    const addCustomQuestion = (sectionId: string) => {
        const newQuestion: CustomQuestion = {
            id: `q-${Date.now()}`,
            question: '',
            type: 'text',
            required: false,
            options: [],
            section: sectionId
        }
        setCustomQuestions([...customQuestions, newQuestion])
        setIsEditing(newQuestion.id)
    }

    const removeCustomQuestion = (id: string) => {
        setCustomQuestions(customQuestions.filter(q => q.id !== id))
    }

    const updateCustomQuestion = (id: string, updates: Partial<CustomQuestion>) => {
        setCustomQuestions(customQuestions.map(q =>
            q.id === id ? { ...q, ...updates } : q
        ))
    }

    const getQuestionsForSection = (sectionId: string) => {
        return customQuestions.filter(q => q.section === sectionId)
    }

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || [])
        setUploadedFiles([...uploadedFiles, ...files])
    }

    const removeFile = (index: number) => {
        setUploadedFiles(uploadedFiles.filter((_, i) => i !== index))
    }

    const handleAddOnToggle = (type: 'customQuestions' | 'documentUpload' | 'pdfPreview') => {
        switch (type) {
            case 'customQuestions':
                setShowCustomQuestions(!showCustomQuestions)
                if (!showCustomQuestions && customQuestions.length === 0) {
                    // Add a default question when first enabling
                    addCustomQuestion('client-info')
                }
                break
            case 'documentUpload':
                setShowDocumentUpload(!showDocumentUpload)
                break
            case 'pdfPreview':
                setShowPdfPreview(!showPdfPreview)
                break
        }
    }

    const saveQuestion = (questionId: string) => {
        const question = customQuestions.find(q => q.id === questionId)
        if (!question || !question.question.trim()) {
            // If question is empty, remove it
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
                            <CustomInput
                                placeholder="Enter your question"
                                value={question.question}
                                onChange={(value: string) =>
                                    updateCustomQuestion(question.id, { question: value })}
                            />
                            <div className="flex items-center gap-4">
                                <CustomSelect
                                    value={question.type}
                                    onChange={(value) =>
                                        updateCustomQuestion(question.id, { type: value as 'text' | 'radio' | 'checkbox' | 'select' })}
                                    options={[
                                        { value: 'text', label: 'Text Input' },
                                        { value: 'radio', label: 'Radio Buttons' },
                                        { value: 'checkbox', label: 'Checkboxes' },
                                        { value: 'select', label: 'Dropdown' }
                                    ]}
                                    placeholder="Select type"
                                    className="w-[180px]"
                                />
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
                                        <CustomInput
                                            value={option}
                                            onChange={(value: string) => {
                                                const newOptions = [...question.options]
                                                newOptions[optionIndex] = value
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
                            <CustomInput
                                placeholder="Enter your answer"
                                value={question.answer as string || ''}
                                onChange={(value: string) =>
                                    updateCustomQuestion(question.id, { answer: value })}
                            />
                        )}
                        {question.type === 'radio' && (
                            <RadioGroup
                                value={question.answer as string}
                                onValueChange={(value) =>
                                    updateCustomQuestion(question.id, { answer: value })}
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
                            <CustomSelect
                                value={question.answer as string}
                                onChange={(value) =>
                                    updateCustomQuestion(question.id, { answer: value })}
                                options={question.options.map(option => ({
                                    value: option,
                                    label: option
                                }))}
                                placeholder="Select an option"
                            />
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
                            <CustomInput id="fullName" placeholder="Enter full name" />
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
                            <CustomInput id="nhsNumber" placeholder="000 000 0000" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="contact">Contact Number</Label>
                            <CustomInput id="contact" type="tel" placeholder="+44 1234 567890" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="keySafe">Key Safe Code (optional)</Label>
                            <CustomInput id="keySafe" placeholder="Enter key safe code" />
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
                            <CustomInput id="nextOfKin" placeholder="Name and phone number" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="emergency">Emergency Contact</Label>
                            <CustomInput id="emergency" placeholder="Name and phone number" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="gp">GP Details</Label>
                        <CustomTextarea id="gp" placeholder="GP Name, Practice Address & Phone" className="min-h-[100px]" />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="socialWorker">Social Worker / Case Manager Contact</Label>
                        <CustomInput id="socialWorker" placeholder="Name and contact details" />
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
                                    <CustomInput id="printName" placeholder="Full name of person signing" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="relationship">Relationship to Client</Label>
                                    <CustomSelect
                                        options={[
                                            { value: "self", label: "Self (Client)" },
                                            { value: "spouse", label: "Spouse/Partner" },
                                            { value: "child", label: "Child" },
                                            { value: "parent", label: "Parent" },
                                            { value: "sibling", label: "Sibling" },
                                            { value: "lpa", label: "LPA (Lasting Power of Attorney)" },
                                            { value: "guardian", label: "Legal Guardian" },
                                            { value: "other", label: "Other" },
                                        ]}
                                        placeholder="Select relationship"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                <div className="space-y-2">
                                    <Label htmlFor="consentDate">Date of Consent</Label>
                                    <MyCustomDateRange oneDate={true} placeholder="Select date" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="witness">Witness Name (if required)</Label>
                                    <CustomInput id="witness" placeholder="Witness name (optional)" />
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
                        <CustomInput id="otherConditions" placeholder="Please specify any other conditions" />
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
                        <CustomInput id="otherMentalHealth" placeholder="Please specify" />
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
                        <CustomInput id="otherAllergies" placeholder="Please specify" />
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
                                    <CustomInput placeholder="Print name" />
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
                                    <CustomInput placeholder="Print name" />
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
                                    <CustomInput placeholder="Print name" />
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
