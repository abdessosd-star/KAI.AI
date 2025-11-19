
import React, { useState } from 'react';
import { suggestRoleDetails } from '../services/geminiService';
import { Loader2, Plus, Trash2, Check, Sparkles, Brain, Heart } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../constants/translations';

interface Step1Props {
  onNext: (jobTitle: string, tasks: string[], hardSkills: string[], softSkills: string[]) => void;
  language: Language;
}

export const Step1: React.FC<Step1Props> = ({ onNext, language }) => {
  const [jobTitle, setJobTitle] = useState('');
  const [tasks, setTasks] = useState<string[]>([]);
  const [hardSkills, setHardSkills] = useState<string[]>([]);
  const [softSkills, setSoftSkills] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  
  // Inputs
  const [customTask, setCustomTask] = useState('');
  const [customHardSkill, setCustomHardSkill] = useState('');
  const [customSoftSkill, setCustomSoftSkill] = useState('');

  const t = translations[language].step1;

  const handleGenerate = async () => {
    if (!jobTitle) return;
    setLoading(true);
    try {
      const result = await suggestRoleDetails(jobTitle, language);
      setTasks(result.tasks);
      setHardSkills(result.hardSkills);
      setSoftSkills(result.softSkills);
      setHasGenerated(true);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const addItem = (
    list: string[], 
    setList: React.Dispatch<React.SetStateAction<string[]>>, 
    item: string, 
    setItem: React.Dispatch<React.SetStateAction<string>>
  ) => {
    if (item.trim()) {
      setList([...list, item.trim()]);
      setItem('');
    }
  };

  const removeItem = (list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>, index: number) => {
    setList(list.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-slate-800">{t.title}</h2>
        <p className="text-slate-500">{t.subtitle}</p>
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-medium text-slate-700">{t.jobTitleLabel}</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            className="flex-1 px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
            placeholder={t.placeholder}
          />
          <button
            onClick={handleGenerate}
            disabled={loading || !jobTitle}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2 shadow-md transition-all whitespace-nowrap"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
            {loading ? t.buttonLoading : t.button}
          </button>
        </div>
      </div>

      {hasGenerated && (
        <div className="space-y-8">
          {/* Tasks Section */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                <div className="bg-blue-100 p-1 rounded-md"><Sparkles size={14} className="text-blue-600"/></div>
                {t.responsibilities}
              </h3>
              <span className="text-xs text-slate-400">{tasks.length} {t.items}</span>
            </div>
            <ul className="grid gap-2">
              {tasks.map((task, idx) => (
                <li key={idx} className="group flex items-center gap-3 bg-white p-3 rounded-lg border border-slate-200 shadow-sm hover:border-blue-300 transition-colors">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0"></div>
                  <span className="flex-1 text-slate-700 text-sm">{task}</span>
                  <button onClick={() => removeItem(tasks, setTasks, idx)} className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                    <Trash2 size={16} />
                  </button>
                </li>
              ))}
            </ul>
            <div className="flex gap-2">
              <input
                type="text"
                value={customTask}
                onChange={(e) => setCustomTask(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addItem(tasks, setTasks, customTask, setCustomTask)}
                placeholder={t.addTask}
                className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button onClick={() => addItem(tasks, setTasks, customTask, setCustomTask)} className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200">
                <Plus size={20} />
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Hard Skills */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                   <div className="bg-indigo-100 p-1 rounded-md"><Brain size={14} className="text-indigo-600"/></div>
                   {t.hardSkills}
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {hardSkills.map((skill, idx) => (
                  <span key={idx} className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 group border border-indigo-100">
                    {skill}
                    <button onClick={() => removeItem(hardSkills, setHardSkills, idx)} className="hover:text-red-500 opacity-50 hover:opacity-100">
                      <Trash2 size={12} />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2 mt-2">
                <input
                  type="text"
                  value={customHardSkill}
                  onChange={(e) => setCustomHardSkill(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addItem(hardSkills, setHardSkills, customHardSkill, setCustomHardSkill)}
                  placeholder={t.addSkill}
                  className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <button onClick={() => addItem(hardSkills, setHardSkills, customHardSkill, setCustomHardSkill)} className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200">
                  <Plus size={18} />
                </button>
              </div>
            </div>

            {/* Soft Skills */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                  <div className="bg-pink-100 p-1 rounded-md"><Heart size={14} className="text-pink-600"/></div>
                  {t.softSkills}
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {softSkills.map((skill, idx) => (
                  <span key={idx} className="bg-pink-50 text-pink-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 group border border-pink-100">
                    {skill}
                    <button onClick={() => removeItem(softSkills, setSoftSkills, idx)} className="hover:text-red-500 opacity-50 hover:opacity-100">
                      <Trash2 size={12} />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2 mt-2">
                <input
                  type="text"
                  value={customSoftSkill}
                  onChange={(e) => setCustomSoftSkill(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addItem(softSkills, setSoftSkills, customSoftSkill, setCustomSoftSkill)}
                  placeholder={t.addSkill}
                  className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-pink-500"
                />
                <button onClick={() => addItem(softSkills, setSoftSkills, customSoftSkill, setCustomSoftSkill)} className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200">
                  <Plus size={18} />
                </button>
              </div>
            </div>
          </div>

          <div className="pt-6 flex justify-end border-t border-slate-100">
            <button
              onClick={() => onNext(jobTitle, tasks, hardSkills, softSkills)}
              disabled={tasks.length === 0}
              className="px-8 py-3 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
            >
              {t.nextButton} <Check size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
