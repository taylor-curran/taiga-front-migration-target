# Taiga React Migration Guide 🚀

## Quick Start

### Install Dependencies
```bash
npm install
```

### Run the Development Server
```bash
npm run dev
```
The app will be available at http://localhost:3000

### Run Tests
```bash
# Run tests once
npm run test:run

# Run tests in watch mode
npm run test
```

## Project Overview

This is a React scaffold for migrating the Taiga frontend from AngularJS to React. The migration is **frontend-only** - the backend API remains unchanged!

### The Taiga API

📍 **API URL**: `https://api.taiga.io/api/v1`

This is the public Taiga API that:
- Has always powered the Taiga frontend
- Will continue to power the React version
- Is already configured and tested in this scaffold

### Connection Status

✅ **API connectivity is verified and working!**
- Run `npm run test:run` to see the API connection test pass
- Visit http://localhost:3000 to see the live API health check
- The test suite includes real API connectivity verification

### Why This Works

🎯 **The backend isn't changing!** 
- The Taiga API URL remains: `https://api.taiga.io/api/v1`
- All endpoints stay the same
- Authentication methods unchanged
- Data structures identical
- That's why we have tests confirming API connectivity
- The API health check on the home page proves we're connected

## Development Workflow

### 1. Preview the UI
- Start the dev server: `npm run dev`
- Open http://localhost:3000 in your browser
- Hot Module Replacement (HMR) is enabled - changes reflect instantly

### 2. Current Scaffold Features
- ✅ React 18 with Vite for blazing fast builds
- ✅ React Router v6 for navigation
- ✅ Axios for API calls (pre-configured with Taiga API)
- ✅ Vitest for testing
- ✅ Basic layout components (Header, Sidebar, Footer)
- ✅ API health check displaying connection status

### 3. Dependency Management

#### Adding New Dependencies
```bash
# Production dependencies
npm install package-name

# Dev dependencies
npm install -D package-name
```

#### Updating Dependencies
```bash
# Check for outdated packages
npm outdated

# Update a specific package
npm update package-name

# Update all dependencies (be careful!)
npm update
```

#### Key Dependencies
- **react & react-dom**: Core React library
- **react-router-dom**: Routing
- **axios**: HTTP client for API calls
- **vite**: Build tool and dev server
- **vitest**: Test runner
- **@testing-library/react**: React testing utilities

## Migration Strategy

### Phase 1: Current State ✅
- Basic scaffold with routing
- API connectivity verified
- Test infrastructure ready
- Minimal "Hello World" UI

### Phase 2: Your Turn! 
Incrementally migrate features:
1. Start with simple, standalone components
2. Port pages one at a time
3. Migrate complex features last
4. Keep the API service layer consistent

### Tips for Migration

1. **Study the Original**: The AngularJS source is in `/Users/taylorcurran/Documents/demos/homemade/taiga-front`
2. **Use the Same API**: All endpoints remain identical
3. **Test as You Go**: Add tests for each migrated component
4. **Preserve the UX**: Match the original UI/UX exactly

## Testing

### Run All Tests
```bash
npm run test:run
```

### Run Tests in Watch Mode
```bash
npm run test
```

### Current Test Coverage
- API connectivity test ✅
- API configuration test ✅
- Module loading test ✅

### Adding New Tests
Create test files next to components:
```
src/
  components/
    MyComponent.jsx
    MyComponent.test.jsx
```

## Build for Production

```bash
npm run build
```
Output will be in the `dist/` directory.

## Project Structure

```
src/
├── components/      # React components
├── pages/          # Page components
├── services/       # API services
├── styles/         # Global styles
└── test/          # Test setup
```

## Environment Variables

Create a `.env` file (copy from `.env.example`):
```bash
VITE_API_URL=https://api.taiga.io/api/v1
VITE_APP_TITLE=Taiga
VITE_APP_DEFAULT_LANGUAGE=en
```

## Troubleshooting

### Port Already in Use
```bash
# Kill the process using port 3000
lsof -ti:3000 | xargs kill -9
```

### Clear Node Modules
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## 🎉 Good Luck with the Migration!

Remember:
- The backend API isn't changing - it's the same reliable Taiga API
- Take it one component at a time
- Test early and often
- The scaffold is ready - you've got this!

Happy coding! 🚀
