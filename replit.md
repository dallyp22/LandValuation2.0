# LandIQ - Real-Time Land Valuation Tool

## Overview

LandIQ is a modern web application that provides real-time land property valuations using AI-powered analysis. The system combines user input about property characteristics with OpenAI's GPT-4 model to generate comprehensive property valuations including comparable sales data, market analysis, and confidence ratings.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **UI Components**: Shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **State Management**: TanStack Query (React Query) for server state
- **Form Management**: React Hook Form with Zod validation
- **Routing**: Wouter for lightweight client-side routing

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **API Style**: RESTful endpoints
- **AI Integration**: OpenAI GPT-4 for property valuation analysis
- **Development**: Vite for fast development builds and HMR

### Database Strategy
- **Current**: In-memory storage using Map-based implementation
- **Future**: Drizzle ORM configured for PostgreSQL integration
- **Migration Ready**: Drizzle config points to PostgreSQL for easy database addition

## Key Components

### Property Input System
- Form validation using Zod schemas
- Property characteristics capture (acreage, location, irrigation, tillable land)
- Example data population for quick testing
- Real-time validation feedback

### Valuation Engine
- OpenAI GPT-4 integration for intelligent property analysis
- Comparable sales research and analysis
- Statistical valuation ranges (P10, P50, P90)
- Confidence scoring and market narrative generation

### Results Display
- Comprehensive valuation breakdown
- Comparable sales data with source attribution
- Key factors analysis
- Export and sharing capabilities

## Data Flow

1. **User Input**: Property details entered via validated form
2. **API Request**: Data sent to `/api/valuations` endpoint
3. **AI Processing**: OpenAI analyzes property and generates valuation
4. **Response Formatting**: Results structured according to schema validation
5. **UI Display**: Formatted results presented with interactive components

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Database connectivity (PostgreSQL ready)
- **drizzle-orm**: Type-safe database queries and migrations
- **@tanstack/react-query**: Server state management
- **@hookform/resolvers**: Form validation integration
- **openai**: AI model integration

### UI Dependencies
- **@radix-ui/***: Comprehensive UI primitive components
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Component variant management
- **cmdk**: Command palette functionality
- **date-fns**: Date manipulation utilities

### Development Dependencies
- **vite**: Fast build tool and development server
- **typescript**: Type safety and development experience
- **esbuild**: Production bundling

## Deployment Strategy

### Development Environment
- Replit-optimized configuration with PostgreSQL module
- Hot module replacement via Vite
- TypeScript compilation and type checking
- Port 5000 for development server

### Production Build
- Vite frontend build to `dist/public`
- ESBuild server bundling for Node.js deployment
- Static asset serving through Express
- Autoscale deployment target configuration

### Environment Configuration
- Database URL configuration for PostgreSQL
- OpenAI API key integration
- Development vs production environment detection

## Changelog
- June 19, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.