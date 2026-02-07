import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import Dashboard from './pages/dashboard/Dashboard';
import POS from './pages/pos/POS';
import Sales from './pages/sales/Sales';
import Inventory from './pages/inventory/Inventory';
import Accounting from './pages/accounting/Accounting';
import Employees from './pages/hr/Employees';
import Manufacturing from './pages/manufacturing/Manufacturing';
import Projects from './pages/projects/Projects';
import WebPortal from './pages/web/WebPortal';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="sales" element={<Sales />} />
          <Route path="accounting" element={<Accounting />} />
          <Route path="hr" element={<Employees />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="manufacturing" element={<Manufacturing />} />
          <Route path="projects" element={<Projects />} />
          <Route path="pos" element={<POS />} />
          <Route path="web" element={<WebPortal />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
