export type ToolState = "error" | "loading" | "result" | "pending"

export type ToolInvocation = {
  toolName: string
  toolCallId: string
  state: ToolState
  result: any
  name: string
}

export type MessagePart = {
  type: string
  text?: string
  toolInvocation?: {
    toolName: string
    toolCallId: string
    state: string
    result?: any
  }
}

export type ChatMessage = {
  id: string
  role: "user" | "assistant"
  content: string
  createdAt: Date
  parts: MessagePart[]
}
