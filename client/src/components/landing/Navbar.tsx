import React from 'react';
import { MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer group">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200 group-hover:rotate-6 transition-transform">
            <MessageSquare size={22} />
          </div>
          <span className="text-xl font-black text-slate-900 tracking-tighter uppercase">Sangam</span>
        </div>
        
        <div className="hidden md:flex items-center gap-10 text-sm font-bold text-slate-600 uppercase tracking-widest">
          <a href="#features" className="hover:text-indigo-600 transition-colors">Features</a>
          <a href="#about" className="hover:text-indigo-600 transition-colors">About</a>
          <a href="#security" className="hover:text-indigo-600 transition-colors">Security</a>
        </div>

        <div className="flex items-center gap-4">
          <Link to="/login" className="text-sm font-bold text-slate-900 px-6 py-2 hover:bg-slate-50 rounded-full transition-all">Login</Link>
          <Link to="/sign-up" className="text-sm font-bold bg-slate-900 text-white px-6 py-3 rounded-full hover:bg-indigo-600 shadow-xl shadow-slate-200 transition-all active:scale-95">Get Started</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;