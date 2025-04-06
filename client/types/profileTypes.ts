export interface EmergencyContact {
    name: string
    relationship: string
    phone: string
}

export interface FamilyAccess {
    name: string
    phone: string
    relationship: string
}

export interface Medication {
    name: string
    type: string
    dosage: number
    frequency: string
}

export interface RiskAssessment {
    id: string
    category: string
    description: string
    affectedParties: string
    mitigationStrategy: string
    likelihood: number
    severity: number
    createdAt: string
    updatedAt: string
}

export interface Document {
    name: string
    type: string
    url?: string
    uploadedAt?: string
}

export interface Profile {
    id: string
    firstName: string
    lastName: string
    email: string
    role: string
    subRole?: string
    agencyId?: string
    addressLine1?: string
    addressLine2?: string
    townOrCity?: string
    county?: string
    postalCode?: string
    country?: string
    phoneNumber?: string
    alternatePhone?: string
    languages?: string
    secondaryLanguage?: string
    timezone?: string
    notificationPreferences?: string
    interests?: string
    likesDislikes?: string
    dietaryRequirements?: string
    allergies?: string
    history?: string
    medicalNotes?: string
    dateOfBirth?: string
    gender?: string
    room?: string
    admissionDate?: string
    medicalInfo?: {
        primaryDiagnosis?: string
        allergies?: string
        primaryPhysician?: string
        bloodType?: string
        medicalConditions?: string
        medicalNotes?: string
    }
} 