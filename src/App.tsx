import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  MapPin, 
  Clock, 
  Users, 
  Euro, 
  ChevronRight, 
  RotateCcw, 
  Bookmark,
  Smile,
  ArrowRight,
  Loader2,
  CalendarDays,
  Utensils,
  Camera,
  Coffee,
  Heart,
  Share2,
  Globe,
  Compass,
  Star,
  Info
} from 'lucide-react';
import { cn } from './lib/utils';
import { generatePlan, PlanResponse } from './services/gemini.service';

// --- Types ---
type AppState = 'landing' | 'form' | 'loading' | 'result';

interface FormData {
  city: string;
  budget: number;
  mood: string;
  time: string;
  groupType: string;
}

// --- Data ---
const EUROPEAN_CAPITALS = [
  { name: 'Madrid', country: 'España', image: 'https://images.unsplash.com/photo-1539330665522-d917d12bc704', slug: 'madrid' },
  { name: 'París', country: 'Francia', image: 'https://images.unsplash.com/photo-1502602898757-d2e0b940804c', slug: 'paris' },
  { name: 'Londres', country: 'Reino Unido', image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad', slug: 'london' },
  { name: 'Roma', country: 'Italia', image: 'https://images.unsplash.com/photo-1552832230-c0197dd3ef1b', slug: 'rome' },
  { name: 'Barcelona', country: 'España', image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded', slug: 'barcelona' },
  { name: 'Berlín', country: 'Alemania', image: 'https://images.unsplash.com/photo-1566404791232-af9fe0ae8f8b', slug: 'berlin' },
  { name: 'Ámsterdam', country: 'Países Bajos', image: 'https://images.unsplash.com/photo-1512470876302-972fad2aa9dd', slug: 'amsterdam' },
  { name: 'Lisboa', country: 'Portugal', image: 'https://images.unsplash.com/photo-1585211740925-17730e1816e8', slug: 'lisbon' }
];

const CATEGORIES = [
  { id: 'food', label: 'Gastronomía', icon: Utensils, color: 'bg-orange-50 text-orange-600' },
  { id: 'culture', label: 'Museos y Arte', icon: Camera, color: 'bg-purple-50 text-purple-600' },
  { id: 'nightlife', label: 'Vida Nocturna', icon: Star, color: 'bg-indigo-50 text-indigo-600' },
  { id: 'hidden', label: 'Joyas Ocultas', icon: Compass, color: 'bg-teal-50 text-teal-600' },
];

// --- Components ---

const Header = () => (
  <header className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-xl border-b border-gray-100 px-6 py-4 flex justify-between items-center">
    <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.location.reload()}>
      <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center transform hover:rotate-6 transition-transform">
        <Sparkles className="text-white w-6 h-6" />
      </div>
      <span className="text-xl font-display font-bold lg:tracking-tight text-slate-900 italic">Planify</span>
    </div>
    <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-500 uppercase tracking-widest">
      <a href="#" className="hover:text-blue-600 transition-colors">Destinos</a>
      <a href="#" className="hover:text-blue-600 transition-colors">Descubrir</a>
      <div className="h-4 w-px bg-slate-200"></div>
      <div className="flex items-center gap-2 cursor-pointer hover:text-blue-600 transition-colors">
        <Globe className="w-4 h-4" />
        <span>ES</span>
      </div>
      <button className="bg-slate-900 text-white px-6 py-2.5 rounded-full hover:bg-slate-800 transition-all font-bold shadow-lg shadow-slate-200">
        Empieza ahora
      </button>
    </nav>
  </header>
);

const Hero = ({ onStart, onSelectCity }: { onStart: (city?: string) => void, onSelectCity: (city: string) => void }) => (
  <section className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
    <div className="flex flex-col items-center text-center mb-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-xs font-black uppercase tracking-widest mb-8 border border-blue-100"
      >
        <Sparkles className="w-4 h-4" />
        <span>Toda Europa a tu alcance</span>
      </motion.div>
      
      <motion.h1 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="text-5xl md:text-8xl font-display font-bold tracking-tight text-slate-900 mb-8 max-w-5xl leading-[0.95]"
      >
        Descubre el mejor plan, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">estés donde estés</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-lg md:text-2xl text-slate-500 mb-12 max-w-3xl leading-relaxed"
      >
        Planify utiliza IA para diseñar rutas personalizadas en las capitales más vibrantes de Europa. No sugerimos, creamos experiencias completas.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
      >
        <button 
          onClick={() => onStart()}
          className="px-10 py-5 bg-blue-600 text-white font-bold rounded-2xl text-xl hover:bg-blue-700 transition-all shadow-2xl shadow-blue-200 flex items-center justify-center gap-3 group"
        >
          Planificador IA <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
        </button>
        <button className="px-10 py-5 bg-white text-slate-700 font-bold rounded-2xl text-xl border-2 border-slate-100 hover:border-slate-200 transition-all">
          Explorar destinos
        </button>
      </motion.div>
    </div>

    {/* City Grid Selection */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
      {EUROPEAN_CAPITALS.map((city, idx) => (
        <motion.div
          key={city.name}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 + idx * 0.05 }}
          onClick={() => onSelectCity(city.name)}
          className="group relative h-48 md:h-72 rounded-[2rem] overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500"
        >
          <img 
            src={`${city.image}?q=80&w=600&auto=format&fit=crop`} 
            alt={city.name} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent flex flex-col justify-end p-6">
            <span className="text-white/60 text-xs font-bold uppercase tracking-widest mb-1">{city.country}</span>
            <h3 className="text-2xl font-bold text-white">{city.name}</h3>
          </div>
        </motion.div>
      ))}
    </div>

    {/* Categories */}
    <div className="mt-20 flex flex-wrap justify-center gap-6">
      {CATEGORIES.map((cat) => (
        <div key={cat.id} className={cn("flex items-center gap-3 px-6 py-4 rounded-2xl border border-transparent hover:border-slate-100 transition-all cursor-pointer", cat.color)}>
          <cat.icon className="w-5 h-5" />
          <span className="font-bold">{cat.label}</span>
        </div>
      ))}
    </div>
  </section>
);

