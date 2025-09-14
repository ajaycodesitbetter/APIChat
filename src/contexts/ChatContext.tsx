import React, { createContext, useContext, useState, useEffect } from 'react'
import { AIProvider, UserSettings, GlobalAPIConfig } from '../types'

interface ChatContextType {
  // Providers
  providers: AIProvider[]
  activeProvider: AIProvider | null
  apiConfigs: GlobalAPIConfig
  addProvider: (provider: AIProvider) => void
  updateProvider: (id: string, provider: Partial<AIProvider>) => void
  removeProvider: (id: string) => void
  setActiveProvider: (providerId: string) => void
  updateAPIConfig: (providerId: string, config: Partial<GlobalAPIConfig[string]>) => void
  
  // Settings
  settings: UserSettings
  updateSettings: (settings: Partial<UserSettings>) => void
  
  // Streaming
  isStreaming: boolean
  streamingMessageId: string | null
  stopStreaming: () => void
}

const defaultSettings: UserSettings = {
  theme: 'system',
  accentColor: '#8b5cf6',
  language: 'en',
  autoSave: true,
  showTokenCounts: true,
  showCostEstimates: true,
  enableModeration: false,
  defaultProvider: 'demo',
  conversationDefaults: {
    temperature: 0.7,
    maxTokens: 2048,
    topP: 1
  },
  keyboardShortcuts: {
    'new-chat': 'Ctrl+N',
    'search': 'Ctrl+K',
    'settings': 'Ctrl+,'
  },
  notifications: {
    quotaWarnings: true,
    errorAlerts: true,
    newFeatures: true
  }
}

const demoProvider: AIProvider = {
  id: 'demo',
  name: 'demo',
  displayName: 'Demo Provider',
  baseUrl: 'https://demo.api.com/v1',
  authMethod: 'none',
  supportsStreaming: true,
  supportsFunctions: false,
  models: [{
    id: 'demo-model',
    name: 'demo-model',
    displayName: 'Demo Model',
    contextLength: 4096,
    inputPricing: 0.001,
    outputPricing: 0.002,
    capabilities: {
      chat: true,
      completion: true,
      functions: false,
      vision: false,
      codeExecution: false
    }
  }],
  status: 'active'
}

const ChatContext = createContext<ChatContextType | null>(null)

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [providers, setProviders] = useState<AIProvider[]>([demoProvider])
  const [activeProvider, setActiveProviderState] = useState<AIProvider | null>(demoProvider)
  const [apiConfigs, setApiConfigs] = useState<GlobalAPIConfig>({})
  const [settings, setSettings] = useState<UserSettings>(defaultSettings)
  const [isStreaming, setIsStreaming] = useState(false)
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null)

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const savedProviders = localStorage.getItem('ai-chat-providers')
      const savedConfigs = localStorage.getItem('ai-chat-configs')
      const savedSettings = localStorage.getItem('ai-chat-settings')
      
      if (savedProviders) {
        const parsed = JSON.parse(savedProviders)
        setProviders([...parsed, demoProvider]) // Always include demo
      }
      
      if (savedConfigs) {
        setApiConfigs(JSON.parse(savedConfigs))
      }
      
      if (savedSettings) {
        setSettings({ ...defaultSettings, ...JSON.parse(savedSettings) })
      }
    } catch (error) {
      console.warn('Failed to load saved data:', error)
    }
  }, [])

  // Save data to localStorage when changed
  useEffect(() => {
    const providersToSave = providers.filter(p => p.id !== 'demo')
    localStorage.setItem('ai-chat-providers', JSON.stringify(providersToSave))
  }, [providers])

  useEffect(() => {
    localStorage.setItem('ai-chat-configs', JSON.stringify(apiConfigs))
  }, [apiConfigs])

  useEffect(() => {
    localStorage.setItem('ai-chat-settings', JSON.stringify(settings))
  }, [settings])

  const addProvider = (provider: AIProvider) => {
    setProviders(prev => [...prev, provider])
  }

  const updateProvider = (id: string, updates: Partial<AIProvider>) => {
    setProviders(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p))
    if (activeProvider?.id === id) {
      setActiveProviderState(prev => prev ? { ...prev, ...updates } : prev)
    }
  }

  const removeProvider = (id: string) => {
    if (id === 'demo') return // Can't remove demo provider
    
    setProviders(prev => prev.filter(p => p.id !== id))
    if (activeProvider?.id === id) {
      setActiveProviderState(demoProvider)
    }
    
    // Remove API config as well
    setApiConfigs(prev => {
      const { [id]: removed, ...rest } = prev
      return rest
    })
  }

  const setActiveProvider = (providerId: string) => {
    const provider = providers.find(p => p.id === providerId)
    if (provider) {
      setActiveProviderState(provider)
    }
  }

  const updateAPIConfig = (providerId: string, config: Partial<GlobalAPIConfig[string]>) => {
    setApiConfigs(prev => ({
      ...prev,
      [providerId]: {
        ...prev[providerId],
        providerId,
        ...config
      }
    }))
  }

  const updateSettings = (newSettings: Partial<UserSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }))
  }

  const stopStreaming = () => {
    setIsStreaming(false)
    setStreamingMessageId(null)
  }

  const value: ChatContextType = {
    providers,
    activeProvider,
    apiConfigs,
    addProvider,
    updateProvider,
    removeProvider,
    setActiveProvider,
    updateAPIConfig,
    settings,
    updateSettings,
    isStreaming,
    streamingMessageId,
    stopStreaming
  }

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  )
}

export function useChat() {
  const context = useContext(ChatContext)
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider')
  }
  return context
}