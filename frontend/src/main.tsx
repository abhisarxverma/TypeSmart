import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { persistQueryClient } from '@tanstack/react-query-persist-client';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import AuthProvider from './Contexts/AuthProvider.tsx'
import LibraryProvider from './Contexts/LibraryProvider.tsx'
import TypingProvider from './Contexts/TypingProvider.tsx'

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
        <AuthProvider>
          <LibraryProvider>
            <TypingProvider>
              <App />
            </TypingProvider>
          </LibraryProvider>
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>,
)