const PlanForm = ({ city: initialCity, onSubmit }: { city: string, onSubmit: (data: FormData) => void }) => {
  const [city, setCity] = useState(initialCity);
  const [budget, setBudget] = useState(100);
  const [mood, setMood] = useState('social');
  const [time, setTime] = useState('afternoon');
  const [group, setGroup] = useState('friends');

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto bg-white p-6 md:p-16 rounded-[3rem] shadow-2xl shadow-slate-200 border border-white relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -mr-32 -mt-32 opacity-50"></div>
      
      <div className="relative z-10">
        <h2 className="text-4xl font-display font-bold text-slate-900 mb-10 text-center">Configura tu experiencia en <span className="text-blue-600">{city}</span></h2>
        
        <div className="space-y-12">
          {/* City Selection Scroll */}
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
              <MapPin className="w-4 h-4" /> Cambiar ciudad
            </label>
            <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
              {EUROPEAN_CAPITALS.map((cap) => (
                <button
                  key={cap.name}
                  onClick={() => setCity(cap.name)}
                  className={cn(
                    "flex-shrink-0 px-8 py-3 rounded-full border-2 font-bold transition-all whitespace-nowrap",
                    city === cap.name 
                      ? "border-blue-600 bg-blue-600 text-white shadow-xl shadow-blue-100" 
                      : "border-slate-100 text-slate-600 hover:border-slate-200"
                  )}
                >
                  {cap.name}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Budget */}
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                  <Euro className="w-4 h-4" /> Presupuesto
                </label>
                <span className="text-xl font-black text-blue-600">{budget}€</span>
              </div>
              <input 
                type="range" min="20" max="1000" step="10"
                value={budget} onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                <span>Económico</span>
                <span>Lujo</span>
              </div>
            </div>

            {/* Mood Grid */}
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                <Smile className="w-4 h-4" /> Vibe
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'relax', label: 'Relajado', color: 'hover:bg-emerald-50 hover:text-emerald-700' },
                  { id: 'adventure', label: 'Aventura', color: 'hover:bg-orange-50 hover:text-orange-700' },
                  { id: 'romantic', label: 'Romántico', color: 'hover:bg-pink-50 hover:text-pink-700' },
                  { id: 'social', label: 'Fiesta', color: 'hover:bg-violet-50 hover:text-violet-700' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setMood(item.id)}
                    className={cn(
                      "py-3.5 rounded-2xl font-bold transition-all border-2 text-sm",
                      mood === item.id 
                        ? "border-slate-900 bg-slate-900 text-white shadow-xl" 
                        : cn("border-slate-50 text-slate-500", item.color)
                    )}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Time & Group */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Duración</label>
              <div className="flex gap-2">
                {['hour', 'afternoon', 'day'].map(t => (
                  <button key={t} onClick={() => setTime(t)} className={cn("flex-1 py-3 px-2 rounded-xl text-xs font-bold border-2 transition-all capitalize", time === t ? "border-blue-600 bg-blue-50 text-blue-600" : "border-slate-50 text-slate-500")}>
                    {t === 'hour' ? '1-2 Horas' : t === 'afternoon' ? 'Tarde' : 'Todo el día'}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Grupo</label>
              <div className="flex gap-2">
                {['solo', 'couple', 'friends'].map(g => (
                  <button key={g} onClick={() => setGroup(g)} className={cn("flex-1 py-3 px-2 rounded-xl text-xs font-bold border-2 transition-all capitalize", group === g ? "border-blue-600 bg-blue-50 text-blue-600" : "border-slate-50 text-slate-500")}>
                    {g === 'solo' ? 'Solo/a' : g === 'friends' ? 'Con amigos' : 'En pareja'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button 
            onClick={() => onSubmit({ city, budget, mood, time, groupType: group })}
            className="w-full py-6 bg-blue-600 text-white font-black uppercase tracking-widest rounded-[2rem] text-lg hover:bg-blue-700 transition-all shadow-2xl shadow-blue-200 flex items-center justify-center gap-4 mt-8"
          >
            Buscando experiencias en {city} <Sparkles className="w-6 h-6 animate-pulse" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const LoadingState = ({ city }: { city: string }) => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
    <div className="relative mb-12">
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        className="w-40 h-40 border-[6px] border-blue-50 border-t-blue-600 rounded-full"
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
      </div>
    </div>
    <motion.h2 
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 2, repeat: Infinity }}
      className="text-4xl font-display font-bold text-slate-900 mb-4"
    >
      Explorando {city}...
    </motion.h2>
    <p className="text-slate-500 text-lg max-w-sm font-medium">
      Nuestra IA está contactando con expertos locales para diseñar tu ruta exclusiva.
    </p>
  </div>
);

const PlanResult = ({ plan, onReset }: { plan: PlanResponse, onReset: () => void }) => {
  const [favorites, setFavorites] = useState<number[]>([]);

  const toggleFavorite = (idx: number) => {
    setFavorites(prev => prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]);
  };

  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 mb-16">
        <div className="flex-1">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 text-blue-600 font-black uppercase tracking-[0.3em] text-xs mb-4"
          >
            <div className="w-8 h-px bg-blue-600"></div>
            Tu Itinerario Digital en {plan.city}
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-5xl md:text-7xl font-display font-bold text-slate-900 mb-6 leading-none italic"
          >
            {plan.title}
          </motion.h2>
          <p className="text-slate-400 text-xl md:text-2xl font-medium leading-relaxed max-w-3xl">{plan.description}</p>
        </div>
        
        <div className="flex flex-wrap gap-4 w-full md:w-auto">
          <button onClick={onReset} className="flex-1 px-8 py-4 bg-white border-2 border-slate-100 text-slate-900 font-bold rounded-2xl hover:border-blue-200 hover:text-blue-600 transition-all flex items-center justify-center gap-2">
            <RotateCcw className="w-5 h-5" /> Generar otro
          </button>
          <button className="flex-1 px-8 py-4 bg-slate-900 text-white font-bold rounded-2xl shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
            <Share2 className="w-5 h-5" /> Compartir plan
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Step Cards */}
        <div className="lg:col-span-8 space-y-12">
          {plan.steps.map((step, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.2 }}
              className="group flex flex-col md:flex-row bg-white rounded-[3rem] overflow-hidden shadow-2xl shadow-slate-100 border border-slate-50 min-h-[300px]"
            >
              <div className="md:w-2/5 relative h-64 md:h-auto overflow-hidden">
                <img src={step.image} alt={step.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                <div className="absolute top-6 left-6 z-10 px-6 py-2 bg-slate-900/40 backdrop-blur-md rounded-full text-[10px] font-black text-white uppercase tracking-widest">
                  Parada {idx + 1}
                </div>
                <button 
                  onClick={() => toggleFavorite(idx)}
                  className={cn(
                    "absolute bottom-6 right-6 p-4 rounded-2xl backdrop-blur-md transition-all shadow-xl",
                    favorites.includes(idx) ? "bg-red-500 text-white scale-110" : "bg-white/80 text-slate-900 hover:bg-white"
                  )}
                >
                  <Heart className={cn("w-6 h-6", favorites.includes(idx) && "fill-current")} />
                </button>
              </div>

              <div className="flex-1 p-10 flex flex-col justify-center">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-3xl font-display font-bold text-slate-900">{step.name}</h3>
                  <div className="px-5 py-2 bg-blue-50 text-blue-600 rounded-2xl text-sm font-black whitespace-nowrap">
                    {step.price}
                  </div>
                </div>
                {step.address && (
                  <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest mb-6">
                    <MapPin className="w-4 h-4 text-blue-500" />
                    {step.address}
                  </div>
                )}
                <p className="text-slate-500 text-lg leading-relaxed mb-10">{step.description}</p>
                
                <div className="flex gap-3">
                  <button className="flex-1 py-4 bg-slate-50 hover:bg-slate-100 text-slate-900 font-bold rounded-2xl border border-slate-100 transition-all flex items-center justify-center gap-2">
                    Reservar ahora
                  </button>
                  <button className="px-6 py-4 bg-white border border-slate-200 text-slate-400 rounded-2xl hover:text-blue-600 hover:border-blue-100 transition-all">
                    <Info className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Sidebar Info */}
        <div className="lg:col-span-4 space-y-8 sticky top-32">
          {/* Tip Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-[2.5rem] text-white shadow-2xl"
          >
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
              <Sparkles className="text-blue-400 w-6 h-6" />
            </div>
            <h4 className="text-xl font-bold mb-4">Consejo de Experto</h4>
            <p className="text-slate-300 leading-relaxed italic">"{plan.localTip}"</p>
          </motion.div>

          {/* Map Simulation */}
          <div className="bg-slate-100 h-96 rounded-[2.5rem] overflow-hidden relative group">
            <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/light-v10/static/0,0,1/400x400?access_token=pk')] bg-cover opacity-30 grayscale contrast-125"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-blue-100/30 rounded-full animate-ping"></div>
                <div className="relative z-10 w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-xl shadow-blue-300"></div>
              </div>
              {/* Mock markers */}
              <div className="absolute top-20 left-32 w-3 h-3 bg-slate-900 rounded-full"></div>
              <div className="absolute bottom-24 right-20 w-3 h-3 bg-slate-900 rounded-full"></div>
            </div>
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-4/5 px-6 py-4 bg-white/90 backdrop-blur rounded-2xl flex items-center justify-between shadow-xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center font-bold text-xs">03</div>
                <span className="text-sm font-bold text-slate-800">Paradas totales</span>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400" />
            </div>
          </div>

          {/* Related Plans */}
          <div className="space-y-4">
            <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Planes similares</h5>
            {[
              { title: 'Madrid Bohemio', img: 'https://images.unsplash.com/photo-1543783232-f79f0c679b0e' },
              { title: 'Noche en Malasaña', img: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87' },
            ].map((related, i) => (
              <div key={i} className="group flex items-center gap-4 p-3 bg-white hover:bg-blue-50 rounded-2xl border border-slate-100 transition-all cursor-pointer">
                <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                  <img src={related.img} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <h6 className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{related.title}</h6>
                  <p className="text-[10px] text-slate-400 uppercase font-black">{plan.city}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default function App() {
  const [state, setState] = useState<AppState>('landing');
  const [plan, setPlan] = useState<PlanResponse | null>(null);
  const [selectedCity, setSelectedCity] = useState('Madrid');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [state]);

  const handleStart = (city?: string) => {
    if (city) setSelectedCity(city);
    setState('form');
  };

  const handleSelectCity = (city: string) => {
    setSelectedCity(city);
    setState('form');
  };

  const handleSubmit = async (data: FormData) => {
    setState('loading');
    try {
      const generatedPlan = await generatePlan(data);
      setPlan(generatedPlan);
      setState('result');
    } catch (error) {
      console.error("Failed to generate plan:", error);
      setState('form');
    }
  };

  const handleReset = () => {
    setPlan(null);
    setState('form');
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      <Header />
      
      <main className="relative">
        <AnimatePresence mode="wait">
          {state === 'landing' && (
            <motion.div 
              key="landing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Hero onStart={handleStart} onSelectCity={handleSelectCity} />
            </motion.div>
          )}

          {(state === 'form' || state === 'loading') && (
            <motion.div 
              key="form"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="pt-32 pb-20 px-6 bg-slate-50/50 min-h-screen"
            >
              {state === 'form' ? (
                <PlanForm city={selectedCity} onSubmit={handleSubmit} />
              ) : (
                <LoadingState city={selectedCity} />
              )}
            </motion.div>
          )}

          {state === 'result' && plan && (
            <motion.div 
              key="result"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="pt-32 pb-20"
            >
              <PlanResult plan={plan} onReset={handleReset} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="py-24 px-6 border-t border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-16">
          <div className="max-w-md">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-blue-600 rounded-[1rem] flex items-center justify-center transform -rotate-12">
                <Sparkles className="text-white w-6 h-6" />
              </div>
              <span className="text-2xl font-display font-bold italic tracking-tight uppercase">Planify</span>
            </div>
            <p className="text-slate-400 text-lg leading-relaxed mb-8 font-medium">
              El asistente definitivo para el viajero moderno. Diseñamos experiencias que no se pueden comprar con una simple búsqueda, solo con el alma de un local y la mente de una IA.
            </p>
            <div className="flex gap-4">
              {['Twitter', 'Instagram', 'LinkedIn'].map(s => (
                <div key={s} className="px-4 py-2 rounded-xl bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400 border border-slate-100 cursor-pointer hover:bg-blue-600 hover:text-white transition-all">
                  {s}
                </div>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-16">
            <div>
              <h5 className="font-black text-[10px] mb-8 uppercase tracking-[0.3em] text-slate-900 leading-none">Producto</h5>
              <ul className="text-slate-500 text-sm font-bold space-y-6">
                <li><a href="#" className="hover:text-blue-600 transition-colors">Ciudades</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Premium</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Para Empresas</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-black text-[10px] mb-8 uppercase tracking-[0.3em] text-slate-900 leading-none">Compañía</h5>
              <ul className="text-slate-500 text-sm font-bold space-y-6">
                <li><a href="#" className="hover:text-blue-600 transition-colors">Sobre nosotros</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Contacto</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Blog</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto pt-16 mt-20 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">
          <span>© 2026 Planify AI Global Inc.</span>
          <div className="flex gap-10">
            <a href="#" className="hover:text-blue-600 transition-colors">Privacidad</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Términos</a>
          </div>
          <span>Crafted with ❤️ for Europe</span>
        </div>
      </footer>
    </div>
  );
}
