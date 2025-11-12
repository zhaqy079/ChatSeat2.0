import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from './AuthContext';

export default function ProtectedRoute({ requiredRole }) {
    const { user, loading } = useAuth();

    if (loading) return <div>Loading...</div>;
    if (!user) return <Navigate to="/login" replace />;

    const userRole = user?.role?.toLowerCase();

    // allows the admin to access all routes
    if (userRole === "admin") {
        return <Outlet />;
    }

    if (requiredRole && userRole !== requiredRole) {
        return <Navigate to="/unauthorized" replace />;
    }


    return <Outlet />;
}
