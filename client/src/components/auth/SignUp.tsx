import  { useState } from "react";
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
  CheckCircle2
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { showToast } from "../../utils/toast";

const SignUp = () => {
  const { signup, sendOTP, verifyOTP } = useAuth();
  const navigate = useNavigate();

  const [isOTPPhase, setIsOTPPhase] = useState(false);
  const [isOTPVerified, setIsOTPVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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
    const { name, value } = e.target;
    setFormData((prev) => {
      const newFormData = { ...prev, [name]: value }; 
      setIsPasswordMatching(
        newFormData.password.length > 0 &&
          newFormData.password === newFormData.confirmPassword
      );
      return newFormData;
    });
    // Clear error when user types
    if (inputErrors[name as keyof typeof inputErrors]) setInputErrors({ ...inputErrors, [name]: "" });
  };

  const handleGetOTP = async () => {
    setIsLoading(true);
    try {
      const response = await sendOTP(formData.name, formData.email, formData.password);
      if (response?.success) {
        setIsOTPPhase(true);
        showToast.success("OTP sent to your email!");
      } else {
        if (response?.error && typeof response.error === 'object') {
          setInputErrors(response.error);
        } else {
          showToast.error(response?.error || "Failed to send OTP.");
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    setIsLoading(true);
    try {
      const response = await verifyOTP(formData.email, otp);
      if (response?.success) {
        setIsOTPVerified(true);
        showToast.success("Email verified!");
      } else {
        showToast.error(response?.error || "Invalid OTP.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAccount = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await signup(formData.name, formData.email, formData.password);
      if (response?.success) {
        showToast.success("Welcome to Sangam!");
        navigate("/login");
      } else {
        showToast.error(response?.error || "Creation failed.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Background Orbs */}
      <div className="absolute top-[-5%] right-[-5%] w-[35%] h-[35%] bg-indigo-100/60 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-5%] left-[-5%] w-[35%] h-[35%] bg-blue-100/60 rounded-full blur-[100px]" />

      <div className="w-full max-w-5xl bg-white rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.04)] flex flex-col md:flex-row overflow-hidden border border-white relative z-10">
        
        {/* Left Branding Panel */}
        <div className="hidden md:flex w-5/12 bg-gradient-to-br from-indigo-600 to-indigo-800 p-12 flex-col justify-between text-white relative">
          <div className="relative z-10">
            <div className="w-14 h-14 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center mb-10 border border-white/20 shadow-lg">
              <MessageSquare size={28} />
            </div>
            <h2 className="text-4xl font-extrabold leading-tight">
              Start your <br /> journey with <br /> 
              <span className="text-indigo-200">Sangam.</span>
            </h2>
            <div className="mt-8 space-y-4">
               {[
                 "Real-time messaging",
                 "End-to-end encryption",
                 "Community driven"
               ].map((text, i) => (
                 <div key={i} className="flex items-center gap-3 text-indigo-100/90 text-sm font-medium">
                   <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center">
                     <div className="w-1.5 h-1.5 bg-white rounded-full" />
                   </div>
                   {text}
                 </div>
               ))}
            </div>
          </div>
          <div className="relative z-10 opacity-60 text-xs font-medium tracking-widest">
            © 2026 SANGAM CHAT INC.
          </div>
          
          <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-indigo-400 opacity-20 rounded-full blur-3xl"></div>
        </div>

        {/* Right Form Section */}
        <div className="flex-1 p-8 sm:p-14 lg:p-20">
          {/* Step Progress Bar */}
          <div className="flex gap-2 mb-10">
            <div className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${!isOTPPhase ? 'bg-indigo-600 shadow-[0_0_10px_rgba(79,70,229,0.4)]' : 'bg-slate-200'}`} />
            <div className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${isOTPPhase && !isOTPVerified ? 'bg-indigo-600 shadow-[0_0_10px_rgba(79,70,229,0.4)]' : isOTPVerified ? 'bg-indigo-600' : 'bg-slate-200'}`} />
            <div className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${isOTPVerified ? 'bg-indigo-600 shadow-[0_0_10px_rgba(79,70,229,0.4)]' : 'bg-slate-200'}`} />
          </div>

          <div className="mb-10">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              {isOTPVerified ? "Final Step!" : isOTPPhase ? "Verify Identity" : "Create Account"}
            </h1>
            <p className="text-slate-500 mt-2 font-medium">
              {isOTPVerified ? "Your email is verified. Let's get started." : isOTPPhase ? `We've sent a code to your email.` : "Join our secure messaging platform today."}
            </p>
          </div>

          <div className="space-y-5">
            {!isOTPPhase && !isOTPVerified && (
              <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                    <input
                      type="text"
                      name="name"
                      placeholder="John Doe"
                      className={`w-full pl-12 pr-4 py-3.5 bg-slate-50 border ${inputErrors.name ? 'border-red-400' : 'border-slate-200'} rounded-2xl outline-none focus:border-indigo-500 focus:bg-white transition-all font-medium`}
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  </div>
                  {inputErrors.name && <p className="text-red-500 text-[10px] font-bold ml-1">{inputErrors.name}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                    <input
                      type="email"
                      name="email"
                      placeholder="john@example.com"
                      className={`w-full pl-12 pr-4 py-3.5 bg-slate-50 border ${inputErrors.email ? 'border-red-400' : 'border-slate-200'} rounded-2xl outline-none focus:border-indigo-500 focus:bg-white transition-all font-medium`}
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  {inputErrors.email && <p className="text-red-500 text-[10px] font-bold ml-1">{inputErrors.email}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Password"
                        className={`w-full pl-12 pr-11 py-3.5 bg-slate-50 border ${inputErrors.password ? 'border-red-400' : 'border-slate-200'} rounded-2xl outline-none focus:border-indigo-500 focus:bg-white transition-all font-medium`}
                        value={formData.password}
                        onChange={handleInputChange}
                      />
                      <button onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <div className="relative group">
                      <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm"
                        className={`w-full px-5 py-3.5 bg-slate-50 border ${!isPasswordMatching && formData.confirmPassword ? 'border-red-400' : 'border-slate-200'} rounded-2xl outline-none focus:border-indigo-500 focus:bg-white transition-all font-medium`}
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                      />
                      {isPasswordMatching && <CheckCircle2 size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500" />}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {isOTPPhase && !isOTPVerified && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="bg-indigo-50 p-6 rounded-[2rem] border border-indigo-100 flex flex-col items-center">
                  <ShieldCheck className="text-indigo-600 mb-4" size={48} />
                  <input
                    type="text"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOTP(e.target.value)}
                    placeholder="000000"
                    className="w-full max-w-[200px] text-center bg-transparent outline-none text-4xl font-black tracking-[0.5em] text-indigo-900 placeholder:text-indigo-200"
                  />
                </div>
                <button onClick={() => setIsOTPPhase(false)} className="text-sm font-bold text-indigo-600 flex items-center gap-2 hover:translate-x-[-4px] transition-transform">
                  <ChevronLeft size={16} /> Edit details
                </button>
              </div>
            )}

            {isOTPVerified && (
               <div className="flex flex-col items-center justify-center p-10 bg-green-50 rounded-[2rem] border border-green-100 animate-in zoom-in duration-500">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle2 size={40} className="text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-green-900">Verification Complete</h3>
                  <p className="text-green-700 text-sm mt-1">You are ready to join the community</p>
               </div>
            )}

            {/* Main Action Button */}
            <button
              disabled={(!isOTPPhase && !isOTPVerified && !isPasswordMatching) || isLoading}
              onClick={isOTPVerified ? (handleCreateAccount as any) : isOTPPhase ? (handleVerifyOTP as any) : (handleGetOTP as any)}
              className={`w-full py-4.5 rounded-2xl text-white font-extrabold shadow-xl transition-all flex items-center justify-center gap-3 active:scale-95 ${
                isLoading
                  ? "bg-slate-400 cursor-not-allowed"
                  : isOTPVerified ? "bg-green-600 hover:bg-green-700" : "bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-200/50"
              }`}
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={22} />
              ) : (
                <>
                  <span>{isOTPVerified ? "Complete Registration" : isOTPPhase ? "Verify Now" : "Continue"}</span>
                  {!isOTPVerified && <ArrowRight size={20} />}
                </>
              )}
            </button>
          </div>

          <p className="mt-10 text-center text-sm font-semibold text-slate-500">
            Already have an account?{" "}
            <button onClick={() => navigate("/login")} className="ml-1 text-indigo-600 font-black hover:underline">
              Log In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;