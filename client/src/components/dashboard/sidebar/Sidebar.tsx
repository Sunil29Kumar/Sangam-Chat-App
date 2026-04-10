import { MessageSquare, Settings, User, LogOut } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";

const Sidebar = () => {
  const location = useLocation();
  const { logout } = useAuth();

  const menuItems = [
    { icon: <MessageSquare size={24} />, label: "Chats", path: "/dashboard" },
    { icon: <User size={24} />, label: "Profile", path: "/profile" },
    { icon: <Settings size={24} />, path: "/settings" },
  ];

  return (
    <div className="h-screen w-20 md:w-24 bg-slate-100 flex flex-col items-center py-8 fixed left-0 top-0 z-50 shadow-2xl">
      {/* Brand Logo (Login page wala Indigo) */}
      <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center mb-12 shadow-lg shadow-indigo-500/40">
        <span className="text-white font-black text-xl">S</span>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 w-full px-3 space-y-6">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center p-3 rounded-2xl transition-all duration-300 group
                ${isActive 
                  ? "bg-indigo-600 text-white shadow-xl shadow-indigo-500/20 scale-110" 
                  : "text-slate-500 hover:bg-slate-800 hover:text-slate-300"
                }`}
            >
              {item.icon}
              {item.label && (
                <span className={`text-[10px] mt-1 font-bold uppercase tracking-widest ${isActive ? "text-white" : "text-slate-600"}`}>
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout button at bottom */}
      <button 
        onClick={logout}
        className="w-12 h-12 flex items-center justify-center text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-2xl transition-all duration-300"
      >
        <LogOut size={24} />
      </button>
    </div>
  );
};

export default Sidebar;