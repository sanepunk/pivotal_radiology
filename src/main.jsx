import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { CssBaseline } from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import './index.css'
import App from './App.jsx'

// Create a root element
const root = createRoot(document.getElementById('root'))

// Render the app
root.render(
  <StrictMode>
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <CssBaseline />
      <App />
    </LocalizationProvider>
  </StrictMode>,
)
