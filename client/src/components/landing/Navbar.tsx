import  { useState, useEffect } from 'react';
import { MessageSquare, Menu, X, ArrowRight } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Link as ScrollLink } from 'react-scroll';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isHomePage = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      if (isHomePage) setIsScrolled(window.scrollY > 20);
      else setIsScrolled(true);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomePage]);

  // Agar user login page par hai aur Features click kare toh pehle home laye phir scroll kare
  const handleNavClick = (target: string) => {
    if (!isHomePage) {
      navigate("/", { state: { scrollTo: target } });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className={`fixed top-0 w-full z-[100] transition-all duration-300 ${
      isScrolled || isMobileMenuOpen ? "bg-white/90 backdrop-blur-lg border-b border-slate-200 py-3 shadow-sm" : "bg-transparent py-5"
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-200 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
            <MessageSquare size={24} fill="white" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-[1000] text-slate-900 tracking-tighter leading-none">SANGAM</span>
            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em] leading-none mt-1">Chat</span>
          </div>
        </Link>
        
        {/* Desktop Navigation with ScrollLink */}
        <div className={`hidden md:flex items-center gap-2 p-1.5 rounded-full border border-slate-200/50 backdrop-blur-sm ${isScrolled ? "bg-slate-100/50" : "bg-white/20"}`}>
          <NavElement to="about" label="About" isHomePage={isHomePage} onClick={() => handleNavClick("about")} />
          <NavElement to="features" label="Features" isHomePage={isHomePage} onClick={() => handleNavClick("features")} />
          <NavElement to="faq" label="FAQ" isHomePage={isHomePage} onClick={() => handleNavClick("faq")} />
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <Link to="/login" className="hidden sm:block text-sm font-bold text-slate-600 hover:text-indigo-600 px-5 py-2.5 transition-all">Log In</Link>
          <Link to="/sign-up" className="flex items-center gap-2 text-sm font-bold bg-slate-900 text-white px-6 py-3 rounded-2xl hover:bg-indigo-600 shadow-xl transition-all active:scale-95">
            Join Now <ArrowRight size={16} />
          </Link>
          <button className="md:hidden p-2 text-slate-600" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-white border-b border-slate-200 p-6 flex flex-col gap-4 md:hidden">
          <MobileNavElement to="features" label="Features" isHomePage={isHomePage} onClick={() => handleNavClick("features")} />
          <MobileNavElement to="faq" label="FAQ" isHomePage={isHomePage} onClick={() => handleNavClick("faq")} />
          <hr className="border-slate-100" />
          <Link to="/login" className="py-2 font-bold text-slate-600">Login</Link>
        </div>
      )}
    </nav>
  );
};

// Reusable Component to handle Scroll vs Link
const NavElement = ({ to, label, isHomePage, onClick }: any) => {
  if (isHomePage) {
    return (
      <ScrollLink to={to} smooth={true} duration={500} offset={-80} className="px-5 py-2 text-[13px] font-bold text-slate-500 hover:text-indigo-600 hover:bg-white rounded-full transition-all cursor-pointer">
        {label}
      </ScrollLink>
    );
  }
  return (
    <button onClick={onClick} className="px-5 py-2 text-[13px] font-bold text-slate-500 hover:text-indigo-600 hover:bg-white rounded-full transition-all">
      {label}
    </button>
  );
};

const MobileNavElement = ({ to, label, isHomePage, onClick }: any) => {
  if (isHomePage) {
    return (
      <ScrollLink to={to} smooth={true} duration={500} offset={-80} onClick={onClick} className="text-lg font-bold text-slate-900 cursor-pointer">
        {label}
      </ScrollLink>
    );
  }
  return <button onClick={onClick} className="text-left text-lg font-bold text-slate-900">{label}</button>;
};

export default Navbar;