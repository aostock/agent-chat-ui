# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js application called "Agent Chat UI" that provides a chat interface for interacting with LangGraph servers. The application allows users to chat with AI agents built using LangGraph, with features like message streaming, thread management, and artifact rendering.

## Common Development Commands

### Development
```bash
pnpm dev
```
Starts the development server on http://localhost:3000

### Building
```bash
pnpm build
```
Builds the application for production

### Linting
```bash
pnpm lint
pnpm lint:fix
```
Runs ESLint to check for code issues, with an option to automatically fix fixable issues

### Formatting
```bash
pnpm format
pnpm format:check
```
Formats code with Prettier or checks if formatting is correct

## Architecture Overview

### Core Structure
- `src/app/` - Next.js app directory with pages and layout
- `src/components/` - React components organized by feature
- `src/providers/` - React context providers for state management
- `src/hooks/` - Custom React hooks
- `src/lib/` - Utility functions and shared logic

### Key Providers
1. **StreamProvider** (`src/providers/Stream.tsx`) - Manages connection to LangGraph server using `@langchain/langgraph-sdk/react`
2. **ThreadProvider** (`src/providers/Thread.tsx`) - Handles thread management and settings persistence
3. **ThemeProvider** (`src/providers/Theme.tsx`) - Manages dark/light theme switching

### Main Components
1. **Thread** (`src/components/thread/index.tsx`) - Main layout component with sidebar and chat area
2. **Chat** (`src/components/thread/chat/index.tsx`) - Chat interface with message rendering
3. **Sidebar** (`src/components/thread/sidebar.tsx`) - Thread history and settings

### State Management
- Uses React Context for global state (Stream, Thread, Theme)
- Settings are persisted in localStorage
- Thread and message state is managed by the LangGraph SDK

### Key Features
1. **Message Streaming** - Real-time message updates from LangGraph agents
2. **Thread Management** - Create, view, and archive conversation threads
3. **Artifact Rendering** - Side panel for displaying generated artifacts
4. **Settings Management** - Configurable connection to LangGraph servers
5. **UI Components** - Custom components built with Radix UI and Tailwind CSS

## Configuration
The application can be configured through:
1. Settings dialog in the UI
2. Environment variables (`NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_ASSISTANT_ID`)
3. localStorage for persistent user preferences

## Testing
Tests are not explicitly configured in this project. The application relies on the underlying LangGraph SDK for core functionality.