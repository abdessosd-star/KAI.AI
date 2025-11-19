
import React, { useEffect, useState } from 'react';
import { SavedProfile, Language } from '../types';
import { getProfiles, deleteProfile } from '../services/storageService';
import { Trash2, Calendar, ArrowRight, Layers, TrendingUp, Brain, Heart } from 'lucide-react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { translations } from '../constants/translations';

interface DashboardProps {
  onLoadProfile: (profile: SavedProfile) => void;
  onNewAssessment: () => void;
  language: Language;
}

export const Dashboard: React.FC<DashboardProps> = ({ onLoadProfile, onNewAssessment, language }) => {
  const [profiles, setProfiles] = useState<SavedProfile[]>([]);
  const t = translations[language].dashboard;
  const commonT = translations[language].step2;

  useEffect(() => {
    setProfiles(getProfiles());
  }, []);

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    deleteProfile(id);
    setProfiles(prev => prev.filter(p => p.id !== id));
  };

  // Prepare Chart Data (Chronological)
  const chartData = [...profiles]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map(p => ({
      date: new Date(p.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      automate: p.analysis.percentages.automate,
      augment: p.analysis.percentages.augment,
      human: p.analysis.percentages.human,
      title: p.jobTitle
    }));

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">{t.title}</h2>
          <p className="text-slate-500 mt-1">{t.subtitle}</p>
        </div>
        <button
          onClick={onNewAssessment}
          className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg transition-all flex items-center gap-2"
        >
          <Layers size={18} /> {t.newButton}
        </button>
      </div>

      {profiles.length > 1 && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="text-blue-600" size={20} />
            <h3 className="font-bold text-slate-800">{t.trend}</h3>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <defs>
                  <linearGradient id="colorAuto" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorAug" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} unit="%" />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="automate" stroke="#ef4444" fillOpacity={1} fill="url(#colorAuto)" strokeWidth={2} name={commonT.automate} />
                <Area type="monotone" dataKey="augment" stroke="#3b82f6" fillOpacity={1} fill="url(#colorAug)" strokeWidth={2} name={commonT.augment} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {profiles.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
            <Layers size={24} />
          </div>
          <h3 className="text-xl font-semibold text-slate-700">{t.emptyTitle}</h3>
          <p className="text-slate-500 mt-2 mb-6">{t.emptySub}</p>
          <button onClick={onNewAssessment} className="text-blue-600 font-medium hover:underline">
            {t.startLink}
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {profiles.map((profile) => (
            <div
              key={profile.id}
              onClick={() => onLoadProfile(profile)}
              className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group relative flex flex-col h-full"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg text-slate-800 group-hover:text-blue-600 transition-colors">{profile.jobTitle}</h3>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                    <Calendar size={12} />
                    {new Date(profile.date).toLocaleDateString()}
                  </div>
                </div>
                <button
                  onClick={(e) => handleDelete(e, profile.id)}
                  className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                  title="Delete Profile"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="flex gap-2 mt-2">
                <div className="flex-1 bg-slate-50 rounded-lg p-2 text-center">
                    <span className="block text-xs text-slate-500 uppercase font-bold tracking-wide">Auto</span>
                    <span className="font-bold text-red-500 text-lg">{profile.analysis.percentages.automate}%</span>
                </div>
                <div className="flex-1 bg-slate-50 rounded-lg p-2 text-center">
                    <span className="block text-xs text-slate-500 uppercase font-bold tracking-wide">Augment</span>
                    <span className="font-bold text-blue-500 text-lg">{profile.analysis.percentages.augment}%</span>
                </div>
                <div className="flex-1 bg-slate-50 rounded-lg p-2 text-center">
                    <span className="block text-xs text-slate-500 uppercase font-bold tracking-wide">Human</span>
                    <span className="font-bold text-green-500 text-lg">{profile.analysis.percentages.human}%</span>
                </div>
              </div>

              {/* Skills Preview in Dashboard */}
              {(profile.hardSkills?.length > 0 || profile.softSkills?.length > 0) && (
                <div className="mt-4 flex gap-3">
                    {profile.hardSkills?.length > 0 && (
                        <div className="flex items-center gap-1 text-xs text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">
                            <Brain size={12} />
                            <span className="font-medium">{profile.hardSkills.length} {t.skills}</span>
                        </div>
                    )}
                    {profile.softSkills?.length > 0 && (
                        <div className="flex items-center gap-1 text-xs text-pink-600 bg-pink-50 px-2 py-1 rounded-md">
                            <Heart size={12} />
                            <span className="font-medium">{profile.softSkills.length} {t.softSkills}</span>
                        </div>
                    )}
                </div>
              )}

              <div className="mt-auto pt-4 border-t border-slate-100 flex justify-between items-center text-sm text-slate-500">
                <span>{profile.tasks.length} {t.tasks}</span>
                <ArrowRight size={16} className="text-slate-300 group-hover:text-blue-500 transform group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
