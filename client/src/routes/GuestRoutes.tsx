import PrivacyPolicy from "../pages/Legal/PrivacyPolicy";
import TermsOfService from "../pages/Legal/TermsOfService";

export const guestRoutes = [
    {
        path: "/terms-of-service",
        element: <TermsOfService />
    },
    {
        path: "/privacy-policy",
        element: <PrivacyPolicy />
    }
]