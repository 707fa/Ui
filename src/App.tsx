import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AppLayout } from './components/layout/AppLayout';
import Dashboard from './pages/dashboard/Dashboard';
import POS from './pages/pos/POS';
import Payment from './pages/pos/Payment';
import Sales from './pages/sales/Sales';
import Inventory from './pages/inventory/Inventory';
import Accounting from './pages/accounting/Accounting';
import Employees from './pages/hr/Employees';
import Manufacturing from './pages/manufacturing/Manufacturing';
import Projects from './pages/projects/Projects';
import WebPortal from './pages/web/WebPortal';
import Settings from './pages/settings/Settings';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Profile from './pages/profile/Profile';

import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<AppLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="sales" element={<Sales />} />
                <Route path="accounting" element={<Accounting />} />
                <Route path="hr" element={<Employees />} />
                <Route path="inventory" element={<Inventory />} />
                <Route path="manufacturing" element={<Manufacturing />} />
                <Route path="projects" element={<Projects />} />
                <Route path="pos" element={<POS />} />
                <Route path="pos/payment" element={<Payment />} />
                <Route path="web" element={<WebPortal />} />
                <Route path="settings" element={<Settings />} />
                <Route path="profile" element={<Profile />} />
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
