import { ArrowRight, Zap, Shield, MessageSquare, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

// 1. Image ko import karein (Path check kar lein apne folder structure ke hisab se)
import sangamWindow from '../../assets/sangam chat window.png';

const About = () => {
  return (
    <section id="about" className="relative pt-32 pb-20 px-6 bg-[#fafafa] overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[600px] h-[600px] bg-indigo-50 rounded-full blur-[120px] -z-10 opacity-60" />
      
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        
        {/* --- Left Content --- */}
        <div className="text-center lg:text-left">
          <div className="inline-flex items-center gap-2 bg-white border border-slate-200 text-indigo-600 px-4 py-2 rounded-full text-xs font-black uppercase tracking-[0.2em] mb-8 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
            </span>
            Live on Vercel & Render
          </div>

          <h1 className="text-5xl md:text-7xl font-[1000] text-slate-900 leading-[1] tracking-tight">
            Seamless Chat <br /> 
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-500">
              For Everyone.
            </span>
          </h1>

          <p className="mt-8 text-lg md:text-xl text-slate-500 font-medium leading-relaxed max-w-lg mx-auto lg:mx-0">
            Experience the "Sangam" of speed and security. A lightning-fast MERN stack chat app designed for instant connections.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Link to="/sign-up" className="bg-indigo-600 text-white px-8 py-5 rounded-2xl font-bold text-lg shadow-2xl shadow-indigo-200 flex items-center justify-center gap-3 hover:bg-indigo-700 transition-all active:scale-95 group">
              Start Chatting Free
              <ArrowRight className="group-hover:translate-x-2 transition-transform" />
            </Link>
            <div className="flex items-center gap-3 px-4 py-2">
              <div className="flex -space-x-3">
                {[1,2,3,4].map(i => (
                  <img key={i} src={`https://i.pravatar.cc/150?u=${i+10}`} className="w-10 h-10 rounded-full border-4 border-white shadow-sm" alt="user" />
                ))}
              </div>
              <p className="text-sm font-bold text-slate-500 leading-none">
                <span className="text-slate-900">2k+</span> <br />Active Users
              </p>
            </div>
          </div>

          <div className="mt-12 flex items-center justify-center lg:justify-start gap-6 grayscale opacity-60">
             <div className="flex items-center gap-2 font-bold text-slate-800"><Shield size={18}/> End-to-End</div>
             <div className="flex items-center gap-2 font-bold text-slate-800"><Zap size={18}/> Zero Lag</div>
          </div>
        </div>
        
        {/* --- Right Content (Visual Section) --- */}
        <div className="relative mt-12 lg:mt-0">
          
          {/* Main App Image Wrapper */}
          <div className="relative z-10 p-2 bg-white rounded-[2.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] border border-slate-100 transform rotate-2 hover:rotate-0 transition-all duration-700 overflow-hidden group">
              <img 
                src={sangamWindow} 
                className="rounded-[2rem] w-full h-auto object-cover max-h-[500px]" 
                alt="Sangam Chat Preview" 
              />
              {/* Overlay Gradient for depth */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/10 to-transparent pointer-events-none"></div>
          </div>

          {/* Floating Message Card */}
          <div className="absolute -left-4 md:-left-12 top-1/4 z-20 bg-white p-4 rounded-2xl shadow-xl border border-slate-50 animate-bounce-slow flex items-center gap-4 max-w-[240px]">
            <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center shrink-0">
              <CheckCircle2 size={20} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase">System</p>
              <p className="text-sm font-bold text-slate-800">Connection Secure</p>
            </div>
          </div>

          {/* Floating Notification */}
          <div className="absolute -right-4 bottom-10 z-20 bg-indigo-600 p-4 rounded-2xl shadow-xl text-white flex items-center gap-3 animate-float">
            <MessageSquare size={20} />
            <span className="font-bold text-sm">New Notification</span>
          </div>

          {/* Background Decorations */}
          <div className="absolute -top-10 -right-10 w-72 h-72 bg-indigo-400 rounded-full blur-[120px] opacity-20 -z-10"></div>
          <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-pink-400 rounded-full blur-[120px] opacity-10 -z-10"></div>
        </div>
      </div>
    </section>
  );
};

export default About;