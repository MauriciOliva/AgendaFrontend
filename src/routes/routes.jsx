import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { AgendaPage } from "../pages/AgendaPAge";
import { AuthProvider, useAuth } from "../hooks/AuthHook";
import { LoadingSpinner } from "../components/Atomos/LoadingSnipper";
import LoginPage from "../pages/LoginPage";

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, isLoading } = useAuth();
    if (isLoading) {
        return <LoadingSpinner />;
    }
    return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }) => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return <LoadingSpinner />;
    }

    return !isAuthenticated ? children : <Navigate to="/" replace />;
}

const router = createBrowserRouter([
    {
        path: "/login",
        element: (
            <PublicRoute>
                <LoginPage />
            </PublicRoute>
        )
    },
    {
        path: "/",
        element: (
            <ProtectedRoute>
                <AgendaPage />
            </ProtectedRoute>
        )
    },
    {
        path: "*",
        element: <Navigate to="/" replace />
    }
]);

const MyRoutes = () => (
    <AuthProvider>
        <RouterProvider router={router} />
    </AuthProvider>
);

export default MyRoutes;