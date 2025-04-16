export interface Client {
  id: string
  name: string
}

export interface CustomTask {
  id: string
  name: string
  placeholder: string
  icon: string
  categoryId: string
  priority: "low" | "medium" | "high"
  frequency: "daily" | "weekly" | "as-needed"
  createdAt: string
  clients?: Client[]
}

export interface TaskCategory {
  id: string
  name: string
  color: string
}
