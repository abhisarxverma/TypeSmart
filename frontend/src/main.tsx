import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { persistQueryClient } from '@tanstack/react-query-persist-client';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import AuthProvider from './Contexts/AuthProvider.tsx'
import ThemeProvider from './Contexts/ThemeProvider.tsx'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
})

persistQueryClient({
  queryClient,
  persister: createAsyncStoragePersister({ storage: window.localStorage }),
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter >
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="default-dark" storageKey="vite-ui-theme">
          <AuthProvider>
            <App />
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>,
)
