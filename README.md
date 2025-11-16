# Square Clicker - Incremental Game

An incremental/idle game built with modern web technologies.

## Tech Stack

- **Language:** TypeScript
- **Framework:** React
- **Bundler:** Vite
- **Styling:** Tailwind CSS
- **State Management:** Zustand
- **Testing:** Vitest + React Testing Library
- **E2E Testing:** Playwright

## Getting Started

### Install dependencies
```bash
npm install
```

### Development
```bash
npm run dev
```

### Build for production
```bash
npm run build
```

### Preview production build
```bash
npm run preview
```

## Testing

### Run unit tests
```bash
npm test
```

### Run tests with UI
```bash
npm run test:ui
```

### Run tests with coverage
```bash
npm run test:coverage
```

### Run E2E tests
```bash
npm run test:e2e
```

### Run E2E tests with UI
```bash
npm run test:e2e:ui
```

## Project Structure

```
src/
├── components/       # React components
├── stores/          # Zustand stores
├── types/           # TypeScript type definitions
├── hooks/           # Custom React hooks
├── utils/           # Utility functions
└── test/            # Test setup and utilities
```

## Game Features

- Click to generate squares
- Buy generators that automatically produce squares
- Multiple generator types with increasing costs and production
- Real-time statistics tracking

## Building for Itch.io

To build for itch.io:

```bash
npm run build
```

The production files will be in the `dist/` directory. Zip this directory and upload to itch.io.
