# AI Chat Interface

A production-ready ChatGPT-like web interface with multi-provider AI support and a beautiful purple theme.

## 🎯 Features

### Core Interface
- **Modern Purple Theme** - Beautiful, accessible design with dark/light mode support
- **Responsive Layout** - Works perfectly on desktop, tablet, and mobile
- **Collapsible Sidebar** - Conversation list with search and organization
- **Real-time Streaming** - Live message streaming with typing indicators
- **Provider Switching** - Easy switching between different AI providers

### AI Provider Integration
- **Multi-Provider Support** - OpenAI, Mistral, OpenRouter, Gemini, and custom providers
- **Dynamic Configuration** - Add providers through the UI with API keys
- **Per-Chat Overrides** - Use different providers and settings per conversation
- **Model Selection** - Choose specific models for each provider
- **Cost Tracking** - Monitor token usage and estimated costs

### Conversation Management
- **Smart Organization** - Pin important chats, create folders, add tags
- **Advanced Search** - Search across all conversations and messages
- **Export Options** - Export conversations as JSON, Markdown, or plain text
- **Auto-save** - Never lose your work with automatic saving
- **History Management** - Full conversation history with timestamps

### Advanced Features
- **System Prompts** - Customize AI behavior per conversation
- **Temperature Control** - Adjust creativity vs consistency
- **Token Management** - Set max tokens and monitor usage
- **Message Actions** - Edit, delete, copy, and pin messages
- **Keyboard Shortcuts** - Power user shortcuts for common actions

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Modern web browser

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd ai-chat-interface

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:3000` to see the interface.

### Adding Your First Provider

1. Click "**+ Add Provider**" in the top bar
2. Fill in the provider details:
   - **Name**: `openai` (lowercase, no spaces)
   - **Display Name**: `OpenAI GPT-4`
   - **Base URL**: `https://api.openai.com/v1`
   - **API Key**: Your OpenAI API key
3. Click "**Add Provider**"
4. Select the new provider from the dropdown

## 🏗️ Architecture

### Project Structure
```
src/
├── components/          # React components
│   ├── Sidebar.tsx     # Conversation list
│   ├── ChatArea.tsx    # Main chat interface
│   ├── MessageComponent.tsx
│   └── ...
├── contexts/           # React contexts
│   ├── ChatContext.tsx # Chat state management
│   └── ThemeContext.tsx # Theme management
├── services/          # API integrations
│   ├── openai.ts     # OpenAI adapter
│   ├── mistral.ts    # Mistral adapter
│   └── base.ts       # Base API interface
├── types/            # TypeScript definitions
├── utils/            # Helper functions
├── hooks/            # Custom React hooks
└── ChatPrototype.tsx # Single-file demo
```

### Key Components

**ChatPrototype.tsx** - Complete working prototype in a single file
**ThemeContext** - Handles dark/light mode and accent colors
**ChatContext** - Manages providers, conversations, and settings
**Message Components** - Handles different message types and streaming

## 🔧 Configuration

### Environment Variables
```bash
# Optional: Default API keys (not recommended for production)
VITE_OPENAI_API_KEY=sk-...
VITE_MISTRAL_API_KEY=...

# Optional: Analytics and monitoring
VITE_ANALYTICS_ID=...
```

### Provider Configuration
Providers are configured through the UI or can be preset in the code:

```typescript
const provider: AIProvider = {
  id: 'custom',
  name: 'custom',
  displayName: 'Custom Provider',
  baseUrl: 'https://api.custom.com/v1',
  authMethod: 'api-key',
  supportsStreaming: true,
  models: [...]
}
```

## 🔐 Security

### API Key Management
- **Client-side encryption** for stored API keys
- **Per-chat key overrides** for different accounts
- **Secure transmission** over HTTPS only
- **No server storage** - keys stay in your browser

### Recommended Deployment
For production use, deploy with a secure backend:

```bash
# Frontend (Vercel/Netlify)
npm run build

# Backend proxy (recommended)
# - Handle API key encryption
# - Implement rate limiting
# - Add usage monitoring
```

## 📱 Responsive Design

The interface adapts to all screen sizes:
- **Desktop**: Full three-panel layout
- **Tablet**: Collapsible sidebar with overlay panels
- **Mobile**: Stack layout with bottom navigation

## ⌨️ Keyboard Shortcuts

- `Ctrl/Cmd + N` - New conversation
- `Ctrl/Cmd + K` - Search conversations
- `Ctrl/Cmd + Enter` - Send message
- `Ctrl/Cmd + ,` - Open settings
- `Escape` - Close modals

## 🎨 Theming

### Purple Theme Variants
The interface includes several purple theme options:
- Light mode with purple accents
- Dark mode with purple highlights
- High contrast mode for accessibility

### Customization
Modify `tailwind.config.js` and `src/index.css` to customize colors:

```css
:root {
  --primary-purple: #8b5cf6;
  --purple-dark: #5b21b6;
  --purple-light: #f8f6ff;
}
```

## 📊 Usage Analytics

Track usage with built-in analytics:
- Token consumption per provider
- Cost estimates and budgets
- Conversation metrics
- Model performance comparisons

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run integration tests
npm run test:integration

# Run end-to-end tests
npm run test:e2e
```

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm run build
npx vercel --prod
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

### Environment Setup
1. Set up environment variables
2. Configure HTTPS certificates
3. Set up monitoring and logging
4. Configure backup for user data

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

## 🆘 Support

- **Documentation**: Check the `/docs` folder
- **Issues**: Use GitHub Issues for bug reports
- **Discussions**: Join our Discord community
- **Email**: support@ai-chat-interface.com

## 🔄 Changelog

### v1.0.0
- Initial release with core chat functionality
- Multi-provider support (OpenAI, Mistral, Gemini)
- Purple theme with dark/light mode
- Conversation management and search
- Export/import functionality