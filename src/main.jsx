import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from "react-router/dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './index.css'
import { router } from './Routes/Router.jsx';
import AuthProvider from './Contents/AuthContext/AuthProvider.jsx';
import { StripeProvider } from './Contents/StripeContext/StripeProvider.jsx';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <StripeProvider>
          <RouterProvider router={router} />
          <ToastContainer />
        </StripeProvider>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
)
