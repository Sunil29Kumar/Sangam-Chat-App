import { Shield, Zap, Users } from "lucide-react";

const Features = () => {
  const feats = [
    { title: "End-to-End Encryption", desc: "Your messages are for your eyes only. No one in between can read them.", icon: Shield },
    { title: "Instant Delivery", desc: "Powered by Socket.io for millisecond latency. Talk in real-time, literally.", icon: Zap },
    { title: "Group Synergy", desc: "Create rooms, manage members, and keep your community together effortlessly.", icon: Users },
  ];

  return (
    <section id="features" className="py-24 bg-white px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Why Choose Sangam?</h2>
          <div className="w-20 h-1.5 bg-indigo-600 mx-auto mt-4 rounded-full"></div>
        </div>
        <div className="grid md:grid-cols-3 gap-10">
          {feats.map((f, i) => (
            <div key={i} className="p-10 rounded-[2rem] bg-slate-50 border border-slate-100 hover:border-indigo-200 hover:bg-white hover:shadow-2xl hover:shadow-indigo-100 transition-all group">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <f.icon size={28} />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-4">{f.title}</h3>
              <p className="text-slate-500 font-medium leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;