import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import { BrowserRouter } from 'react-router'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* /* <BrowserRouter> is used to enable routing in the app */ } 
    <BrowserRouter> 
    <App />
    </BrowserRouter>
  </StrictMode>,
    
)
