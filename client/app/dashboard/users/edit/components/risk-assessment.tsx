"use client"

import { useState } from "react"
import { Plus, AlertTriangle, Shield, Calendar, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CustomInput } from "@/components/ui/custom-input"
import { CustomSelect } from "@/components/ui/custom-select"
import { CustomTextarea } from "@/components/ui/custom-textarea"
import { MyCustomDateRange } from "@/app/dashboard/billing/components/my-custom-date-range"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form } from "@/components/ui/form"
import { toast } from "sonner"

type RiskCategory = "Physical Health" | "Mental Health" | "Medication" | "Environmental" | "Behavioural" | "Safeguarding" | "Social"
type BadgeVariant = "secondary" | "outline" | "destructive" | "default"


interface RiskLevel {
    level: string
    variant: BadgeVariant
    bgColor: string
}

// Schema for risk assessment
const riskSchema = z.object({
    id: z.number(),
    riskType: z.enum(["Physical Health", "Mental Health", "Medication", "Environmental", "Behavioural", "Safeguarding", "Social"]),
    title: z.string().min(1, "Risk title is required"),
    customTitle: z.string().optional(),
    description: z.string().min(1, "Description is required"),
    personsAtRisk: z.array(z.string()).min(1, "At least one person at risk must be selected"),
    likelihood: z.number().min(1).max(5),
    severity: z.number().min(1).max(5),
    existingControls: z.string().optional(),
    additionalActions: z.string().optional(),
    responsiblePerson: z.string().optional(),
    deadline: z.string().optional(),
    idealOutcome: z.string().min(1, "Ideal outcome is required"),
    measurableGoals: z.string().optional(),
    reviewNotes: z.string().optional(),
})

const reviewSchema = z.object({
    id: z.number(),
    reviewDate: z.string().min(1, "Review date is required"),
    reviewedBy: z.string().min(1, "Reviewer name is required"),
    changesRequired: z.boolean(),
    changes: z.string().optional(),
    managerSignOff: z.string().optional(),
})

const basicInfoSchema = z.object({
    // Removed fields as requested
})

type RiskFormData = z.infer<typeof riskSchema>
type ReviewFormData = z.infer<typeof reviewSchema>
type BasicInfoFormData = z.infer<typeof basicInfoSchema>

