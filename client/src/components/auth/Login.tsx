import React, { useState } from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  MessageSquare,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { showToast } from "../../utils/toast";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Error State for specific fields
  const [inputErrors, setInputErrors] = useState({
    email: "",
    password: "",
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Reset errors on new attempt
    setInputErrors({ email: "", password: "" });

    try {
      const response = await login(email, password);
      
      if (response?.success) {
        navigate("/dashboard");
        showToast.success(response?.message || "Welcome back!");
      } else {
        // Handling Object Errors (like Signup)
        if (response?.error && typeof response.error === 'object') {
          setInputErrors({
            email: response.error.email || "",
            password: response.error.password || "",
          });
        } else {
          showToast.error(response?.error || "Invalid credentials.");
        }
      }
    } catch (err) {
      showToast.error("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Background Orbs for Premium Look */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-100/50 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-100/50 rounded-full blur-[120px]" />

      <div className="w-full max-w-4xl bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] flex flex-col md:flex-row overflow-hidden border border-white relative z-10">
        
        {/* Left Branding - Matching Signup Style */}
        <div className="hidden md:flex w-2/5 bg-gradient-to-br from-indigo-600 to-indigo-800 p-12 flex-col justify-between text-white relative overflow-hidden">
          <div className="relative z-10">
            <div className="w-14 h-14 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center mb-8 border border-white/20">
              <MessageSquare size={28} />
            </div>
            <h2 className="text-4xl font-black leading-tight">
              Welcome <br /> Back to <br />
              <span className="text-indigo-200">Sangam.</span>
            </h2>
            <p className="mt-4 text-indigo-100/80 text-sm font-medium">
              Continue your seamless conversation experience.
            </p>
          </div>
          
          <div className="relative z-10 text-xs font-bold tracking-widest opacity-50">
            © 2026 SANGAM CHAT INC.
          </div>

          {/* Decorative Circle */}
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
        </div>

        {/* Right Login Section */}
        <div className="flex-1 p-10 sm:p-14 md:p-12 flex flex-col justify-center">
          <div className="mb-10">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              Login to Account
            </h1>
            <p className="text-slate-500 text-sm mt-2 font-medium">
              Please enter your credentials to access chats.
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleLogin}>
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Email Address
              </label>
              <div className="relative group">
                <Mail
                  className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${
                    inputErrors.email ? "text-red-400" : "text-slate-400 group-focus-within:text-indigo-500"
                  }`}
                  size={18}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (inputErrors.email) setInputErrors({ ...inputErrors, email: "" });
                  }}
                  placeholder="name@example.com"
                  className={`w-full pl-12 pr-4 py-3.5 bg-slate-50 border rounded-2xl outline-none transition-all font-medium ${
                    inputErrors.email ? "border-red-400 focus:border-red-500" : "border-slate-100 focus:border-indigo-500 focus:bg-white"
                  }`}
                  required
                />
              </div>
              {inputErrors.email && (
                <p className="text-red-500 text-[10px] font-bold ml-1 animate-in fade-in slide-in-from-top-1">
                  {inputErrors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center px-1">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                  Password
                </label>
                <button type="button" className="text-[10px] font-bold text-indigo-600 hover:underline">
                  Forgot Password?
                </button>
              </div>
              <div className="relative group">
                <Lock
                  className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${
                    inputErrors.password ? "text-red-400" : "text-slate-400 group-focus-within:text-indigo-500"
                  }`}
                  size={18}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (inputErrors.password) setInputErrors({ ...inputErrors, password: "" });
                  }}
                  placeholder="••••••••"
                  className={`w-full pl-12 pr-12 py-3.5 bg-slate-50 border rounded-2xl outline-none transition-all font-medium ${
                    inputErrors.password ? "border-red-400 focus:border-red-500" : "border-slate-100 focus:border-indigo-500 focus:bg-white"
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {inputErrors.password && (
                <p className="text-red-500 text-[10px] font-bold ml-1 animate-in fade-in slide-in-from-top-1">
                  {inputErrors.password}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              disabled={isLoading}
              className={`w-full py-4 rounded-2xl text-white font-extrabold shadow-lg transition-all flex items-center justify-center gap-3 mt-4 active:scale-95 ${
                isLoading
                  ? "bg-slate-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-200/50"
              }`}
              type="submit"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          <p className="mt-10 text-center text-sm font-semibold text-slate-500">
            New to Sangam?{" "}
            <button
              onClick={() => navigate("/sign-up")}
              className="ml-1.5 text-indigo-600 font-black hover:underline"
            >
              Create Account
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;