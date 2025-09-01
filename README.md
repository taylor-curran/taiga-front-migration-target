# Taiga Frontend React Migration

## Overview
This is the React migration scaffold for the Taiga frontend, migrating from AngularJS to React 18.

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm run test

# Build for production
npm run build
```

## Sanity Checks

✅ **API Health Check**: The Home page performs an automatic health check ping to the Taiga backend API
✅ **Basic Test**: Run `npm run test` to execute the API service test
✅ **Hello World UI**: Navigate to http://localhost:3000 after running `npm run dev`

## Project Structure

```
src/
├── components/       # Reusable UI components
├── contexts/        # React Context providers
├── hooks/          # Custom React hooks  
├── pages/          # Page-level components
├── services/       # API service layer
├── styles/         # Global styles
└── test/           # Test configuration
```

## Environment Configuration

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

## Tech Stack

- React 18.x
- Vite 5.x
- React Router 6.x
- Axios for API calls
- Vitest for testing