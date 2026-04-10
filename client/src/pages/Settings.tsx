import { 
  User, 
  Bell, 
  Palette, 
  Globe, 
  HelpCircle, 
  ChevronRight,
  Moon,
  Trash2
} from "lucide-react";

const Settings = () => {
  const categories = [
    { id: 'account', icon: <User size={20} />, label: "Account Settings", desc: "Profile details, email, and personal info" },
    { id: 'notifications', icon: <Bell size={20} />, label: "Notifications", desc: "Manage alerts and message sounds" },
    { id: 'privacy', icon: <Bell size={20} />, label: "Privacy & Security", desc: "Password, 2FA, and blocked users" },
    { id: 'appearance', icon: <Palette size={20} />, label: "Appearance", desc: "Themes, font size, and chat wallpaper" },
    { id: 'language', icon: <Globe size={20} />, label: "Language", desc: "Change app language and region" },
    { id: 'help', icon: <HelpCircle size={20} />, label: "Help & Support", desc: "FAQs, contact us, and privacy policy" },
  ];

  return (
    <div className="h-full w-full bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/60 overflow-hidden border border-white flex">
      
      {/* 1. Settings Sidebar (Left - 350px) */}
      <div className="w-80 md:w-96 border-r border-slate-50 flex flex-col bg-white">
        <div className="p-8 pb-4">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Settings</h2>
          <p className="text-slate-400 text-sm font-medium mt-1">Manage your account preferences</p>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar">
          {categories.map((item) => (
            <div 
              key={item.id}
              className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all group
                ${item.id === 'account' ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-slate-50 text-slate-500 hover:text-slate-700'}`}
            >
              <div className={`p-2.5 rounded-xl transition-all ${item.id === 'account' ? 'bg-white shadow-sm' : 'bg-slate-100 group-hover:bg-white'}`}>
                {item.icon}
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-sm">{item.label}</h4>
                <p className="text-[10px] font-medium opacity-70 truncate">{item.desc}</p>
              </div>
              <ChevronRight size={16} className={item.id === 'account' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} />
            </div>
          ))}
        </nav>
      </div>

      {/* 2. Settings Content (Right Side) */}
      <div className="flex-1 bg-[#fafafa] overflow-y-auto p-10 custom-scrollbar">
        <div className="max-w-2xl mx-auto space-y-10">
          
          {/* Section: Account Summary */}
          <section className="space-y-6">
            <h3 className="text-lg font-black text-slate-800 uppercase tracking-widest text-[11px]">Account Preferences</h3>
            
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
              <div className="flex items-center justify-between p-2">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
                    <Moon size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-slate-700 text-sm">Dark Mode</p>
                    <p className="text-xs text-slate-400 font-medium">Reduce eye strain in low light</p>
                  </div>
                </div>
                {/* Custom Toggle Switch */}
                <div className="w-12 h-6 bg-slate-200 rounded-full relative cursor-pointer">
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all"></div>
                </div>
              </div>

              <div className="h-[1px] bg-slate-50 w-full"></div>

              <div className="flex items-center justify-between p-2">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                    <Globe size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-slate-700 text-sm">Public Profile</p>
                    <p className="text-xs text-slate-400 font-medium">Allow others to find you via search</p>
                  </div>
                </div>
                <div className="w-12 h-6 bg-indigo-600 rounded-full relative cursor-pointer">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm"></div>
                </div>
              </div>
            </div>
          </section>

          {/* Section: Danger Zone */}
          <section className="space-y-6">
            <h3 className="text-lg font-black text-red-600 uppercase tracking-widest text-[11px]">Danger Zone</h3>
            
            <div className="bg-red-50/50 p-6 rounded-3xl border border-red-100 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-red-700 text-sm">Delete Account</p>
                  <p className="text-xs text-red-500/70 font-medium">Permanently remove all your data and chats</p>
                </div>
                <button className="px-5 py-2.5 bg-red-600 text-white text-xs font-bold rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-red-200 flex items-center gap-2">
                  <Trash2 size={14} /> Deactivate
                </button>
              </div>
            </div>
          </section>

          {/* Footer Info */}
          <div className="text-center pt-10">
            <p className="text-slate-300 text-[10px] font-bold uppercase tracking-[0.2em]">Sangam Chat v1.0.4 • 2026</p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Settings;