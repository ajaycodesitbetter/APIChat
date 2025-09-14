# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Development Commands

### Core Development
```bash
# Install dependencies
npm install

# Start development server (runs on port 3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code (ESLint with TypeScript)
npm run lint
```

### Windows PowerShell Commands
```powershell
# Quick development setup
npm install; npm run dev

# Check build output
npm run build; Get-ChildItem -Path dist -Recurse

# Production preview with port check
netstat -an | findstr :3000; npm run preview
```

## Architecture Overview

### Tech Stack
- **Frontend**: React 19 with TypeScript
- **Build Tool**: Vite 7.x for fast development and building
- **Styling**: TailwindCSS 4.x with custom purple theme
- **State Management**: React hooks (useState, useRef, useEffect)
- **Development**: ESLint for code quality

### Single-File Architecture
This project uses a **monolithic component approach** where the entire chat interface is contained in `src/ChatPrototype.tsx`. This is intentional for rapid prototyping and contains:

- **Complete UI**: All chat interface components in one file
- **Mock Provider System**: Simulated AI providers (OpenAI, Mistral, Gemini, etc.)
- **Fake Streaming**: Simulated real-time message streaming
- **State Management**: All state managed within the single component
- **Purple Theme**: Custom purple color scheme with dark/light mode support

### Key Files
- `src/ChatPrototype.tsx` - Main component (600+ lines) containing entire chat interface
- `src/App.tsx` - Simple wrapper that renders ChatPrototype
- `src/index.css` - TailwindCSS base + custom component classes
- `tailwind.config.js` - Custom purple color palette configuration
- `vite.config.ts` - Development server on port 3000

### Core Features Implemented
- **Multi-provider chat interface** with dropdown selection
- **Conversation management** with sidebar, search, and pinning
- **Real-time message streaming** (simulated)
- **Provider management** with modal for adding new AI providers
- **Settings panel** with temperature, tokens, and system prompt controls
- **Responsive design** with collapsible sidebar
- **Purple theme** with CSS custom properties and dark mode

### Component Structure Within ChatPrototype.tsx
The single file contains these logical sections:
- **TypeScript interfaces** for Message, Conversation, Provider
- **Custom SVG icon components** (PlusIcon, SearchIcon, etc.)
- **Mock data and state management** with React hooks
- **Event handlers** for messaging, streaming, navigation
- **UI sections**: Sidebar, TopBar, ChatArea, Modals

### Styling System
- **Custom CSS classes** defined in `src/index.css`:
  - `.btn-primary` - Purple button styling
  - `.btn-secondary` - Gray button styling  
  - `.chat-message` - Message container styling
  - `.chat-input` - Text input styling
  - `.sidebar-item` - Conversation list item styling
- **CSS Custom Properties** for purple theme variants
- **TailwindCSS utilities** for responsive design and dark mode
- **Extended color palette** with custom purple shades (50-950)

### Development Patterns
- **No external API calls** - everything is mocked for development
- **Simulated streaming** using setTimeout and progressive message building
- **Local state only** - no persistence or external state management
- **Component composition** within single file using logical sections
- **TypeScript strict mode** enabled with comprehensive type definitions

### Key State Management
- `conversations[]` - Array of conversation objects with messages
- `activeConversationId` - Currently selected conversation
- `selectedProvider` - Currently selected AI provider
- `isStreaming` - Controls streaming animation and stop button
- `currentMessage` - Text input state
- Modal states for provider addition and settings

### Message Flow
1. User types in `currentMessage` state
2. `handleSendMessage()` adds user message to active conversation
3. Creates assistant message with `streaming: true`
4. `setTimeout` loop simulates streaming by progressively updating message content
5. Final message marks `streaming: false`

### UI Layout
- **Three-panel design**: Collapsible sidebar + main chat + optional right panel
- **Responsive**: Sidebar collapses to icons on narrow screens
- **Dark mode**: Fully implemented with TailwindCSS dark: variants
- **Purple theme**: Consistent purple accent colors throughout interface

This architecture allows for rapid prototyping and easy modification of the chat interface without the complexity of multiple files and external dependencies.