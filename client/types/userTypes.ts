export interface Agency {
  id: string;
  name: string;
  isActive: boolean;
  isSuspended: boolean;
  hasScheduleV2: boolean;
  hasEMAR: boolean;
  hasFinance: boolean;
  isWeek1And2ScheduleEnabled: boolean;
  hasPoliciesAndProcedures: boolean;
  isTestAccount: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IncidentReport {
  id: string;
  reporterId: string;
  agencyId: string;
  description: string;
  severity: string;
  reportedAt: string;
}

export interface KeyContact {
  id: string;
  clientId: string;
  name: string;
  relation: string;
  phone: string;
  email?: string;
}

export interface CareOutcome {
  id: string;
  clientId: string;
  outcome: string;
}

export interface RiskAssessment {
  id: string;
  clientId: string;
  riskCategoryId: string;
  description: string;
  affectedParties: string;
  mitigationStrategy: string;
  likelihood: number;
  severity: number;
  riskScore: number;
  createdAt: string;
  updatedAt: string;
}

export interface FamilyAccess {
  id: string;
  clientId: string;
  name: string;
  relation: string;
  phone: string;
  email?: string;
}

export interface CommunicationLog {
  id: string;
  clientId: string;
  message: string;
  createdAt: string;
}

export interface User {
    id: string
    firstName: string
    lastName: string
    email: string
    role: 'SOFTWARE_OWNER' | 'OFFICE_STAFF'| 'CARE_WORKER' | 'CLIENT'
    agencyId?: string
    createdAt: string
    updatedAt: string
} 