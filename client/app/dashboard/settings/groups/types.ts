export interface Client {
  id: string
  firstName: string
  lastName: string
  status: string
}

export interface ClientGroup {
  id: string
  name: string
  clients: Client[]
  agencyId?: string
  createdAt: string
  updatedAt: string
}