export default function RiskAssessment() {
    const [basicInfo] = useState<BasicInfoFormData>({
        // Removed fields as requested
    })

    const [risks, setRisks] = useState<RiskFormData[]>([])
    const [reviews, setReviews] = useState<ReviewFormData[]>([])

    const basicInfoForm = useForm<BasicInfoFormData>({
        resolver: zodResolver(basicInfoSchema),
        defaultValues: basicInfo,
    })


    const riskCategories: Record<RiskCategory, string[]> = {
        "Physical Health": [
            "Falls Risk",
            "Pressure Sores/Ulcers",
            "Malnutrition/Dehydration",
            "Choking Risk",
            "Mobility Issues",
            "Cardiac/Respiratory Issues",
            "Diabetes Management",
            "Seizure Risk",
            "Infection Risk",
            "Physical Deterioration",
            "Custom",
        ],
        "Mental Health": [
            "Depression/Low Mood",
            "Anxiety Disorders",
            "Dementia/Cognitive Decline",
            "Self-Harm Risk",
            "Suicidal Ideation",
            "Confusion/Disorientation",
            "Agitation/Aggression",
            "Social Isolation",
            "Substance Abuse",
            "Mental Health Crisis",
            "Custom",
        ],
        "Medication": [
            "Medication Errors",
            "Non-Compliance",
            "Polypharmacy Risks",
            "Allergic Reactions",
            "Side Effects Management",
            "Storage Issues",
            "Administration Errors",
            "Drug Interactions",
            "Controlled Substances",
            "Medication Refusal",
            "Custom",
        ],
        "Environmental": [
            "Fire Safety",
            "Trip Hazards",
            "Poor Lighting",
            "Temperature Control",
            "Electrical Safety",
            "Gas Safety",
            "Water Safety",
            "Structural Hazards",
            "Equipment Malfunction",
            "Pest Control",
            "Custom",
        ],
        "Behavioural": [
            "Verbal Aggression",
            "Physical Aggression",
            "Wandering/Absconding",
            "Inappropriate Behaviour",
            "Non-Cooperation",
            "Challenging Behaviour",
            "Sexual Disinhibition",
            "Hoarding Behaviour",
            "Sleep Disturbances",
            "Repetitive Behaviours",
            "Custom",
        ],
        "Safeguarding": [
            "Financial Abuse",
            "Physical Abuse",
            "Emotional Abuse",
            "Sexual Abuse",
            "Neglect",
            "Discriminatory Abuse",
            "Domestic Abuse",
            "Modern Slavery",
            "Self-Neglect",
            "Institutional Abuse",
            "Custom",
        ],
        "Social": [
            "Social Isolation",
            "Family Conflicts",
            "Communication Barriers",
            "Cultural/Religious Needs",
            "Relationship Issues",
            "Community Access",
            "Bereavement",
            "Financial Hardship",
            "Housing Issues",
            "Transport Issues",
            "Custom",
        ],
    }

    const personsAtRisk = ["Client", "Staff", "Visitors", "Family Members", "Other Residents", "General Public"]

    const calculateRiskScore = (likelihood: number, severity: number) => {
        return likelihood * severity
    }

    const getRiskLevel = (score: number): RiskLevel => {
        if (score <= 4) return { level: "Low", variant: "secondary", bgColor: "bg-green-50 border-green-200" }
        if (score <= 9) return { level: "Medium", variant: "outline", bgColor: "bg-amber-50 border-amber-200" }
        return { level: "High", variant: "destructive", bgColor: "bg-red-50 border-red-200" }
    }

    const addRisk = () => {
        const newRisk: RiskFormData = {
            id: Date.now(),
            riskType: "Physical Health",
            title: "",
            customTitle: "",
            description: "",
            personsAtRisk: [],
            likelihood: 1,
            severity: 1,
            existingControls: "",
            additionalActions: "",
            responsiblePerson: "",
            deadline: "",
            idealOutcome: "",
            measurableGoals: "",
            reviewNotes: "",
        }
        setRisks([...risks, newRisk])
    }

    const validateRisk = (risk: RiskFormData) => {
        const result = riskSchema.safeParse(risk)
        if (!result.success) {
            const errors = result.error.errors
            toast.error(errors.map(err => err.message).join(", "))
            return false
        }
        return true
    }

    const validateReview = (review: ReviewFormData) => {
        const result = reviewSchema.safeParse(review)
        if (!result.success) {
            const errors = result.error.errors
            toast.error(errors.map(err => err.message).join(", "))
            return false
        }
        return true
    }

    const updateRisk = (id: number, field: keyof RiskFormData, value: RiskFormData[keyof RiskFormData]) => {
        const updatedRisks = risks.map((risk) => {
            if (risk.id === id) {
                const updatedRisk = { ...risk, [field]: value }
                // Validate the updated risk
                validateRisk(updatedRisk)
                return updatedRisk
            }
            return risk
        })
        setRisks(updatedRisks)
    }


    const deleteRisk = (id: number) => {
        setRisks(risks.filter((risk) => risk.id !== id))
    }

    const addReview = () => {
        const newReview: ReviewFormData = {
            id: Date.now(),
            reviewDate: "",
            reviewedBy: "",
            changesRequired: false,
            changes: "",
            managerSignOff: "",
        }
        setReviews([...reviews, newReview])
    }

    const onSubmit = (data: BasicInfoFormData) => {
        // Validate all risks
        const allRisksValid = risks.every(risk => validateRisk(risk))
        if (!allRisksValid) {
            toast.error("Please fix the errors in the risks section")
            return
        }

        // Validate all reviews
        const allReviewsValid = reviews.every(review => validateReview(review))
        if (!allReviewsValid) {
            toast.error("Please fix the errors in the reviews section")
            return
        }

        // If all validations pass, proceed with submission
        console.log("Form submitted:", { basicInfo: data, risks, reviews })
        toast.success("Risk assessment submitted successfully")
    }

    return (
        <div className="mx-auto bg-gray-50 min-h-screen">
            <Card className="mb-6">
                <CardContent className="p-6">
                    <h2 className="text-md font-semibold mb-4">Risk Assessment</h2>

                    <Form {...basicInfoForm}>
                        <form onSubmit={basicInfoForm.handleSubmit(onSubmit)} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Removed form fields as requested */}
                            </div>

                            <Tabs defaultValue="risks" className="w-full">
                                <TabsList className="grid w-full grid-cols-3">
                                    <TabsTrigger value="risks" className="flex items-center gap-2">
                                        <AlertTriangle size={16} />
                                        Risks
                                    </TabsTrigger>
                                    <TabsTrigger value="matrix" className="flex items-center gap-2">
                                        <Shield size={16} />
                                        Matrix
                                    </TabsTrigger>
                                    <TabsTrigger value="reviews" className="flex items-center gap-2">
                                        <Calendar size={16} />
                                        Reviews
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent value="risks" className="mt-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex flex-col gap-1 mt-2">
                                            <h2 className="text-lg font-semibold">Identified Risks</h2>
                                            <p className="text-sm text-neutral-500 mb-6">Document and assess potential risks to client safety and wellbeing</p>
                                        </div>

                                        <Button onClick={addRisk} className="flex items-center gap-2 mt-2 text-sm">
                                            <Plus size={18} />
                                            Add Risk
                                        </Button>
                                    </div>

                                    {risks.length === 0 ? (
                                        <Card className="border border-dashed">
                                            <CardContent className="text-center py-12">
                                                <AlertTriangle className="mx-auto text-neutral-700 mb-4" size={30} />
                                                <p className="text-sm text-neutral-700 mb-4">No risks identified yet</p>
                                                <Button
                                                    variant="outline"
                                                    className="text-sm border border-neutral-300 text-neutral-700"
                                                    onClick={addRisk}
                                                >
                                                    Add First Risk
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    ) : (
                                        <div className="space-y-6">
                                            {risks.map((risk, index) => {
                                                const riskScore = calculateRiskScore(risk.likelihood, risk.severity)
                                                const riskLevel = getRiskLevel(riskScore)

                                                return (
                                                    <Card key={risk.id} className={`border-2 ${riskLevel.bgColor}`}>
                                                        <CardHeader>
                                                            <div className="flex items-center justify-between">
                                                                <CardTitle className="text-lg">Risk #{index + 1}</CardTitle>
                                                                <div className="flex items-center gap-3">
                                                                    <Badge variant={riskLevel.variant}>
                                                                        {riskLevel.level} Risk (Score: {riskScore})
                                                                    </Badge>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() => deleteRisk(risk.id)}
                                                                        className="text-destructive hover:text-destructive"
                                                                    >
                                                                        <Trash2 size={18} />
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        </CardHeader>

                                                        <CardContent className="space-y-6">
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                                <div className="space-y-2">
                                                                    <Label className="text-sm font-medium">Risk Category *</Label>
                                                                    <CustomSelect
                                                                        value={risk.riskType}
                                                                        onChange={(value) => {
                                                                            updateRisk(risk.id, "riskType", value as RiskCategory)
                                                                            updateRisk(risk.id, "title", "")
                                                                            updateRisk(risk.id, "customTitle", "")
                                                                        }}
                                                                        options={Object.keys(riskCategories).map(category => ({
                                                                            value: category,
                                                                            label: category
                                                                        }))}
                                                                        placeholder="Select risk category"
                                                                    />
                                                                </div>

                                                                <div className="space-y-2">
                                                                    <Label className="text-sm font-medium">Specific Risk *</Label>
                                                                    {risk.riskType ? (
                                                                        <>
                                                                            <CustomSelect
                                                                                value={risk.title}
                                                                                onChange={(value) => {
                                                                                    updateRisk(risk.id, "title", value)
                                                                                    if (value !== "Custom") {
                                                                                        updateRisk(risk.id, "customTitle", "")
                                                                                    }
                                                                                }}
                                                                                options={riskCategories[risk.riskType]?.map(riskTitle => ({
                                                                                    value: riskTitle,
                                                                                    label: riskTitle
                                                                                }))}
                                                                                placeholder="Select specific risk"
                                                                            />
                                                                            {risk.title === "Custom" && (
                                                                                <CustomInput
                                                                                    value={risk.customTitle}
                                                                                    onChange={(value) => updateRisk(risk.id, "customTitle", value)}
                                                                                    placeholder="Enter custom risk name"
                                                                                    className="mt-2"
                                                                                />
                                                                            )}
                                                                        </>
                                                                    ) : (
                                                                        <div className="p-3 border rounded-md bg-muted text-sm text-neutral-700">
                                                                            Please select a risk category first
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            <div className="space-y-2">
                                                                <Label>Description of Risk *</Label>
                                                                <CustomTextarea
                                                                    value={risk.description}
                                                                    onChange={(value) => updateRisk(risk.id, "description", value)}
                                                                    placeholder="Detailed description of the risk, triggers, and circumstances when it may occur"
                                                                    className="min-h-[100px]"
                                                                />
                                                            </div>

                                                            <div className="space-y-2">
                                                                <Label>Persons at Risk *</Label>
                                                                <div className="grid grid-cols-2 gap-2">
                                                                    {personsAtRisk.map((person) => (
                                                                        <div key={person} className="flex items-center space-x-2">
                                                                            <Checkbox
                                                                                id={`${risk.id}-${person}`}
                                                                                checked={risk.personsAtRisk.includes(person)}
                                                                                onCheckedChange={(checked) => {
                                                                                    const newPersonsAtRisk = checked
                                                                                        ? [...risk.personsAtRisk, person]
                                                                                        : risk.personsAtRisk.filter((p) => p !== person)
                                                                                    updateRisk(risk.id, "personsAtRisk", newPersonsAtRisk)
                                                                                }}
                                                                            />
                                                                            <Label htmlFor={`${risk.id}-${person}`} className="text-sm font-normal">
                                                                                {person}
                                                                            </Label>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>

                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                                <div className="space-y-2">
                                                                    <Label>Likelihood (1-5) *</Label>
                                                                    <Select
                                                                        value={risk.likelihood.toString()}
                                                                        onValueChange={(value) => updateRisk(risk.id, "likelihood", Number.parseInt(value))}
                                                                    >
                                                                        <SelectTrigger>
                                                                            <SelectValue />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            <SelectItem value="1">1 - Very Unlikely</SelectItem>
                                                                            <SelectItem value="2">2 - Unlikely</SelectItem>
                                                                            <SelectItem value="3">3 - Possible</SelectItem>
                                                                            <SelectItem value="4">4 - Likely</SelectItem>
                                                                            <SelectItem value="5">5 - Very Likely</SelectItem>
                                                                        </SelectContent>
                                                                    </Select>
                                                                </div>

                                                                <div className="space-y-2">
                                                                    <Label>Severity (1-5) *</Label>
                                                                    <Select
                                                                        value={risk.severity.toString()}
                                                                        onValueChange={(value) => updateRisk(risk.id, "severity", Number.parseInt(value))}
                                                                    >
                                                                        <SelectTrigger>
                                                                            <SelectValue />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            <SelectItem value="1">1 - Negligible</SelectItem>
                                                                            <SelectItem value="2">2 - Minor</SelectItem>
                                                                            <SelectItem value="3">3 - Moderate</SelectItem>
                                                                            <SelectItem value="4">4 - Major</SelectItem>
                                                                            <SelectItem value="5">5 - Catastrophic</SelectItem>
                                                                        </SelectContent>
                                                                    </Select>
                                                                </div>
                                                            </div>

                                                            <div className="space-y-2">
                                                                <Label>Ideal Outcome / Goal *</Label>
                                                                <CustomTextarea
                                                                    value={risk.idealOutcome}
                                                                    onChange={(value) => updateRisk(risk.id, "idealOutcome", value)}
                                                                    placeholder="What is the desired outcome? e.g., Client remains free from falls, maintains independence safely"
                                                                    className="min-h-[100px]"
                                                                />
                                                            </div>

                                                            <div className="space-y-2">
                                                                <Label>Measurable Goals / Success Indicators (Optional)</Label>
                                                                <CustomTextarea
                                                                    value={risk.measurableGoals}
                                                                    onChange={(value) => updateRisk(risk.id, "measurableGoals", value)}
                                                                    placeholder="How will progress be measured? e.g., Zero falls incidents over 3 months, improved mobility scores, medication compliance >95%"
                                                                    className="min-h-[100px]"
                                                                />
                                                            </div>

                                                            <div className="space-y-2">
                                                                <Label>Existing Control Measures (Optional)</Label>
                                                                <CustomTextarea
                                                                    value={risk.existingControls}
                                                                    onChange={(value) => updateRisk(risk.id, "existingControls", value)}
                                                                    placeholder="Current measures in place to control this risk (equipment, procedures, training, etc.)"
                                                                    className="min-h-[100px]"
                                                                />
                                                            </div>

                                                            <div className="space-y-2">
                                                                <Label>Additional Actions Required (Optional)</Label>
                                                                <CustomTextarea
                                                                    value={risk.additionalActions}
                                                                    onChange={(value) => updateRisk(risk.id, "additionalActions", value)}
                                                                    placeholder="Additional steps needed to reduce risk"
                                                                    className="min-h-[100px]"
                                                                />
                                                            </div>

                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                                <div className="space-y-2">
                                                                    <Label>Responsible Person (Optional)</Label>
                                                                    <CustomInput
                                                                        value={risk.responsiblePerson}
                                                                        onChange={(value) => updateRisk(risk.id, "responsiblePerson", value)}
                                                                        placeholder="Person responsible for actions"
                                                                    />
                                                                </div>

                                                                <div className="space-y-2">
                                                                    <Label>Deadline for Action (Optional)</Label>
                                                                    <MyCustomDateRange
                                                                        oneDate={true}
                                                                        onRangeChange={(range) => {
                                                                            if (range?.from) {
                                                                                updateRisk(risk.id, "deadline", range.from.toISOString())
                                                                            }
                                                                        }}
                                                                        placeholder="Select date"
                                                                    />
                                                                </div>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                )
                                            })}
                                        </div>
                                    )}
                                </TabsContent>

                                <TabsContent value="matrix" className="mt-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex flex-col gap-1 mt-2">
                                            <h2 className="text-lg font-semibold">Risk Matrix & Summary</h2>
                                            <p className="text-sm text-neutral-500 mb-6">Visual representation of risk levels and overall assessment summary</p>
                                        </div>
                                    </div>

                                    <Card className="border">
                                        <CardContent className="p-6">
                                            <div className="overflow-x-auto">
                                                <table className="w-full border-collapse">
                                                    <thead>
                                                        <tr>
                                                            <th className="border p-3 bg-muted/50 text-left text-sm font-medium">
                                                                Likelihood →<br />
                                                                Severity ↓
                                                            </th>
                                                            <th className="border p-3 bg-muted/50 text-center text-sm font-medium">
                                                                1<br />
                                                                <span className="text-xs text-neutral-700">Very Unlikely</span>
                                                            </th>
                                                            <th className="border p-3 bg-muted/50 text-center text-sm font-medium">
                                                                2<br />
                                                                <span className="text-xs text-neutral-700">Unlikely</span>
                                                            </th>
                                                            <th className="border p-3 bg-muted/50 text-center text-sm font-medium">
                                                                3<br />
                                                                <span className="text-xs text-neutral-700">Possible</span>
                                                            </th>
                                                            <th className="border p-3 bg-muted/50 text-center text-sm font-medium">
                                                                4<br />
                                                                <span className="text-xs text-neutral-700">Likely</span>
                                                            </th>
                                                            <th className="border p-3 bg-muted/50 text-center text-sm font-medium">
                                                                5<br />
                                                                <span className="text-xs text-neutral-700">Very Likely</span>
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {[5, 4, 3, 2, 1].map((severity) => (
                                                            <tr key={severity}>
                                                                <td className="border p-3 bg-muted/50 text-sm font-medium">
                                                                    {severity}
                                                                    <br />
                                                                    <span className="text-xs text-neutral-700">
                                                                        {severity === 5 && "Catastrophic"}
                                                                        {severity === 4 && "Major"}
                                                                        {severity === 3 && "Moderate"}
                                                                        {severity === 2 && "Minor"}
                                                                        {severity === 1 && "Negligible"}
                                                                    </span>
                                                                </td>
                                                                {[1, 2, 3, 4, 5].map((likelihood) => {
                                                                    const score = likelihood * severity

                                                                    return (
                                                                        <td
                                                                            key={likelihood}
                                                                            className={`border p-3 text-center text-sm font-medium transition-colors ${score <= 4
                                                                                ? "bg-green-50 text-green-700 hover:bg-green-100"
                                                                                : score <= 9
                                                                                    ? "bg-amber-50 text-amber-700 hover:bg-amber-100"
                                                                                    : "bg-red-50 text-red-700 hover:bg-red-100"
                                                                                }`}
                                                                        >
                                                                            {score}
                                                                        </td>
                                                                    )
                                                                })}
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                                        <Card className="border bg-green-50/50">
                                            <CardContent className="p-4">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <div className="w-2 h-2 rounded-full bg-green-500" />
                                                    <h4 className="font-medium text-green-700">Low Risk (1-4)</h4>
                                                </div>
                                                <p className="text-sm text-green-600 mb-2">Acceptable risk level with existing controls</p>
                                                <div className="text-2xl font-semibold text-green-700">
                                                    {risks.filter((risk) => calculateRiskScore(risk.likelihood, risk.severity) <= 4).length}
                                                </div>
                                            </CardContent>
                                        </Card>

                                        <Card className="border bg-amber-50/50">
                                            <CardContent className="p-4">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <div className="w-2 h-2 rounded-full bg-amber-500" />
                                                    <h4 className="font-medium text-amber-700">Medium Risk (5-9)</h4>
                                                </div>
                                                <p className="text-sm text-amber-600 mb-2">Requires monitoring and additional controls</p>
                                                <div className="text-2xl font-semibold text-amber-700">
                                                    {risks.filter((risk) => {
                                                        const score = calculateRiskScore(risk.likelihood, risk.severity)
                                                        return score >= 5 && score <= 9
                                                    }).length}
                                                </div>
                                            </CardContent>
                                        </Card>

                                        <Card className="border bg-red-50/50">
                                            <CardContent className="p-4">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <div className="w-2 h-2 rounded-full bg-red-500" />
                                                    <h4 className="font-medium text-red-700">High Risk (10-25)</h4>
                                                </div>
                                                <p className="text-sm text-red-600 mb-2">Immediate action required</p>
                                                <div className="text-2xl font-semibold text-red-700">
                                                    {risks.filter((risk) => calculateRiskScore(risk.likelihood, risk.severity) >= 10).length}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>

                                    {risks.length > 0 && (
                                        <Card className="border mt-6">
                                            <CardHeader className="border-b bg-muted/50">
                                                <CardTitle className="text-base font-medium">Risk Summary</CardTitle>
                                            </CardHeader>
                                            <CardContent className="p-6">
                                                <div className="space-y-2">
                                                    {risks.map((risk, index) => {
                                                        const riskScore = calculateRiskScore(risk.likelihood, risk.severity)
                                                        const riskLevel = getRiskLevel(riskScore)
                                                        return (
                                                            <div
                                                                key={risk.id}
                                                                className="flex items-center justify-between p-3 bg-muted/30 rounded-md hover:bg-muted/50 transition-colors"
                                                            >
                                                                <div>
                                                                    <span className="text-sm font-medium">
                                                                        Risk #{index + 1}: {risk.title || "Untitled Risk"}
                                                                    </span>
                                                                    <span className="text-xs text-neutral-700 ml-2">({risk.riskType})</span>
                                                                </div>
                                                                <Badge
                                                                    variant={riskLevel.variant}
                                                                    className={`${riskLevel.variant === "secondary"
                                                                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                                                                        : riskLevel.variant === "outline"
                                                                            ? "bg-amber-100 text-amber-700 hover:bg-amber-200"
                                                                            : "bg-red-100 text-red-700 hover:bg-red-200"
                                                                        }`}
                                                                >
                                                                    {riskLevel.level} ({riskScore})
                                                                </Badge>
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )}
                                </TabsContent>

                                <TabsContent value="reviews" className="space-y-2 mt-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex flex-col gap-1 mt-2">
                                            <h2 className="text-lg font-semibold">Review History</h2>
                                            <p className="text-sm text-neutral-500 mb-6">Track and document risk assessment reviews and updates</p>
                                        </div>
                                        <Button onClick={addReview} className="flex items-center gap-2">
                                            <Plus size={18} />
                                            Add Review
                                        </Button>
                                    </div>

                                    {reviews.length === 0 ? (
                                        <Card className="border-2 border-dashed">
                                            <CardContent className="text-center py-12">
                                                <Calendar className="mx-auto text-neutral-700 mb-4" size={48} />
                                                <p className="text-sm text-neutral-700 mb-4">No reviews recorded yet</p>
                                                <Button onClick={addReview}>Add First Review</Button>
                                            </CardContent>
                                        </Card>
                                    ) : (
                                        <div className="space-y-4">
                                            {reviews.map((review, index) => (
                                                <Card key={review.id}>
                                                    <CardHeader>
                                                        <CardTitle className="text-lg">Review #{index + 1}</CardTitle>
                                                    </CardHeader>
                                                    <CardContent className="space-y-6">
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                            <div className="space-y-2">
                                                                <Label>Review Date *</Label>
                                                                <MyCustomDateRange
                                                                    oneDate={true}
                                                                    onRangeChange={(range) => {
                                                                        if (range?.from) {
                                                                            const newReviews = reviews.map((r) =>
                                                                                r.id === review.id ? { ...r, reviewDate: range.from.toISOString() } : r
                                                                            )
                                                                            setReviews(newReviews)
                                                                        }
                                                                    }}
                                                                    placeholder="Select date"
                                                                />
                                                            </div>
                                                            <div className="space-y-2">
                                                                <Label>Reviewed By *</Label>
                                                                <CustomInput
                                                                    value={review.reviewedBy}
                                                                    onChange={(value) => {
                                                                        const newReviews = reviews.map((r) =>
                                                                            r.id === review.id ? { ...r, reviewedBy: value } : r
                                                                        )
                                                                        setReviews(newReviews)
                                                                    }}
                                                                    placeholder="Reviewer name and role"
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="space-y-2">
                                                            <Label>Review Notes / Outcome Assessment (Optional)</Label>
                                                            <CustomTextarea
                                                                value={review.changes}
                                                                onChange={(value) => {
                                                                    const newReviews = reviews.map((r) =>
                                                                        r.id === review.id ? { ...r, changes: value } : r
                                                                    )
                                                                    setReviews(newReviews)
                                                                }}
                                                                placeholder="Detail any changes made to the risk assessment, progress towards goals, outcome measurements, and recommendations"
                                                                className="min-h-[100px]"
                                                            />
                                                        </div>

                                                        <div className="space-y-2">
                                                            <Label>Manager's Sign Off (Optional)</Label>
                                                            <CustomInput
                                                                value={review.managerSignOff}
                                                                onChange={(value) => {
                                                                    const newReviews = reviews.map((r) =>
                                                                        r.id === review.id ? { ...r, managerSignOff: value } : r
                                                                    )
                                                                    setReviews(newReviews)
                                                                }}
                                                                placeholder="Manager name and signature"
                                                            />
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    )}
                                </TabsContent>
                            </Tabs>
                        </form>
                    </Form>
                </CardContent>

                <div className="border-t p-6 bg-muted/50 flex justify-between items-center">
                    <div className="text-sm text-neutral-700">* Required fields | CQC Compliant Risk Assessment</div>
                    <div className="flex gap-3">
                        <Button variant="outline" className="text-sm border border-neutral-300 text-neutral-700">Save Draft</Button>
                        <Button onClick={basicInfoForm.handleSubmit(onSubmit)}>Complete Assessment</Button>
                    </div>
                </div>
            </Card>
        </div>
    )
}
