import { User } from './prismaTypes'

export enum MileageStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export interface MileageRecord {
  id: string
  agencyId: string
  clientId: string
  careWorkerId: string
  date: Date
  fromLocation: string
  toLocation: string
  startMileage: number
  endMileage: number
  distanceInMiles: number
  costPerMile: number
  travelTime: number
  amount: number
  notes?: string | null
  status: MileageStatus
  createdAt: Date
  updatedAt: Date
  agency: any // Replace with Agency type when available
  careWorker: User
  client: User
}

export interface MileageFormData {
  date: Date
  employee: string
  client: string
  fromAddress: string
  toAddress: string
  distance: string
  travelTime: string
  appointmentType: string
  notes?: string
} 