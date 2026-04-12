import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const FinalCTA = () => {
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-indigo-500/10 rounded-full blur-[120px] -z-10"></div>

      <div className="max-w-5xl mx-auto bg-slate-900 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
        {/* Decorative Grid Pattern */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

        <div className="relative z-10">
          <h2 className="text-4xl md:text-5xl font-[1000] text-white tracking-tight mb-6">
            Ready to start <span className="text-indigo-400">Sangam?</span>
          </h2>
          <p className="text-slate-400 text-lg font-medium max-w-xl mx-auto mb-10">
            Join thousands of users who are already experiencing the future of real-time messaging. Secure, fast, and free forever.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/sign-up" 
              className="w-full sm:w-auto px-10 py-5 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-500/20 active:scale-95 flex items-center justify-center gap-2 group"
            >
              Get Started Now
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            
            
          </div>

          <p className="mt-8 text-slate-500 text-sm font-medium">
            No credit card required • Instant setup • Open source
          </p>
        </div>
      </div>
      
      {/* Tech Stack Mini Section */}
     
    </section>
  );
};

export default FinalCTA;