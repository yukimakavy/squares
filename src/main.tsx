import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import useGameStore from './stores/gameStore'

// Expose game store to window for testing
if (typeof window !== 'undefined') {
  (window as any).useGameStore = useGameStore;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
