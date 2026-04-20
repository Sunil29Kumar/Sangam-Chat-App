import {MessageSquare, Heart} from "lucide-react";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {Link as ScrollLink} from "react-scroll";

// React Icons for Social Media
import {FaGithub, FaLinkedinIn, FaInstagram} from "react-icons/fa";
import {FaXTwitter} from "react-icons/fa6"; // Latest X (Twitter) icon

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === "/";

  const handleNavClick = (target: string) => {
    if (!isHomePage) {
      navigate("/", {state: {scrollTo: target}});
    }
  };

  return (
    <footer className="bg-slate-950 text-white pt-24 pb-12 px-6 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-6 group">
              <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:rotate-6 transition-transform">
                <MessageSquare size={24} fill="white" />
              </div>
              <span className="text-2xl font-[1000] tracking-tighter uppercase italic">
                Sangam
              </span>
            </Link>
            <p className="text-slate-400 font-medium max-w-sm leading-relaxed">
              Real-time connections built with the MERN stack. Fast, secure, and
              open-source.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-indigo-400 mb-6">
              Product
            </h4>
            <ul className="flex flex-col gap-4 text-sm font-bold text-slate-400">
              <li>
                <button
                  onClick={() =>
                    isHomePage ? null : handleNavClick("features")
                  }
                  className="hover:text-white transition-colors"
                >
                  {isHomePage ? (
                    <ScrollLink to="features" smooth={true} offset={-80}>
                      Features
                    </ScrollLink>
                  ) : (
                    "Features"
                  )}
                </button>
              </li>
              <li>
                <button
                  onClick={() => (isHomePage ? null : handleNavClick("faq"))}
                  className="hover:text-white transition-colors"
                >
                  {isHomePage ? (
                    <ScrollLink to="faq" smooth={true} offset={-80}>
                      FAQ
                    </ScrollLink>
                  ) : (
                    "FAQ"
                  )}
                </button>
              </li>
              <li>
                <button
                  onClick={() => (isHomePage ? null : handleNavClick("about"))}
                  className="hover:text-white transition-colors"
                >
                  {isHomePage ? (
                    <ScrollLink to="about" smooth={true} offset={-80}>
                      About
                    </ScrollLink>
                  ) : (
                    "About"
                  )}
                </button>
              </li>
              <li>
                <Link
                  to="/login"
                  className="hover:text-white transition-colors"
                >
                  Sign In
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Connect - Using React Icons */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-indigo-400 mb-6">
              Connect
            </h4>
            <div className="flex gap-3">
              <SocialIcon
                icon={<FaXTwitter size={18} />}
                href="https://x.com/SunilKu59210295"
              />
              <SocialIcon
                icon={<FaGithub size={18} />}
                href="https://github.com/Sunil29Kumar"
              />
              <SocialIcon
                icon={<FaLinkedinIn size={18} />}
                href="https://www.linkedin.com/in/sunil-kumar-31322125b"
              />
              <SocialIcon
                icon={<FaInstagram size={18} />}
                href="https://instagram.com"
              />
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
          <p className="text-slate-500 text-sm font-medium">
            © {currentYear} Sangam Chat. All rights reserved.
          </p>

          <p className="flex items-center gap-2 text-slate-500 text-sm font-medium">
            Built with{" "}
            <Heart size={14} className="text-rose-500 fill-rose-500" /> by{" "}
            <span className="text-white font-bold">Sunil</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

// Reusable Social Icon Component
const SocialIcon = ({icon, href}: {icon: any; href: string}) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-slate-400 hover:bg-indigo-600 hover:text-white hover:-translate-y-1 transition-all duration-300 border border-white/5 shadow-lg"
  >
    {icon}
  </a>
);

export default Footer;
