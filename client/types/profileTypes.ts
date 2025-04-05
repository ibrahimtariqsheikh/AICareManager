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
    category: string
    description: string
    likelihood: number
    severity: number
    score: number
    affectedParties: string
    managementPlan: string
}

export interface Document {
    name: string
    type: string
    url?: string
    uploadedAt?: string
}

export interface Profile {
    id: string
    userId: string
    avatarUrl?: string
    phone?: string
    alternatePhone?: string
    address?: string
    city?: string
    state?: string
    zipCode?: string
    emergencyContact?: string
    emergencyPhone?: string
    language?: string
    timezone?: string
    notificationPreferences?: string
    preferredName?: string
    dateOfBirth?: string
    communicationPreference?: string
    allergies?: string
    interests?: string
    hobbies?: string
    mobility?: string
    likes?: string
    dislikes?: string
    medicalHistory?: string
    emergencyContacts?: EmergencyContact[]
    familyAccess?: FamilyAccess[]
    medications?: Medication[]
    riskAssessments?: RiskAssessment[]
    documents?: Document[]
} 