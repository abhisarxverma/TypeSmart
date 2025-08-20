import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from "react-router-dom";
import AuthProvider from './Contexts/AuthProvider.tsx'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ThemeProvider } from './Contexts/Theme/ThemeProvider.tsx';
import TypingTextProvider from './Contexts/TypingTextProvider.tsx';
import CurrentFolderProvider from './Contexts/CurrentFolder.tsx';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, 
    },
  },
})   

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
          <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <AuthProvider>
              <TypingTextProvider>
                <CurrentFolderProvider>
                    <App />
                </CurrentFolderProvider>
              </TypingTextProvider>
            </AuthProvider>
          </ThemeProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>,
)
