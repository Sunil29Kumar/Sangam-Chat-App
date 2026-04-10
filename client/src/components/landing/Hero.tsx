import React from 'react';
import { ArrowRight, Zap, Shield, Users } from 'lucide-react';

const Hero = () => {
  return (
    <section className="pt-40 pb-20 px-6 bg-slate-50">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        <div>
          <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
            </span>
            Real-time Experience
          </div>
          <h1 className="text-6xl md:text-7xl font-black text-slate-900 leading-[1.1] tracking-tighter">
            Connect <br /> 
            <span className="text-indigo-600">Without Limits.</span>
          </h1>
          <p className="mt-8 text-xl text-slate-500 font-medium leading-relaxed max-w-lg">
            Experience the next generation of messaging. Secure, lightning fast, and built for humans who value real connections.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <button className="bg-indigo-600 text-white px-8 py-5 rounded-2xl font-bold text-lg shadow-2xl shadow-indigo-200 flex items-center justify-center gap-3 hover:bg-indigo-700 transition-all active:scale-95 group">
              Start Chatting Now
              <ArrowRight className="group-hover:translate-x-2 transition-transform" />
            </button>
            <button className="bg-white border border-slate-200 text-slate-900 px-8 py-5 rounded-2xl font-bold text-lg hover:bg-slate-50 transition-all">
              View Demo
            </button>
          </div>
        </div>
        
        <div className="relative">
          <div className="bg-white p-4 rounded-[2.5rem] shadow-2xl shadow-slate-200 border border-white relative z-10 rotate-3">
             <img src="https://images.unsplash.com/photo-1611746872915-64382b5c76da?auto=format&fit=crop&q=80&w=800" className="rounded-[2rem]" alt="App Preview" />
          </div>
          <div className="absolute -top-10 -right-10 w-64 h-64 bg-indigo-600 rounded-full blur-[120px] opacity-20"></div>
          <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-pink-500 rounded-full blur-[120px] opacity-10"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;