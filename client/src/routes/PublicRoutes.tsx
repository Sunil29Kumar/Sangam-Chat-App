import Login from "../components/auth/Login";
import PublicOnlyRoute from "../components/auth/PublicOnlyRoute";
import SignUp from "../components/auth/SignUp";
import LandingPage from "../pages/LandingPage";

export const publicRoutes = [
    {
        path: "/",
        element: <LandingPage />
    },

    {
        element: <PublicOnlyRoute />,
        children: [
            { path: "/login", element: <Login /> },
            { path: "/sign-up", element: <SignUp /> }
        ]
    }
];