
import React, { useEffect, useState } from 'react';
import { 
  ArrowRight, Sparkles, TrendingUp, Globe, Users, Target, Zap, 
  ChevronDown, Flame, Award, ShieldCheck, Crown, Heart 
} from 'lucide-react';

interface LandingPageProps {
  onAction: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onAction }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const stats = [
    { label: 'Global Partners', value: '1200+', icon: Users },
    { label: 'Active Countries', value: '18', icon: Globe },
    { label: 'Success Rate', value: '96%', icon: TrendingUp },
  ];

  const services = [
    {
      title: "Marketing Growth",
      desc: "Scaling brands with aggressive, data-driven field marketing strategies.",
      icon: Zap,
    },
    {
      title: "Talent Recruitment",
      desc: "Building elite teams of performers who redefine industry standards.",
      icon: Target,
    },
    {
      title: "Global Expansion",
      desc: "Breaking borders and establishing market dominance worldwide.",
      icon: Globe,
    }
  ];

  return (
    <div className="relative bg-white dark:bg-phoenix-black min-h-screen transition-colors duration-500">
      {/* Background FX */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-phoenix-red/5 dark:bg-phoenix-red/10 rounded-full blur-[120px] animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-phoenix-orange/5 rounded-full blur-[150px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden z-10">
        <div className="absolute inset-0 z-0">
           <div className="absolute h-full w-full opacity-20 dark:opacity-30">
             {[...Array(20)].map((_, i) => (
               <div 
                key={i} 
                className="absolute bg-phoenix-red rounded-full blur-xl animate-float"
                style={{
                  width: Math.random() * 4 + 'px',
                  height: Math.random() * 4 + 'px',
                  left: Math.random() * 100 + '%',
                  top: Math.random() * 100 + '%',
                  animationDelay: Math.random() * 10 + 's',
                  animationDuration: Math.random() * 5 + 5 + 's'
                }}
               />
             ))}
           </div>
        </div>

        <div className="max-w-5xl space-y-8 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-full backdrop-blur-md mb-4 shadow-sm dark:shadow-2xl">
            <Flame className="w-4 h-4 text-phoenix-red animate-fire" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">The Era of the Phoenix</span>
          </div>

          <h1 className="text-6xl md:text-9xl font-black text-slate-900 dark:text-white tracking-tighter uppercase leading-[0.85] italic">
            Rise Beyond <br /> 
            <span className="phoenix-gradient-text">Limits.</span>
          </h1>

          <p className="text-lg md:text-2xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-medium tracking-tight">
            Proago World is Luxembourg’s premier marketing powerhouse. <br className="hidden md:block" />
            We don’t just participate in the market—we own it.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <button 
              onClick={onAction}
              className="px-10 py-5 bg-phoenix-red text-white text-[12px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl dark:shadow-[0_0_30px_rgba(255,42,42,0.4)] hover:bg-phoenix-orange transition-all hover:scale-105 active:scale-95 group flex items-center justify-center"
            >
              Join Proago World <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </button>
            <button className="px-10 py-5 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-[12px] font-black uppercase tracking-[0.2em] rounded-2xl backdrop-blur-md hover:bg-slate-200 dark:hover:bg-white/10 transition-all">
              Discover More
            </button>
          </div>
        </div>

        <div className="absolute bottom-10 animate-bounce">
          <ChevronDown className="w-8 h-8 text-slate-400 dark:text-slate-600" />
        </div>
      </section>

      {/* Power Section */}
      <section className="py-24 px-4 relative z-10 bg-slate-50 dark:bg-phoenix-charcoal/50 border-y border-slate-100 dark:border-white/5 transition-colors duration-500">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-10">
              <h2 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white italic tracking-tighter uppercase leading-none">
                We Build Leaders. <br />
                <span className="text-phoenix-red">We Scale Impact.</span>
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                At Proago World, we believe in radical growth. We bridge the gap between human ambition and market opportunity. Our network of elite ambassadors transforms static brands into global icons.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                {stats.map((stat, i) => (
                  <div key={i} className="space-y-2">
                    <stat.icon className="w-6 h-6 text-phoenix-orange mb-2" />
                    <p className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter italic">{stat.value}</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-tr from-phoenix-red/20 to-phoenix-orange/20 rounded-[40px] blur-[60px] opacity-40 dark:opacity-50 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative aspect-square rounded-[40px] bg-white dark:bg-phoenix-black/80 border-2 border-slate-100 dark:border-white/10 flex items-center justify-center overflow-hidden shadow-xl dark:shadow-none">
                 <div className="absolute h-[150%] w-[150%] bg-[radial-gradient(circle,#ff2a2a0a_0%,transparent_70%)] animate-pulse-slow"></div>
                 <Flame className="w-48 h-48 text-phoenix-red animate-fire drop-shadow-xl dark:drop-shadow-[0_0_30px_rgba(255,42,42,0.8)]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-32 px-4 relative z-10 transition-colors duration-500">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-20">
            <h3 className="text-xs font-black text-phoenix-orange uppercase tracking-[0.4em]">Our Core Mastery</h3>
            <h2 className="text-5xl font-black text-slate-900 dark:text-white italic tracking-tighter uppercase leading-none">Global Dominance</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, i) => (
              <div key={i} className="glass-card p-12 rounded-[40px] phoenix-card-hover transition-all duration-500 group shadow-sm dark:shadow-none">
                <div className="h-16 w-16 bg-slate-100 dark:bg-white/5 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-phoenix-red transition-colors">
                  <service.icon className="w-8 h-8 text-slate-900 dark:text-white group-hover:text-white" />
                </div>
                <h4 className="text-2xl font-black text-slate-900 dark:text-white italic uppercase tracking-tighter mb-4">{service.title}</h4>
                <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Join Section */}
      <section className="py-32 px-4 relative z-10 bg-gradient-to-b from-white to-slate-50 dark:from-phoenix-black dark:to-phoenix-charcoal transition-colors duration-500">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-20">
            <div className="flex-1 space-y-8">
              <div className="inline-block px-3 py-1 bg-phoenix-red/10 dark:bg-phoenix-red/20 text-phoenix-red text-[10px] font-black uppercase tracking-widest rounded-full border border-phoenix-red/20 dark:border-phoenix-red/30">Careers</div>
              <h2 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white italic tracking-tighter uppercase leading-none">
                The Future Belongs <br />
                <span className="text-phoenix-red">To The Bold.</span>
              </h2>
              <ul className="space-y-6">
                {[
                  { icon: Crown, text: "Elite Performance Network" },
                  { icon: Zap, text: "Uncapped Growth Potential" },
                  { icon: Globe, text: "Global Opportunity Bridge" },
                  { icon: Award, text: "Prestige Recognition" }
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-6 group">
                    <div className="p-3 bg-slate-100 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10 group-hover:border-phoenix-red transition-all">
                      <item.icon className="w-5 h-5 text-phoenix-orange" />
                    </div>
                    <span className="text-xl font-bold text-slate-900 dark:text-white tracking-tight uppercase group-hover:text-phoenix-red transition-colors">{item.text}</span>
                  </li>
                ))}
              </ul>
              <button 
                onClick={onAction}
                className="mt-10 px-12 py-6 bg-slate-900 dark:bg-white text-white dark:text-phoenix-black text-[12px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-phoenix-red dark:hover:bg-phoenix-red hover:text-white transition-all transform hover:scale-110 active:scale-95 shadow-xl"
              >
                Start Your Rise 🔥
              </button>
            </div>
            
            <div className="flex-1 w-full max-w-lg aspect-video glass-card rounded-[40px] p-8 border border-slate-100 dark:border-white/5 flex flex-col justify-center shadow-lg dark:shadow-none">
               <div className="space-y-8">
                  <div className="flex justify-between items-center pb-8 border-b border-slate-100 dark:border-white/5">
                     <span className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase">Career Arc</span>
                     <TrendingUp className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div className="relative h-2 w-full bg-slate-100 dark:bg-white/5 rounded-full">
                     <div className="absolute top-0 left-0 h-full w-2/3 bg-phoenix-red rounded-full shadow-[0_0_15px_rgba(255,42,42,0.3)] dark:shadow-[0_0_15px_rgba(255,42,42,0.6)]"></div>
                     <div className="absolute top-[-4px] left-[66%] h-4 w-4 bg-white border-2 border-phoenix-red rounded-full shadow-lg"></div>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                     {['Trainee', 'Ambassador', 'Leader', 'Global Manager'].map((lvl, i) => (
                       <div key={i} className="text-center">
                          <p className={`text-[8px] font-black uppercase tracking-tighter ${i === 2 ? 'text-phoenix-red' : 'text-slate-400 dark:text-slate-500'}`}>{lvl}</p>
                       </div>
                     ))}
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-40 px-4 relative z-10 text-center overflow-hidden transition-colors duration-500">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle,#ff2a2a0a_0%,transparent_60%)] animate-pulse-slow"></div>
        </div>
        <div className="relative z-10 space-y-12 animate-fade-in">
           <Flame className="w-16 h-16 text-phoenix-red mx-auto animate-fire" />
           <h2 className="text-6xl md:text-9xl font-black text-slate-900 dark:text-white italic tracking-tighter uppercase leading-[0.8] max-w-4xl mx-auto">
             Stop Dreaming. <br />
             <span className="phoenix-gradient-text">Start Scaling.</span>
           </h2>
           <button 
             onClick={onAction}
             className="px-14 py-7 bg-phoenix-red text-white text-[14px] font-black uppercase tracking-[0.3em] rounded-3xl shadow-xl dark:shadow-[0_0_50px_rgba(255,42,42,0.5)] hover:bg-slate-900 dark:hover:bg-white dark:hover:text-phoenix-black transition-all hover:scale-105"
           >
             🔥 Join Proago World
           </button>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
