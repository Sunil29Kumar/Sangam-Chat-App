import React, {useEffect, useState} from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  MessageSquare,
  ArrowRight,
  Loader2,
} from "lucide-react";
import {useAuth} from "../../hooks/useAuth";
import {useNavigate} from "react-router-dom";
import {showToast} from "../../utils/toast";

const Login = () => {
  const {login, checkAuthentication} = useAuth();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await login(email, password);
      if (response?.success) {
        navigate("/dashboard");
        showToast.success(response?.message || "Logged in successfully!");
      } else {
        showToast.error(
          response?.error || "Login failed. Please check your credentials.",
        );
      }
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-4xl bg-white rounded-[2rem] shadow-2xl flex flex-col md:flex-row overflow-hidden border border-white">
        {/* Left Branding */}
        <div className="hidden md:flex w-2/5 bg-indigo-600 p-10 flex-col justify-between text-white relative overflow-hidden">
          <div className="relative z-10">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-lg rounded-xl flex items-center justify-center mb-6">
              <MessageSquare size={24} />
            </div>
            <h2 className="text-3xl font-bold">
              Welcome Back to <br /> Sangam Chat
            </h2>
          </div>
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-white opacity-5 rounded-full"></div>
        </div>

        {/* Right Login Section */}
        <div className="flex-1 p-8 sm:p-12 md:p-10">
          <div className="mb-10">
            <h1 className="text-2xl font-black text-slate-900">
              Login to Account
            </h1>
            <p className="text-slate-500 text-sm mt-1 font-medium">
              Please enter credentials to access chats.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleLogin}>
            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider ml-1">
                Email Address
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border rounded-2xl outline-none focus:border-indigo-500"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider ml-1">
                Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-12 py-3.5 bg-slate-50 border rounded-2xl outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              disabled={isLoading}
              className={`w-full py-4 rounded-2xl text-white font-bold shadow-lg transition-all flex items-center justify-center gap-2 mt-4 active:scale-95 ${
                isLoading
                  ? "bg-slate-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
              type="submit"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <p className="mt-10 text-center text-sm font-medium text-slate-500">
            New to Sangam?{" "}
            <a
              href="/sign-up"
              className="ml-1.5 text-indigo-600 font-black hover:underline"
            >
              Create Account
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
