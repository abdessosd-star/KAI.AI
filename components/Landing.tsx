
import React from 'react';
import { ArrowRight, Cpu, Zap, Heart, Layers, Sparkles } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../constants/translations';

interface LandingProps {
  onStart: () => void;
  language: Language;
}

export const Landing: React.FC<LandingProps> = ({ onStart, language }) => {
  const t = translations[language].landing;

  return (
    <div className="space-y-20 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Hero Section */}
      <div className="text-center space-y-8 max-w-3xl mx-auto pt-8">
        <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 px-4 py-2 rounded-full text-blue-700 text-sm font-medium animate-pulse">
          <Sparkles size={16} />
          <span>Powered by Gemini 2.5 Thinking Mode</span>
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
          {t.heroTitle}
        </h1>
        <p className="text-xl text-slate-600 leading-relaxed">
          {t.heroSubtitle}
        </p>
        <div className="flex justify-center pt-4">
          <button
            onClick={onStart}
            className="group relative px-8 py-4 bg-blue-600 text-white text-lg font-bold rounded-2xl shadow-xl hover:shadow-2xl hover:bg-blue-700 transition-all hover:scale-105 flex items-center gap-3 overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
               {t.cta} <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </div>
      </div>

      {/* Model Explanation Cards */}
      <div className="space-y-10">
         <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-800">{t.kaiTitle}</h2>
            <p className="text-slate-500 mt-2">{t.kaiSubtitle}</p>
         </div>

         <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
            {/* Automate Card */}
            <div className="bg-white rounded-3xl p-8 shadow-lg border-t-4 border-red-500 hover:shadow-xl transition-all hover:-translate-y-1 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Cpu size={100} className="text-red-500" />
                </div>
                <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center text-red-600 mb-6">
                    <Cpu size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{t.cards.automate.title}</h3>
                <p className="text-slate-600 mb-6 leading-relaxed">
                    {t.cards.automate.desc}
                </p>
                <div className="flex flex-wrap gap-2">
                    {t.cards.automate.tags.map((tag, i) => (
                        <span key={i} className="px-3 py-1 bg-red-50 text-red-700 text-xs font-bold rounded-full uppercase tracking-wide">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>

            {/* Augment Card */}
            <div className="bg-white rounded-3xl p-8 shadow-lg border-t-4 border-blue-500 hover:shadow-xl transition-all hover:-translate-y-1 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Zap size={100} className="text-blue-500" />
                </div>
                <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
                    <Zap size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{t.cards.augment.title}</h3>
                <p className="text-slate-600 mb-6 leading-relaxed">
                    {t.cards.augment.desc}
                </p>
                <div className="flex flex-wrap gap-2">
                    {t.cards.augment.tags.map((tag, i) => (
                        <span key={i} className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full uppercase tracking-wide">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>

            {/* Human Card */}
            <div className="bg-white rounded-3xl p-8 shadow-lg border-t-4 border-green-500 hover:shadow-xl transition-all hover:-translate-y-1 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Heart size={100} className="text-green-500" />
                </div>
                <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center text-green-600 mb-6">
                    <Heart size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{t.cards.human.title}</h3>
                <p className="text-slate-600 mb-6 leading-relaxed">
                    {t.cards.human.desc}
                </p>
                <div className="flex flex-wrap gap-2">
                    {t.cards.human.tags.map((tag, i) => (
                        <span key={i} className="px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-full uppercase tracking-wide">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
         </div>
      </div>

      {/* Steps visual */}
      <div className="border-t border-slate-200 pt-12">
         <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto text-center">
            <div className="p-4">
                <div className="text-4xl font-black text-slate-100 mb-2">01</div>
                <h4 className="font-bold text-slate-800">{t.features.step1.title}</h4>
                <p className="text-sm text-slate-500">{t.features.step1.desc}</p>
            </div>
            <div className="p-4">
                <div className="text-4xl font-black text-slate-100 mb-2">02</div>
                <h4 className="font-bold text-slate-800">{t.features.step2.title}</h4>
                <p className="text-sm text-slate-500">{t.features.step2.desc}</p>
            </div>
            <div className="p-4">
                <div className="text-4xl font-black text-slate-100 mb-2">03</div>
                <h4 className="font-bold text-slate-800">{t.features.step3.title}</h4>
                <p className="text-sm text-slate-500">{t.features.step3.desc}</p>
            </div>
         </div>
      </div>
    </div>
  );
};
