# LandIQ - Real-Time Land Valuation Tool

A modern web application that provides real-time land property valuations using AI-powered analysis with GPT-4.1 and web search capabilities.

## Features

- **Real-Time Web Search**: Uses GPT-4.1 with web search to find current farmland sales data
- **Comprehensive Valuations**: Provides P10/P50/P90 valuation ranges with confidence scores
- **Comparable Sales Analysis**: Automatically finds and analyzes recent property sales
- **Database Storage**: PostgreSQL with full valuation history and analytics
- **Modern UI**: React + TypeScript with Tailwind CSS and Shadcn/ui components
- **Location-Based Search**: Filter and search historical valuations by location

## Architecture

### Frontend
- React 18 with TypeScript
- Tailwind CSS + Shadcn/ui components
- TanStack Query for state management
- Wouter for routing

### Backend
- Node.js + Express with TypeScript
- OpenAI GPT-4.1 with web search integration
- PostgreSQL database with Drizzle ORM
- RESTful API design

### AI Integration
- GPT-4.1 Responses API with web_search_preview tool
- Real-time market data from USDA, extension services, farm real estate companies
- Automatic citation extraction and source attribution

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Setup**
   ```bash
   # Required environment variables
   DATABASE_URL=your_postgresql_url
   OPENAI_API_KEY=your_openai_api_key
   ```

3. **Database Setup**
   ```bash
   npm run db:push
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5000`

## API Endpoints

- `POST /api/valuations` - Create new property valuation
- `GET /api/valuations/recent` - Get recent valuations
- `GET /api/valuations/:id` - Get specific valuation
- `GET /api/valuations/location/:location` - Get valuations by location

## Data Sources

The system searches real-time data from:
- USDA agricultural reports and land value surveys
- University extension services
- Farm real estate companies (Farmers National, AgRealty)
- Agricultural publications (Farm Journal, Successful Farming)
- County assessor records and auction results

## Technology Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Shadcn/ui
- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **AI**: OpenAI GPT-4.1 with web search
- **Build**: Vite for development and production builds

## Project Structure

```
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Application pages
│   │   ├── lib/           # Utilities and types
│   │   └── hooks/         # Custom React hooks
├── server/                # Node.js backend
│   ├── services/          # Business logic (OpenAI integration)
│   ├── routes.ts          # API route definitions
│   ├── storage.ts         # Database operations
│   └── db.ts             # Database connection
├── shared/                # Shared types and schemas
│   └── schema.ts          # Drizzle database schema
└── README.md
```

## Deployment

The project is configured for Replit deployment with:
- Automatic PostgreSQL database provisioning
- Environment variable management
- Production build optimization

## License

MIT License - feel free to use this project for your own land valuation needs.