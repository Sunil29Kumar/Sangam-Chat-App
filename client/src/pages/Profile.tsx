import { Camera, Mail, User, Shield, Bell, Check } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

const Profile = () => {
  const { user } = useAuth(); // Backend se user data fetch karne ke liye
  const [isEditing, setIsEditing] = useState(false);

  // Temporary State (Inhe baad mein API se connect karenge)
  const [formData, setFormData] = useState({
    name: user?.name || "Alex Morgan",
    email: user?.email || "alex.morgan@example.com",
    bio: "Passionate developer & UI/UX enthusiast. Chatting on Sangam!",
  });

  return (
    <div className="h-full w-full bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/60 overflow-y-auto border border-white custom-scrollbar">
      
      {/* 1. Header / Cover Photo Area */}
      <div className="h-48 w-full bg-gradient-to-r from-indigo-600 to-blue-500 relative">
        <div className="absolute -bottom-16 left-10 flex items-end gap-6">
          <div className="relative group">
            <div className="w-32 h-32 rounded-[2.5rem] border-8 border-white overflow-hidden bg-slate-100 shadow-lg">
              <img 
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.name}`} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            </div>
            <button className="absolute bottom-2 right-2 p-2 bg-white text-indigo-600 rounded-xl shadow-md hover:scale-110 transition-all">
              <Camera size={18} />
            </button>
          </div>
          
          <div className="mb-4">
            <h1 className="text-2xl font-black text-slate-900">{formData.name}</h1>
            <p className="text-slate-500 font-medium text-sm">@{formData.name.toLowerCase().replace(" ", "_")}</p>
          </div>
        </div>
      </div>

      {/* 2. Profile Content Area */}
      <div className="mt-20 p-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Left Column: Personal Info */}
        <div className="lg:col-span-2 space-y-8">
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <User size={20} className="text-indigo-600" /> Personal Information
              </h3>
              <button 
                onClick={() => setIsEditing(!isEditing)}
                className="text-sm font-bold text-indigo-600 hover:text-indigo-700 underline underline-offset-4"
              >
                {isEditing ? "Cancel" : "Edit Profile"}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                <input 
                  type="text" 
                  disabled={!isEditing}
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-indigo-500/5 outline-none text-sm font-semibold text-slate-700 disabled:opacity-70 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input 
                    type="email" 
                    disabled={true} // Email usually fixed hota hai
                    value={formData.email}
                    className="w-full pl-12 pr-4 p-4 bg-slate-50 border-none rounded-2xl outline-none text-sm font-semibold text-slate-400 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Bio</label>
            <textarea 
              disabled={!isEditing}
              rows={4}
              value={formData.bio}
              onChange={(e) => setFormData({...formData, bio: e.target.value})}
              className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-indigo-500/5 outline-none text-sm font-semibold text-slate-700 disabled:opacity-70 transition-all resize-none"
            />
          </div>

          {isEditing && (
            <button className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold text-sm shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center gap-2">
              <Check size={18} /> Save Changes
            </button>
          )}
        </div>

        {/* Right Column: Account Stats & Settings */}
        <div className="space-y-6">
          <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
            <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Shield size={18} className="text-indigo-600" /> Account Security
            </h4>
            <div className="space-y-3">
              <button className="w-full p-3 bg-white text-slate-600 text-xs font-bold rounded-xl border border-slate-200 hover:bg-white/50 transition-all text-left">
                Change Password
              </button>
              <button className="w-full p-3 bg-white text-slate-600 text-xs font-bold rounded-xl border border-slate-200 hover:bg-white/50 transition-all text-left">
                Two-Factor Auth
              </button>
            </div>
          </div>

          <div className="bg-indigo-50 p-6 rounded-[2rem] border border-indigo-100">
            <h4 className="font-bold text-indigo-900 mb-4 flex items-center gap-2">
              <Bell size={18} className="text-indigo-600" /> Notifications
            </h4>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-700">Desktop Notifications</span>
              <div className="w-10 h-5 bg-indigo-600 rounded-full relative">
                <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full shadow-sm"></div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;