import React, {useState} from "react";
import {
  User,
  Mail,
  Lock,
  MessageSquare,
  ArrowRight,
  ShieldCheck,
  Eye,
  EyeOff,
  ChevronLeft,
  Loader2,
} from "lucide-react";
import {useAuth} from "../../hooks/useAuth";
import {useNavigate} from "react-router-dom";
import {showToast} from "../../utils/toast";

const SignUp = () => {
  const {signup, sendOTP, verifyOTP} = useAuth();
  const navigate = useNavigate();

  // Step States
  const [isOTPPhase, setIsOTPPhase] = useState(false);
  const [isOTPVerified, setIsOTPVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Form States
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordMatching, setIsPasswordMatching] = useState(false);
  const [otp, setOTP] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [inputErrors, setInputErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    setFormData((prev) => {
      const newFormData = {...prev, [name]: value};
      setIsPasswordMatching(
        newFormData.password.length > 0 &&
          newFormData.password === newFormData.confirmPassword,
      );
      return newFormData;
    });
  };

  // Phase 1: Get OTP
  const handleGetOTP = async () => {
    setIsLoading(true);
    try {
      const response = await sendOTP( formData.name, formData.email, formData.password);
      if (response?.success) {
        setIsOTPPhase(true);
        showToast.success(response?.message || "OTP sent to your email!");
      } else {
        if (Object(response?.error)) {
          console.log(response.error);
          
          const errors = response?.error;
          console.log(errors);
          

          setInputErrors((prev) => ({
            ...prev,
            name: errors?.name || "",
            email: errors?.email || "",
            password: errors?.password || "",
            confirmPassword: errors?.confirmPassword || "",
          }));
        } else {
          showToast.error(response?.error || "Failed to send OTP. Try again.");
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Phase 2: Verify OTP
  const handleVerifyOTP = async () => {
    setIsLoading(true);
    try {
      const response = await verifyOTP(formData.email, otp);
      if (response?.success) {
        setIsOTPVerified(true);
        showToast.success(response?.message || "OTP verified successfully!");
      } else {
        showToast.error(response?.error || "OTP verification failed.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Phase 3: Create Account
  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await signup(
        formData.name,
        formData.email,
        formData.password,
      );
      if (response?.success) {
        navigate("/login");
        showToast.success(response?.message || "Account created successfully!");
      } else {
        showToast.error(response?.error || "Account creation failed.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-4xl bg-white rounded-[2rem] shadow-2xl flex flex-col md:flex-row overflow-hidden border border-white">
        {/* Left Branding */}
        <div className="hidden md:flex w-2/5 bg-indigo-600 p-12 flex-col justify-between text-white relative overflow-hidden">
          <div className="relative z-10">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-lg rounded-xl flex items-center justify-center mb-6">
              <MessageSquare size={24} />
            </div>
            <h2 className="text-3xl font-bold">
              Join the <br /> Sangam Community
            </h2>
          </div>
          <div className="relative z-10 text-sm text-indigo-200">
            © 2024 Sangam Chat Inc.
          </div>
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-indigo-500 rounded-full opacity-50"></div>
        </div>

        {/* Right Form Section */}
        <div className="flex-1 p-8 sm:p-12">
          <div className="mb-8">
            <h1 className="text-2xl font-black text-slate-900">
              {isOTPVerified
                ? "Almost there!"
                : isOTPPhase
                  ? "Verify your email"
                  : "Create your account"}
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              {isOTPVerified
                ? "Email verified. Click below to finish."
                : isOTPPhase
                  ? "Enter code sent to inbox."
                  : "Fill in details to start."}
            </p>
          </div>

          <div className="space-y-4">
            {!isOTPPhase && !isOTPVerified && (
              <>
                <div className="space-y-1">
                  <label className="text-[12px] font-bold text-slate-500 uppercase ml-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      size={18}
                    />
                    <input
                      type="text"
                      name="name"
                      min={3}
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border rounded-xl outline-none focus:ring-4 focus:ring-indigo-500/5"
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  </div>
                  {inputErrors.name && (
                    <p className="text-red-500 text-xs mt-1">{inputErrors.name}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-[12px] font-bold text-slate-500 uppercase ml-1">
                    Email
                  </label>
                  <div className="relative">
                    <Mail
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      size={18}
                    />
                    <input
                      type="email"
                      name="email"
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border rounded-xl outline-none"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  {inputErrors.email && (
                    <p className="text-red-500 text-xs mt-1">{inputErrors.email}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="relative">
                    <Lock
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      size={18}
                    />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Password"
                      className="w-full pl-11 pr-11 py-3 bg-slate-50 border rounded-xl"
                      value={formData.password}
                      onChange={handleInputChange}
                    />
                    <button
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {inputErrors.password && (
                    <p className="text-red-500 text-xs mt-1">{inputErrors.password}</p>
                  )}
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm"
                    className="w-full px-4 py-3 bg-slate-50 border rounded-xl"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                  />
                  {inputErrors.confirmPassword && (
                    <p className="text-red-500 text-xs mt-1">{inputErrors.confirmPassword}</p>
                  )}
                </div>
              </>
            )}

            {isOTPPhase && !isOTPVerified && (
              <div className="pt-2 space-y-4">
                <div className="relative">
                  <ShieldCheck
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-600"
                    size={20}
                  />
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOTP(e.target.value)}
                    placeholder="Enter 6-digit OTP"
                    className="w-full pl-12 pr-4 py-4 bg-indigo-50/50 border-2 border-indigo-100 rounded-xl outline-none text-xl font-bold tracking-widest text-indigo-900"
                  />
                </div>
                <button
                  onClick={() => setIsOTPPhase(false)}
                  className="text-xs font-bold text-indigo-600 flex items-center gap-1"
                >
                  <ChevronLeft size={14} /> Back to Edit
                </button>
              </div>
            )}

            {/* Action Buttons */}
            {!isOTPVerified ? (
              <button
                disabled={!isPasswordMatching || isLoading}
                onClick={!isOTPPhase ? handleGetOTP : handleVerifyOTP}
                className={`w-full py-4 rounded-xl text-white font-bold shadow-lg transition-all flex items-center justify-center gap-2 mt-6 active:scale-95 ${
                  !isPasswordMatching || isLoading
                    ? "bg-slate-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700"
                }`}
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    <span>{isOTPPhase ? "Verify OTP" : "Get OTP"}</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            ) : (
              <button
                disabled={isLoading}
                onClick={handleCreateAccount}
                className={`w-full py-4 rounded-xl text-white font-bold shadow-lg transition-all flex items-center justify-center gap-2 mt-6 active:scale-95 ${
                  isLoading ? "bg-slate-400" : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  "Create Account"
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
