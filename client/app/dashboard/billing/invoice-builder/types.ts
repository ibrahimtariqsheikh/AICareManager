export interface Client {
  id: string
  name: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  postalCode: string
  country: string
  rates: Record<string, number> // Service type to rate mapping
}

export interface CareWorker {
  id: string
  fullName: string
  email: string
}

export interface HoursEntry {
  careWorkerId: string
  serviceType: string
  hours: number
}

export interface InvoiceItem {
  id: string
  description: string
  quantity: number
  rate: number
  amount: number
  serviceType: string
  careWorkerId: string
}

export interface InvoiceData {
  invoiceNumber: string
  issueDate: string
  dueDate: string
  notes: string
  taxRate: number
  taxEnabled: boolean
}
