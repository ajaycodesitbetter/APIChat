// Message Types
export type MessageRole = 'user' | 'assistant' | 'system' | 'function'

export interface Message {
  id: string
  role: MessageRole
  content: string
  timestamp: Date
  provider?: string
  model?: string
  tokenCount?: number
  cost?: number
  metadata?: {
    functionCall?: FunctionCall
    functionResponse?: string
    editHistory?: MessageEdit[]
    pinned?: boolean
  }
}

export interface MessageEdit {
  id: string
  content: string
  timestamp: Date
}

export interface FunctionCall {
  name: string
  arguments: Record<string, unknown>
}

// Conversation Types
export interface Conversation {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
  providerId: string
  folderId?: string
  pinned?: boolean
  archived?: boolean
  tags?: string[]
  settings: ConversationSettings
  systemPrompt?: string
  draft?: string
}

export interface ConversationSettings {
  temperature: number
  maxTokens: number
  topP: number
  frequencyPenalty?: number
  presencePenalty?: number
  stopSequences?: string[]
}

export interface ConversationFolder {
  id: string
  name: string
  color?: string
  parentId?: string
  createdAt: Date
}

// Provider Types
export interface AIProvider {
  id: string
  name: string
  displayName: string
  baseUrl: string
  authMethod: 'api-key' | 'bearer' | 'oauth' | 'none'
  headers?: Record<string, string>
  supportsStreaming: boolean
  supportsFunctions: boolean
  models: AIModel[]
  pricingTiers?: PricingTier[]
  status: ProviderStatus
  metadata?: {
    website?: string
    documentation?: string
    rateLimits?: RateLimit[]
  }
}

export interface AIModel {
  id: string
  name: string
  displayName: string
  contextLength: number
  inputPricing?: number  // per 1k tokens
  outputPricing?: number // per 1k tokens
  deprecated?: boolean
  capabilities: ModelCapabilities
}

export interface ModelCapabilities {
  chat: boolean
  completion: boolean
  functions: boolean
  vision: boolean
  codeExecution: boolean
}

export interface PricingTier {
  name: string
  inputPrice: number  // per 1k tokens
  outputPrice: number // per 1k tokens
  conditions?: string
}

export interface RateLimit {
  requests: number
  period: 'minute' | 'hour' | 'day'
  tokens?: number
}

export type ProviderStatus = 'active' | 'inactive' | 'error' | 'rate_limited'

// API Configuration
export interface APIConfig {
  providerId: string
  apiKey?: string
  customHeaders?: Record<string, string>
  baseUrl?: string  // Override provider default
  timeout?: number
}

export interface GlobalAPIConfig {
  [providerId: string]: APIConfig
}

// User Settings
export interface UserSettings {
  theme: 'light' | 'dark' | 'system'
  accentColor: string
  language: string
  autoSave: boolean
  showTokenCounts: boolean
  showCostEstimates: boolean
  enableModeration: boolean
  moderationProvider?: string
  defaultProvider: string
  conversationDefaults: ConversationSettings
  keyboardShortcuts: Record<string, string>
  notifications: NotificationSettings
}

export interface NotificationSettings {
  quotaWarnings: boolean
  errorAlerts: boolean
  newFeatures: boolean
}

// Search and Filtering
export interface SearchFilters {
  query?: string
  providers?: string[]
  dateRange?: {
    start: Date
    end: Date
  }
  tags?: string[]
  folders?: string[]
  messageTypes?: MessageRole[]
  pinned?: boolean
  archived?: boolean
}

export interface SearchResult {
  type: 'conversation' | 'message'
  id: string
  conversationId: string
  title: string
  snippet: string
  relevance: number
  timestamp: Date
}

// Streaming and API Response Types
export interface StreamingResponse {
  id: string
  provider: string
  model: string
  choices: StreamChoice[]
  usage?: TokenUsage
}

export interface StreamChoice {
  index: number
  delta: {
    role?: MessageRole
    content?: string
    functionCall?: Partial<FunctionCall>
  }
  finishReason?: 'stop' | 'length' | 'function_call' | 'content_filter'
}

export interface APIResponse {
  id: string
  provider: string
  model: string
  choices: Choice[]
  usage: TokenUsage
  metadata?: Record<string, unknown>
}

export interface Choice {
  index: number
  message: {
    role: MessageRole
    content: string
    functionCall?: FunctionCall
  }
  finishReason: 'stop' | 'length' | 'function_call' | 'content_filter'
}

export interface TokenUsage {
  promptTokens: number
  completionTokens: number
  totalTokens: number
  cost?: number
}

// Export and Import Types
export interface ExportData {
  version: string
  timestamp: Date
  conversations: Conversation[]
  providers?: AIProvider[]
  settings?: UserSettings
  folders?: ConversationFolder[]
}

export interface ExportOptions {
  format: 'json' | 'markdown' | 'txt' | 'csv'
  includeMetadata: boolean
  includeSystemPrompts: boolean
  includeSettings: boolean
  dateRange?: {
    start: Date
    end: Date
  }
}

// Analytics and Usage
export interface UsageStats {
  period: 'day' | 'week' | 'month' | 'year'
  totalMessages: number
  totalTokens: number
  totalCost: number
  providerBreakdown: Record<string, {
    messages: number
    tokens: number
    cost: number
  }>
  modelBreakdown: Record<string, {
    messages: number
    tokens: number
    cost: number
  }>
}

// Error Types
export interface APIError {
  code: string
  message: string
  details?: Record<string, unknown>
  retryable: boolean
  timestamp: Date
}

// Template and Preset Types
export interface MessageTemplate {
  id: string
  name: string
  content: string
  category?: string
  variables?: string[]
  createdAt: Date
}

export interface ConversationPreset {
  id: string
  name: string
  description?: string
  systemPrompt: string
  settings: ConversationSettings
  providerId: string
  tags?: string[]
}

// Security and Moderation
export interface ModerationResult {
  flagged: boolean
  categories: {
    hate: boolean
    hateThreatening: boolean
    selfHarm: boolean
    sexual: boolean
    sexualMinors: boolean
    violence: boolean
    violenceGraphic: boolean
  }
  categoryScores: Record<string, number>
}

export interface SecurityConfig {
  enableModeration: boolean
  moderationProvider: string
  blockFlaggedContent: boolean
  logModerationResults: boolean
  encryptStoredKeys: boolean
  sessionTimeout?: number
}