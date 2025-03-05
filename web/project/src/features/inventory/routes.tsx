import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuthContext } from '../../core/context/AuthContext';
import DashboardPage from './pages/DashboardPage';
import DashboardLayout from './layouts/DashboardLayout';
import InventoryPage from './pages/InventoryPage';
import CustomersPage from './pages/CustomersPage';
import SalesPage from './pages/SalesPage';
import ReportsPage from './pages/ReportsPage';

const InventoryRoutes = () => {
    const { user } = useAuthContext();

    if (!user) {
        return <Navigate to={'/auth/login'} replace />;
    }

    return (
        <Routes>
            <Route element={<DashboardLayout />}>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/inventory" element={<InventoryPage />} />
                <Route path="/customers" element={<CustomersPage />} />
                <Route path="/sales" element={<SalesPage />} />
                <Route path="/reports" element={<ReportsPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

export default InventoryRoutes;
