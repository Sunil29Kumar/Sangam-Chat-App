import { MessageSquare, Settings, User, LogOut } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";

const Sidebar = () => {
  const location = useLocation();
  const { logout } = useAuth();

  const menuItems = [
    { icon: <MessageSquare size={24} />, label: "Chats", path: "/dashboard" },
    { icon: <User size={24} />, label: "Profile", path: "/profile" },
    { icon: <Settings size={24} />, label: "Settings", path: "/settings" },
  ];

  return (
    <div
      className="fixed left-0 bottom-0 z-[100] w-full h-16 bg-slate-100 flex flex-row items-center px-4 shadow-[0_-10px_20px_rgba(0,0,0,0.05)]
      md:top-0 md:h-screen md:w-24 md:flex-col md:py-8 md:px-0 md:shadow-2xl md:border-r md:border-slate-200"
    >
      {/* Brand Logo - Desktop par dikhega, Mobile par hide */}
      <div className="hidden md:flex w-12 h-12 bg-indigo-600 rounded-2xl items-center justify-center mb-12 shadow-lg shadow-indigo-500/40 shrink-0">
        <span className="text-white font-black text-xl">S</span>
      </div>

      {/* Nav Items */}
      <nav className="flex flex-row md:flex-col flex-1 w-full justify-around md:justify-start md:space-y-6 px-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center p-2 md:p-3 rounded-2xl transition-all duration-300 group
                ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-xl shadow-indigo-500/20 scale-105 md:scale-110"
                    : "text-slate-500 hover:bg-white md:hover:bg-slate-800 hover:text-indigo-600 md:hover:text-slate-300"
                }`}
            >
              {item.icon}
              {item.label && (
                <span
                  className={`text-[9px] md:text-[10px] mt-1 font-bold uppercase tracking-widest ${
                    isActive ? "text-white" : "text-slate-600"
                  }`}
                >
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout button - Mobile par side mein, Desktop par bottom mein */}
      <button
        onClick={logout}
        className="w-12 h-12 flex items-center justify-center text-slate-500 hover:text-red-500 hover:bg-red-50 md:hover:bg-red-400/10 rounded-2xl transition-all duration-300 shrink-0"
      >
        <LogOut size={22} />
      </button>
    </div>
  );
};

export default Sidebar;