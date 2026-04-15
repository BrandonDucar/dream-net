# Dream Network Management Platform

## Overview
This project is a sophisticated multi-agent AI platform for collaborative dream exploration and intelligent system interaction. It features a comprehensive DreamNodes architecture with modular node-based processing, enhanced by a powerful network intelligence trinity. The platform enables real-time multi-agent orchestration, advanced analysis, and progressive access control. Key capabilities include wallet trust scoring, AI agent activation based on reputation, micro-token delivery, and live processing results with visual outputs (e.g., HTML component generation, database schema creation). 

The system now includes four coordinated intelligence systems with unified monitoring:
- **DREAMKEEPER Core**: Network monitoring and adaptive learning
- **AI Surgeon Agent**: Automated maintenance and issue resolution  
- **Dream Defense Network**: Security threat detection and neutralization
- **Evolution Engine**: Adaptive system improvement through data analysis
- **DreamScope Interface**: Unified dashboard for all intelligence systems

It leverages advanced React patterns, wallet-based authentication, and sophisticated agent communication to offer a comprehensive dream management and exploration experience. The business vision is to create a unique ecosystem for creative collaboration and personalized digital experiences in a decentralized, self-healing environment.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite.
- **UI Components**: Shadcn/UI built on Radix UI primitives.
- **Styling**: Tailwind CSS with a custom dark theme (electric cyan and gold accents).
- **Routing**: Wouter.
- **State Management**: TanStack Query for server state.
- **Forms**: React Hook Form with Zod validation.
- **UI/UX Decisions**: Terminal-style interfaces, real-time data visualization, professional WalletHeader, and visual indicators for agent status and dream properties. Dream cards are designed as 512x512 black cards with cyan glow, monospace font, and specific visual cues for remix/fusion/original dreams. Nightmare indications use a distinct red background and visual styling. Interactive dream gallery with filtering, sorting, health visualization, and hover action overlays. Dual view modes (Grid/Constellation) with interactive canvas-based visualization featuring physics simulation and emotional connections.

### Backend Architecture
- **Runtime**: Node.js with TypeScript and ES modules.
- **Framework**: Express.js.
- **API Design**: RESTful API structure with comprehensive endpoint coverage.
- **Authentication**: Wallet-based admin authentication (EIP-4361 SIWE integration).
- **Authorization**: Middleware for protected, admin-only endpoints.
- **Error Handling**: Centralized error middleware and an enhanced ErrorBoundary system with database fallback.
- **Task Routing**: Six-agent orchestration system: LUCID, CANVAS, ROOT, ECHO, CRADLE, and WING. Features intelligent, goal-based routing and progressive access control. Includes multi-agent capabilities for remix, score, and link functionality.
- **DreamCoreViewer**: Integrated component for displaying processed results from multi-agent operations, including HTML components, JSON schemas, wallet trust levels, and agent activation status.
- **Real-time Orchestration**: Live agent dashboard with status indicators, activation buttons, response panels, and terminal-style output logging.
- **Secret Vault System**: Emotional messaging backend with unlock mechanics, reply functionality, and burn operations.
- **Seasonal Events Engine**: Dynamic event system with bonus multipliers, special tokens, and progress tracking.
- **Dream Remix Processing**: Complete remix submission workflow with similarity scoring and innovation tracking.
- **Dream Drifters DAO**: System with quadratic voting, theme-based governance, vault management, and member management.
- **Dream Enhancement System**: For adding emotions, providing audience multipliers, and granting access to remix toolchains (LUCID, CANVAS, ROOT, ECHO agents).
- **Whisper Messaging System**: For emotional overlays, token-gated access, remix workflow processing, and dream lineage tracking.
- **User Progression System**: Multi-tier advancement system with XP tracking, visual customization, and tier-specific benefits.
- **Revenue Sharing System**: Multi-party distribution for earnings from dream vaults.
- **SMS Reminder System**: For dream reminders with advanced search, filtering, tagging, and export/import functionality.
- **Nightmare Network System**: With agent assignment (DREAD, SHADE, WHISPER, ECHO, CRYPT) and resolution tracking (transmutation, purification, containment).
- **Multi-token Coordination**: System (FLBY, SHEEP, CORE, ROOT) for swarm operations.

### Database Layer
- **ORM**: Drizzle ORM.
- **Database**: PostgreSQL with Neon serverless connection pooling.
- **Schema Design**: Comprehensive schema with enums and foreign key relationships for Users, Dreams, Cocoons, Dream Cores, Wallets, Evolution Chains, DreamCoreTokens, and Dream Invites. Also includes Secret Vault and Seasonal Events.
- **Migration**: Drizzle Kit for schema management.

### Data Models
The system manages core entities and supporting models:
- **Users**: For authentication.
- **Dreams**: Categorized submissions with approval workflows, trust properties, type indicators (e.g., nightmare), lineage (forkedFrom), and associated bounties (bountyId). Includes metadata ecosystem with tags and lore.
- **Cocoons**: Lifecycle management.
- **Dream Cores**: Energy and resonance tracking.
- **Wallets**: User reward system with scores, tokens, and fragments.
- **Evolution Chains**: Tracks dream progression.
- **DreamCoreTokens**: Manages minted tokens.
- **Dream Invites**: Manages pending invitations.
- **Secret Vault**: Emotional messaging system with unlock mechanics and XP rewards.
- **Seasonal Events**: Time-limited events with bonus multipliers and special rewards.

### Development Architecture
- **Monorepo Structure**: Shared TypeScript types in `/shared`.
- **Build Process**: Vite for frontend, ESBuild for backend.
- **Type Safety**: Strict TypeScript configuration.
- **Code Organization**: Feature-based.

## External Dependencies

### Database and Storage
- **Neon Database**: Serverless PostgreSQL.
- **Drizzle ORM**: Type-safe database operations.

### UI and Styling
- **Shadcn/UI**: Component library.
- **Radix UI**: Headless UI primitives.
- **Tailwind CSS**: Utility-first CSS.
- **Lucide Icons**: Icon set.

### Authentication
- **Sign-In With Ethereum (SIWE)**: EIP-4361 standard for wallet authentication.
- **MetaMask**: Wallet integration.

### Development Tools
- **Vite**: Development server and build tool.
- **TanStack Query**: Server state management.
- **React Hook Form**: Form state management.
- **Zod**: Runtime type validation.
- **html2canvas**: For capturing HTML elements as images.
- **QRCode**: For generating QR codes.

### Runtime and Build
- **Node.js**: JavaScript runtime.
- **TypeScript**: Static type checking.
- **ESBuild**: Fast JavaScript bundler.
- **PostCSS**: CSS processing.

### Integrations
- **OpenAI**: For AI-powered dream title generation.
- **Discord**: Webhook notifications.
- **Telegram**: Bot messages for notifications.