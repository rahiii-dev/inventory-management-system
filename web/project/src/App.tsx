import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './core/context/AuthContext';
import AuthRoutes from './features/auth/routes';
import InventoryRoutes from './features/inventory/routes';
import { Toaster } from 'sonner';
import { ThemeProvider } from '@emotion/react';
import theme from './core/theme';

function App() {
  return (
    <ThemeProvider theme={theme}>

      <AuthProvider>
          <Routes>
            <Route path='/*' element={<InventoryRoutes />} />
            <Route path='/auth/*' element={<AuthRoutes />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        <Toaster richColors={true} visibleToasts={2} />
      </AuthProvider>
    
    </ThemeProvider>
  );
}

export default App;