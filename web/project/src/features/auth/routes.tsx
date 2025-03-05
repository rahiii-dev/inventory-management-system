import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import { useAuthContext } from "../../core/context/AuthContext";

const AuthRoutes = () => {
    const { user } = useAuthContext();

    if (user) {
        return <Navigate to={'/'} replace />;
    }

    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="*" element={<Navigate to={'/auth/login'} replace />} />
        </Routes>
    );
}

export default AuthRoutes;
