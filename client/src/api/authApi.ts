import axios from "./axios";


export const sendOTPAuth = async (name: string, email: string , password: string) => {
  try {
    const response = await axios.post("/auth/send-otp", {name, email, password});
    return response.data;
  } catch (error: any) {
    return (
      error?.response?.data || {
        success: false,
        message: "An error occurred while sending OTP.",
      }
    );
  }
};

export const VerifyOTP = async (email: string, otp: string) => {
  try {
    const response = await axios.post("/auth/verify-otp", {email, otp});
    return response.data;
  } catch (error: any) {
    return (
      error?.response?.data || {
        success: false,
        message: "An error occurred while verifying OTP.",
      }
    );
  }
};

export const signupAuth = async (
  name: string,
  email: string,
  password: string,
) => {
  try {
    const response = await axios.post("/auth/sign-up", {name, email, password});
    return response.data;
  } catch (error: any) {
    return (
      error?.response?.data || {
        success: false,
        message: "An error occurred during signup.",
      }
    );
  }
};



export const loginAuth = async (email: string, password: string) => {
  try {
    const response = await axios.post("/auth/login", {email, password});
    return response.data;
  } catch (error: any) {
    return (
      error?.response.data || {
        success: false,
        message: "An error occurred during login.",
      }
    );
  }
};

export const logoutAuth = async () => {
  try {
    const response = await axios.post("/auth/logout");
    return response.data;
  } catch (error: any) {
    return (
      error?.response.data || {
        success: false,
        message: "An error occurred during logout.",
      }
    );
  }
};

export const isAuthenticated = async () => {
  try {
    const response = await axios.get("/user");
    console.log(response);
    
    return response?.data;
  } catch (error: any) {
    return (
      error?.response.data || {
        success: false,
        message: "An error occurred while checking authentication.",
      }
    );
  }
};
