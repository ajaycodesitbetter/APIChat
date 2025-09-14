import React, { useState, useRef, useEffect } from 'react'

// Types
interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  provider?: string
  streaming?: boolean
}

interface Conversation {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
  providerId: string
  pinned?: boolean
}

interface Provider {
  id: string
  name: string
  displayName: string
  status: 'active' | 'error'
}

// Icons as React components with proper props
const PlusIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
)

const SearchIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
)

const SendIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
  </svg>
)

const StopIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
  </svg>
)

const SettingsIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)

const ChevronDownIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
)

const PinIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
  </svg>
)

const ChatPrototype: React.FC = () => {
  // Sample data
  const [providers] = useState<Provider[]>([
    { id: 'demo', name: 'demo', displayName: 'Demo Provider', status: 'active' },
    { id: 'openai', name: 'openai', displayName: 'OpenAI GPT-4', status: 'active' },
    { id: 'mistral', name: 'mistral', displayName: 'Mistral AI', status: 'active' },
    { id: 'gemini', name: 'gemini', displayName: 'Google Gemini', status: 'active' },
  ])

  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: '1',
      title: 'Welcome to AI Chat',
      createdAt: new Date(),
      providerId: 'demo',
      pinned: true,
      messages: [
        {
          id: '1',
          role: 'assistant',
          content: 'Hello! I\'m your AI assistant. You can switch between different AI providers using the dropdown above. Try asking me something!',
          timestamp: new Date(),
          provider: 'demo'
        }
      ]
    },
    {
      id: '2',
      title: 'Code Review Help',
      createdAt: new Date(Date.now() - 86400000),
      providerId: 'openai',
      messages: [
        {
          id: '2',
          role: 'user',
          content: 'Can you help me review this React component?',
          timestamp: new Date(Date.now() - 86400000)
        }
      ]
    }
  ])

  // State
  const [activeConversationId, setActiveConversationId] = useState('1')
  const [currentMessage, setCurrentMessage] = useState('')
  const [selectedProvider, setSelectedProvider] = useState('demo')
  const [isStreaming, setIsStreaming] = useState(false)
  const [showProviderModal, setShowProviderModal] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [rightPanelOpen, setRightPanelOpen] = useState(false)
  
  // New provider form
  const [newProvider, setNewProvider] = useState({
    name: '',
    displayName: '',
    baseUrl: '',
    apiKey: ''
  })

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const activeConversation = conversations.find(c => c.id === activeConversationId)

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [activeConversation?.messages])

  // Handle message send with fake streaming
  const handleSendMessage = async () => {
    if (!currentMessage.trim() || isStreaming) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: currentMessage,
      timestamp: new Date()
    }

    // Add user message
    setConversations(prev => prev.map(conv => 
      conv.id === activeConversationId 
        ? { ...conv, messages: [...conv.messages, userMessage] }
        : conv
    ))

    setCurrentMessage('')
    setIsStreaming(true)

    // Create assistant message with streaming
    const assistantMessageId = (Date.now() + 1).toString()
    const assistantMessage: Message = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      provider: selectedProvider,
      streaming: true
    }

    // Add empty assistant message
    setConversations(prev => prev.map(conv => 
      conv.id === activeConversationId 
        ? { ...conv, messages: [...conv.messages, assistantMessage] }
        : conv
    ))

    // Simulate streaming response
    const responses = [
      "I'd be happy to help you with that! ",
      "Let me break this down for you: ",
      "Based on what you've asked, here are some key points to consider:\n\n",
      "1. **First consideration**: This is important because it affects the overall approach.\n\n",
      "2. **Second point**: Here's another aspect worth noting.\n\n",
      "3. **Final thoughts**: To wrap this up, I'd suggest focusing on these areas.\n\n",
      "Is there anything specific you'd like me to elaborate on?"
    ]

    for (let i = 0; i < responses.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 200))
      
      setConversations(prev => prev.map(conv => 
        conv.id === activeConversationId 
          ? {
              ...conv,
              messages: conv.messages.map(msg => 
                msg.id === assistantMessageId 
                  ? { 
                      ...msg, 
                      content: responses.slice(0, i + 1).join(''),
                      streaming: i < responses.length - 1
                    }
                  : msg
              )
            }
          : conv
      ))
    }

    setIsStreaming(false)
  }

  const handleStopStreaming = () => {
    setIsStreaming(false)
    setConversations(prev => prev.map(conv => 
      conv.id === activeConversationId 
        ? {
            ...conv,
            messages: conv.messages.map(msg => 
              msg.streaming ? { ...msg, streaming: false } : msg
            )
          }
        : conv
    ))
  }

  const handleNewConversation = () => {
    const newConv: Conversation = {
      id: Date.now().toString(),
      title: 'New Conversation',
      createdAt: new Date(),
      providerId: selectedProvider,
      messages: []
    }
    setConversations(prev => [newConv, ...prev])
    setActiveConversationId(newConv.id)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const filteredConversations = conversations.filter(conv =>
    conv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.messages.some(msg => msg.content.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Sidebar */}
      <div className={`${sidebarCollapsed ? 'w-16' : 'w-64'} bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 flex flex-col`}>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          {!sidebarCollapsed && (
            <button
              onClick={handleNewConversation}
              className="w-full btn-primary flex items-center justify-center gap-2 mb-3"
            >
              <PlusIcon />
              New Chat
            </button>
          )}
          
          {sidebarCollapsed ? (
            <button
              onClick={handleNewConversation}
              className="w-8 h-8 btn-primary flex items-center justify-center"
            >
              <PlusIcon />
            </button>
          ) : (
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          )}
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {!sidebarCollapsed && (
            <div className="p-2">
              {filteredConversations.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => setActiveConversationId(conv.id)}
                  className={`sidebar-item mb-1 ${activeConversationId === conv.id ? 'active' : ''}`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      {conv.pinned && <PinIcon className="w-3 h-3 text-purple-500" />}
                      <div className="truncate text-sm font-medium">{conv.title}</div>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {providers.find(p => p.id === conv.providerId)?.displayName || conv.providerId}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          {sidebarCollapsed ? (
            <button
              onClick={() => setShowSettings(true)}
              className="w-8 h-8 btn-secondary flex items-center justify-center"
            >
              <SettingsIcon />
            </button>
          ) : (
            <button
              onClick={() => setShowSettings(true)}
              className="w-full btn-secondary flex items-center justify-center gap-2"
            >
              <SettingsIcon />
              Settings
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <div className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center px-4">
          <div className="flex items-center gap-4 flex-1">
            {/* Provider Selector */}
            <div className="relative">
              <select
                value={selectedProvider}
                onChange={(e) => setSelectedProvider(e.target.value)}
                className="appearance-none bg-gray-100 dark:bg-gray-700 px-3 py-2 pr-8 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {providers.map(provider => (
                  <option key={provider.id} value={provider.id}>
                    {provider.displayName}
                  </option>
                ))}
              </select>
              <ChevronDownIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400" />
            </div>

            <button
              onClick={() => setShowProviderModal(true)}
              className="text-purple-600 hover:text-purple-700 text-sm font-medium"
            >
              + Add Provider
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setRightPanelOpen(!rightPanelOpen)}
              className="btn-secondary"
            >
              Settings
            </button>
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="btn-secondary"
            >
              {sidebarCollapsed ? '→' : '←'}
            </button>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex min-h-0">
          {/* Messages */}
          <div className="flex-1 flex flex-col">
            <div className="flex-1 overflow-y-auto p-4">
              {activeConversation?.messages.map((message) => (
                <div key={message.id} className="chat-message">
                  <div className="flex gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${
                      message.role === 'user' ? 'bg-purple-600' : 'bg-gray-600'
                    }`}>
                      {message.role === 'user' ? 'U' : 'AI'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">
                          {message.role === 'user' ? 'You' : (providers.find(p => p.id === message.provider)?.displayName || 'Assistant')}
                        </span>
                        <span className="text-xs text-gray-500">
                          {message.timestamp.toLocaleTimeString()}
                        </span>
                        {message.streaming && (
                          <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                        )}
                      </div>
                      <div className="prose max-w-none text-sm">
                        {message.content}
                        {message.streaming && (
                          <span className="inline-block w-2 h-4 bg-purple-500 ml-1 animate-pulse" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <textarea
                    ref={textareaRef}
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Type your message..."
                    className="chat-input min-h-[44px] max-h-32"
                    rows={1}
                  />
                </div>
                {isStreaming ? (
                  <button
                    onClick={handleStopStreaming}
                    className="btn-secondary flex items-center justify-center w-11 h-11"
                  >
                    <StopIcon />
                  </button>
                ) : (
                  <button
                    onClick={handleSendMessage}
                    disabled={!currentMessage.trim()}
                    className="btn-primary flex items-center justify-center w-11 h-11 disabled:opacity-50"
                  >
                    <SendIcon />
                  </button>
                )}
              </div>
              
              {/* Status Bar */}
              <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                <span>
                  {activeConversation?.messages.length || 0} messages
                </span>
                <span>
                  Provider: {providers.find(p => p.id === selectedProvider)?.displayName}
                </span>
              </div>
            </div>
          </div>

          {/* Right Panel */}
          {rightPanelOpen && (
            <div className="w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 p-4">
              <h3 className="font-semibold mb-4">Chat Settings</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Temperature</label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    defaultValue="0.7"
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Conservative</span>
                    <span>Creative</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Max Tokens</label>
                  <input
                    type="number"
                    defaultValue="2048"
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">System Prompt</label>
                  <textarea
                    placeholder="You are a helpful assistant..."
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm h-20 resize-none"
                  />
                </div>

                <button className="w-full btn-primary">
                  Save Settings
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Provider Modal */}
      {showProviderModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-96 max-w-90vw">
            <h3 className="text-lg font-semibold mb-4">Add New Provider</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Provider Name</label>
                <input
                  type="text"
                  value={newProvider.name}
                  onChange={(e) => setNewProvider(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., openrouter"
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Display Name</label>
                <input
                  type="text"
                  value={newProvider.displayName}
                  onChange={(e) => setNewProvider(prev => ({ ...prev, displayName: e.target.value }))}
                  placeholder="e.g., OpenRouter"
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Base URL</label>
                <input
                  type="url"
                  value={newProvider.baseUrl}
                  onChange={(e) => setNewProvider(prev => ({ ...prev, baseUrl: e.target.value }))}
                  placeholder="https://openrouter.ai/api/v1"
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">API Key</label>
                <input
                  type="password"
                  value={newProvider.apiKey}
                  onChange={(e) => setNewProvider(prev => ({ ...prev, apiKey: e.target.value }))}
                  placeholder="sk-..."
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                />
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <button
                onClick={() => setShowProviderModal(false)}
                className="flex-1 btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Here you would add the provider
                  console.log('Adding provider:', newProvider)
                  setShowProviderModal(false)
                  setNewProvider({ name: '', displayName: '', baseUrl: '', apiKey: '' })
                }}
                className="flex-1 btn-primary"
              >
                Add Provider
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-96 max-w-90vw max-h-90vh overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Settings</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Theme</label>
                <select className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700">
                  <option>Light</option>
                  <option>Dark</option>
                  <option>System</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Default Provider</label>
                <select className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700">
                  {providers.map(p => (
                    <option key={p.id} value={p.id}>{p.displayName}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <input type="checkbox" id="showTokens" className="rounded" />
                <label htmlFor="showTokens" className="text-sm">Show token counts</label>
              </div>

              <div className="flex items-center gap-2">
                <input type="checkbox" id="showCosts" className="rounded" />
                <label htmlFor="showCosts" className="text-sm">Show cost estimates</label>
              </div>

              <div className="flex items-center gap-2">
                <input type="checkbox" id="autoSave" className="rounded" defaultChecked />
                <label htmlFor="autoSave" className="text-sm">Auto-save conversations</label>
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <button
                onClick={() => setShowSettings(false)}
                className="flex-1 btn-secondary"
              >
                Close
              </button>
              <button className="flex-1 btn-primary">
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ChatPrototype