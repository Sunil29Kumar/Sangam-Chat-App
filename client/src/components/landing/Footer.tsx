import { MessageSquare } from "lucide-react";
const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white py-20 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
            <MessageSquare size={24} className="text-indigo-400" />
          </div>
          <span className="text-2xl font-black tracking-tighter uppercase italic">Sangam</span>
        </div>
        
        <div className="flex gap-10 text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
          <a href="#" className="hover:text-white transition-colors">Privacy</a>
          <a href="#" className="hover:text-white transition-colors">Terms</a>
          <a href="#" className="hover:text-white transition-colors">Twitter</a>
          <a href="#" className="hover:text-white transition-colors">GitHub</a>
        </div>

        <p className="text-slate-500 text-sm font-medium">
          Designed with ❤️ for Sangam Community.
        </p>
      </div>
    </footer>
  );
};

export default Footer;