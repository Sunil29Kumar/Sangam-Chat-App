import { Shield, Zap, Users, MessageSquare, Lock, Globe } from "lucide-react";

const Features = () => {
  const feats = [
    { 
      title: "End-to-End Encryption", 
      desc: "Your messages are for your eyes only. No one in between can read them.", 
      icon: Shield,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    { 
      title: "Instant Delivery", 
      desc: "Powered by Socket.io for millisecond latency. Talk in real-time, literally.", 
      icon: Zap,
      color: "text-amber-500",
      bgColor: "bg-amber-50"
    },
    { 
      title: "Group Synergy", 
      desc: "Create rooms, manage members, and keep your community together effortlessly.", 
      icon: Users,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50"
    },
  ];

  return (
    <section id="features" className="py-32 bg-white px-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>

      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-24">
          <span className="text-indigo-600 font-bold tracking-[0.3em] uppercase text-xs mb-4">Core Capabilities</span>
          <h2 className="text-4xl md:text-5xl font-[1000] text-slate-900 tracking-tight">
            Why Choose <span className="text-indigo-600">Sangam?</span>
          </h2>
          <p className="mt-6 text-slate-500 font-medium max-w-xl">
            We've combined modern engineering with intuitive design to create the ultimate communication bridge.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {feats.map((f, i) => (
            <div 
              key={i} 
              className="group relative p-10 rounded-[2.5rem] bg-white border border-slate-100 hover:border-transparent transition-all duration-500 hover:-translate-y-3"
            >
              {/* Hover Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-white opacity-0 group-hover:opacity-100 rounded-[2.5rem] transition-opacity duration-500 -z-10 shadow-2xl shadow-indigo-100/50"></div>

              {/* Icon Container */}
              <div className={`w-16 h-16 ${f.bgColor} ${f.color} rounded-2xl flex items-center justify-center mb-8 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-sm`}>
                <f.icon size={32} strokeWidth={2.5} />
              </div>

              <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">
                {f.title}
              </h3>
              
              <p className="text-slate-500 font-medium leading-relaxed text-sm">
                {f.desc}
              </p>

              {/* Bottom Decorative Line */}
              <div className="mt-8 w-12 h-1 bg-slate-100 rounded-full group-hover:w-20 group-hover:bg-indigo-600 transition-all duration-500"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;