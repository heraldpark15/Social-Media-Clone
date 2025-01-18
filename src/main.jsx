import './index.css'
import App from './App.jsx'
import { ChakraProvider, defaultSystem } from "@chakra-ui/react"
import { ThemeProvider } from "next-themes"
import React from "react"
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
    <ChakraProvider value={defaultSystem}>
      <ThemeProvider attribute="class">
      <App />            
      </ThemeProvider>
    </ChakraProvider>
    </BrowserRouter>
  </React.StrictMode>,
)