import { guestRoutes } from "./GuestRoutes";
import { publicRoutes } from "./PublicRoutes";
import AuthError from "../components/auth/AuthError";
import { protectedRoutes } from "./ProtectedRoutes";



export const allRoutes = [
    ...publicRoutes,
    ...guestRoutes,
    ...protectedRoutes,
    {
        path: "*",
        element: <AuthError />
    }
]