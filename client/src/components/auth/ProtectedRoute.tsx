import {useEffect} from "react";
import AuthLoader from "./AuthLoader";
import {Navigate, Outlet} from "react-router-dom";
import axiosInstance from "../../api/axios";
import {useAuth} from "../../hooks/useAuth";
import {showToast} from "../../utils/toast";
import Layout from "../../layout/Layout";

function ProtectedRoute() {
  const {isAuth, setIsAuth, checkAuthentication} = useAuth();

  useEffect(() => {
    // Interceptor yahan define kiya taaki sirf isi route ke children par chale
    const interceptor = axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        const status = error?.response?.status;
        const message = error?.response?.data?.message;

        // 1. Check karein agar 401 (Unauthorized) hai
        if (status === 401) {
          // Sirf tab toast dikhao jab specific messages hon
          if (
            message === "Authentication required. Please log in." ||
            message === "Session expired. Please log in again."
          ) {
            showToast.error(message, {toasterId: "error"});
          }
          // User ko logout state mein set karo
          setIsAuth(false);
        }

        return Promise.reject(error);
      },
    );

    // Cleanup: Jab user is component se bahar jaye, interceptor hata do
    return () => {
      axiosInstance.interceptors.response.eject(interceptor);
    };
  }, [setIsAuth]); // setIsAuth dependency mein hona chahiye

  useEffect(() => {
    checkAuthentication();
  }, []);

  if (isAuth === null) return <AuthLoader />;

  // Agar auth false hai toh login par bhejo, warna Layout dikhao
  return isAuth === false ? (
    <Navigate to="/login" replace />
  ) : (
    <Layout/>
  );
}

export default ProtectedRoute;
