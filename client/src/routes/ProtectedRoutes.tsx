// routes/ProtectedRoutes.tsx
import ProtectedRoute from "../components/auth/ProtectedRoute";
import Dashboard from "../pages/Dashboard";
import Profile from "../pages/Profile";
import Settings from "../pages/Settings";

export const protectedRoutes = [
    {
        path: "/",
        element: <ProtectedRoute />, 
        children: [
            {
                path: "dashboard",
                element: <Dashboard />, 
                
            }
            ,{
                path: "settings",
                element: <Settings />,
            }
            ,{
                path: "profile",
                element: <Profile />,
            }
        ]
    }
];