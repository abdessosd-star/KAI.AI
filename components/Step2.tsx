
import React, { useState, useEffect } from 'react';
import { Task, Language } from '../types';
import { assessTasksWithAI } from '../services/geminiService';
import { ArrowRight, BrainCircuit, Info } from 'lucide-react';
import { translations } from '../constants/translations';

interface Step2Props {
  jobTitle: string;
  rawTasks: string[];
  onNext: (assessedTasks: Task[]) => void;
  language: Language;
}

export const Step2: React.FC<Step2Props> = ({ jobTitle, rawTasks, onNext, language }) => {
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<Task[]>([]);
  const t = translations[language].step2;

  // Initial AI Assessment
  useEffect(() => {
    const init = async () => {
      try {
        const assessed = await assessTasksWithAI(jobTitle, rawTasks, language);
        // Apply the enhanced client-side logic immediately to AI results too, to ensure consistency
        const calibrated = assessed.map(t => ({
          ...t,
          category: calculateCategory(t)
        }));
        setTasks(calibrated);
      } catch (e) {
        console.error(e);
        // Fallback manual creation if AI fails
        setTasks(rawTasks.map((t, i) => ({
          id: `t-${i}`, description: t, patternRecognition: 3, humanInteraction: 3, complexity: 3, creativity: 3, dataAccessibility: 3, category: 'Augment'
        })));
      } finally {
        setLoading(false);
      }
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const calculateCategory = (t: Omit<Task, 'category' | 'id'>): 'Automate' | 'Augment' | 'Human' => {
    const { patternRecognition, dataAccessibility, humanInteraction, complexity, creativity } = t;

    // Improved Logic: Rule-based Gates + Weighted Scoring

    // 1. Human Gate: High Empathy or Creativity
    // If a task requires deep empathy or pure creativity, it's likely Human-centric.
    if (humanInteraction >= 4.2 || creativity >= 4.5) {
       // Exception: If it's also highly repetitive and data-rich, AI serves as a Copilot (Augment).
       // e.g., A therapist taking notes (High Human, High Pattern).
       if (patternRecognition >= 4 && dataAccessibility >= 4) return 'Augment';
       return 'Human';
    }

    // 2. Automate Gate: High Pattern + High Data + Low Complexity
    // If it's routine, data-based, and simple, it's Automate.
    if (patternRecognition >= 4.0 && dataAccessibility >= 4.0 && complexity <= 2.5) {
      return 'Automate';
    }

    // 3. Weighted Scoring for the nuance in gray areas
    
    // Automate: Drives by Pattern and Data. Penalized heavily by Human/Complexity.
    const automateScore = (patternRecognition * 1.5) + (dataAccessibility * 1.2) - (complexity * 2) - (humanInteraction * 2);
    
    // Augment: Drives by Complexity and Data (AI as reasoning engine).
    const augmentScore = (complexity * 1.5) + (dataAccessibility * 1.2) + (patternRecognition * 0.5);
    
    // Human: Drives by Human Interaction and Creativity.
    const humanScore = (humanInteraction * 2) + (creativity * 2) - (dataAccessibility * 0.5);

    // Determine Winner
    if (automateScore > augmentScore && automateScore > humanScore) return 'Automate';
    if (humanScore > augmentScore && humanScore > automateScore) return 'Human';
    
    // Default to Augment as the "Copilot" middle ground
    return 'Augment';
  };

  const updateRating = (taskId: string, field: keyof Task, value: number) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const updatedTask = { ...t, [field]: value };
        return {
          ...updatedTask,
          category: calculateCategory(updatedTask)
        };
      }
      return t;
    }));
  };

  const criteria = [
    { 
      key: 'patternRecognition', 
      label: t.labels.pattern, 
      tooltip: t.tooltips.pattern
    },
    { 
      key: 'humanInteraction', 
      label: t.labels.human, 
      tooltip: t.tooltips.human
    },
    { 
      key: 'complexity', 
      label: t.labels.complexity, 
      tooltip: t.tooltips.complexity
    },
    { 
      key: 'creativity', 
      label: t.labels.creativity, 
      tooltip: t.tooltips.creativity
    },
    { 
      key: 'dataAccessibility', 
      label: t.labels.data, 
      tooltip: t.tooltips.data
    },
  ];

  const getCategoryLabel = (category: string) => {
      switch (category) {
          case 'Automate': return t.automate;
          case 'Augment': return t.augment;
          case 'Human': return t.human;
          default: return category;
      }
  }

  const getContextHint = (category: string) => {
      switch (category) {
          case 'Automate': return t.categories.automate;
          case 'Augment': return t.categories.augment;
          case 'Human': return t.categories.human;
          default: return "";
      }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-6">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
          <BrainCircuit className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-600" size={24} />
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-xl font-semibold text-slate-800">{t.loadingTitle}</h3>
          <p className="text-slate-500">{t.loadingSubtitle}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20 animate-in fade-in">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-slate-800">{t.title}</h2>
        <p className="text-slate-500 max-w-2xl mx-auto">
          {t.subtitle} <span className="text-red-500 font-medium">{t.automate}</span>, <span className="text-blue-500 font-medium">{t.augment}</span>, of <span className="text-green-600 font-medium">{t.human}</span>.
        </p>
      </div>

      <div className="grid gap-6">
        {tasks.map((task) => (
          <div key={task.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-blue-300 transition-all group/card">
            <div className="flex flex-col md:flex-row justify-between gap-6">
              <div className="flex-1">
                <div className="flex justify-between items-start">
                    <h4 className="font-semibold text-lg text-slate-800 mb-2">{task.description}</h4>
                    <div className="md:hidden">
                        <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider
                        ${task.category === 'Automate' ? 'bg-red-100 text-red-700' : 
                        task.category === 'Human' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                        {getCategoryLabel(task.category)}
                    </span>
                    </div>
                </div>
                
                <div className="hidden md:flex items-center gap-2 mt-2">
                   <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider transition-colors duration-300
                    ${task.category === 'Automate' ? 'bg-red-100 text-red-700' : 
                      task.category === 'Human' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                     {getCategoryLabel(task.category)}
                   </span>
                </div>
                
                {/* Dynamic Context Hint based on Category */}
                <p className="text-xs text-slate-400 mt-3 italic">
                    {getContextHint(task.category)}
                </p>
              </div>

              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                {criteria.map((criterion) => (
                  <div key={criterion.key} className="relative group">
                    <div className="flex justify-between mb-1">
                      <label className="text-xs font-medium text-slate-500 flex items-center gap-1 cursor-help transition-colors hover:text-blue-600">
                        {criterion.label}
                        <Info size={10} className="text-slate-300 group-hover:text-blue-400" />
                      </label>
                      <span className="text-xs font-bold text-slate-700">{(task as any)[criterion.key]}/5</span>
                    </div>
                    
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-0 mb-2 w-56 p-3 bg-slate-800 text-white text-xs rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-10 leading-relaxed transform translate-y-1 group-hover:translate-y-0">
                      {criterion.tooltip}
                      <div className="absolute top-full left-4 -mt-1 border-4 border-transparent border-t-slate-800"></div>
                    </div>

                    <input
                      type="range"
                      min="1"
                      max="5"
                      step="0.5"
                      value={(task as any)[criterion.key]}
                      onChange={(e) => updateRating(task.id, criterion.key as any, parseFloat(e.target.value))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 hover:accent-blue-500"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end pt-4">
        <button
          onClick={() => onNext(tasks)}
          className="px-8 py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 shadow-xl hover:shadow-2xl transition-all flex items-center gap-3 hover:scale-[1.02]"
        >
          {t.analyzeButton} <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
};
