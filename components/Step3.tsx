
import React, { useEffect, useState } from 'react';
import { Task, AnalysisResult } from '../types';
import { generateCareerAnalysis, speakText } from '../services/geminiService';
import { saveProfile } from '../services/storageService';
import { EmbedGenerator } from './EmbedGenerator';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Play, Pause, CheckCircle2, Zap, Cpu, Save, Share2, X } from 'lucide-react';

interface Step3Props {
  jobTitle: string;
  assessedTasks: Task[];
  hardSkills: string[];
  softSkills: string[];
  existingAnalysis?: AnalysisResult;
}

export const Step3: React.FC<Step3Props> = ({ jobTitle, assessedTasks, hardSkills, softSkills, existingAnalysis }) => {
  const [result, setResult] = useState<AnalysisResult | null>(existingAnalysis || null);
  const [loading, setLoading] = useState(!existingAnalysis);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [sourceNode, setSourceNode] = useState<AudioBufferSourceNode | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [showEmbed, setShowEmbed] = useState(false);

  useEffect(() => {
    if (existingAnalysis) return;

    const fetchAnalysis = async () => {
      try {
        // This uses Thinking Budget 32k
        const analysis = await generateCareerAnalysis(jobTitle, assessedTasks, hardSkills, softSkills);
        setResult(analysis);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalysis();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobTitle, assessedTasks, hardSkills, softSkills]);

  const playAudio = async (text: string) => {
    if (isPlaying && sourceNode) {
      sourceNode.stop();
      setIsPlaying(false);
      return;
    }

    const buffer = await speakText(text);
    if (!buffer) return;

    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    setAudioContext(ctx);
    const audioBuffer = await ctx.decodeAudioData(buffer);
    const source = ctx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(ctx.destination);
    source.start(0);
    setSourceNode(source);
    setIsPlaying(true);
    source.onended = () => setIsPlaying(false);
  };

  const handleSave = () => {
    if (result) {
      saveProfile(jobTitle, assessedTasks, hardSkills, softSkills, result);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center space-y-6">
        <div className="animate-pulse flex space-x-4">
           <div className="rounded-full bg-slate-200 h-12 w-12"></div>
           <div className="flex-1 space-y-4 py-1">
             <div className="h-4 bg-slate-200 rounded w-48"></div>
             <div className="space-y-2">
               <div className="h-4 bg-slate-200 rounded w-32"></div>
             </div>
           </div>
        </div>
        <p className="text-slate-500 font-medium">Generating strategic career report...</p>
        <p className="text-xs text-slate-400">Powered by Gemini 3 Pro (Thinking Mode)</p>
      </div>
    );
  }

  if (!result) return <div>Error loading results.</div>;

  const pieData = [
    { name: 'Automate', value: result.percentages.automate, color: '#ef4444' }, // Red
    { name: 'Augment', value: result.percentages.augment, color: '#3b82f6' },  // Blue
    { name: 'Human', value: result.percentages.human, color: '#22c55e' },    // Green
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-24 animate-in fade-in slide-in-from-bottom-8 relative">
      
      {/* Floating Sidebar for Embed - Visible from this page side */}
      <div className="fixed right-0 top-1/3 z-20 flex flex-col items-end">
        {!showEmbed ? (
           <button 
             onClick={() => setShowEmbed(true)}
             className="bg-slate-800 text-white p-3 rounded-l-xl shadow-lg hover:bg-slate-700 transition-all translate-x-1 hover:translate-x-0"
             title="Embed this tool"
           >
             <Share2 size={20} />
           </button>
        ) : (
           <div className="relative mr-4 animate-in slide-in-from-right">
             <button 
               onClick={() => setShowEmbed(false)}
               className="absolute -top-3 -right-3 bg-white text-slate-800 rounded-full p-1 shadow-md border border-slate-200 z-30"
             >
               <X size={16} />
             </button>
             <EmbedGenerator />
           </div>
        )}
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-center md:text-left space-y-2">
          <h2 className="text-4xl font-bold text-slate-900">Your Future as a {jobTitle}</h2>
          <div className="flex justify-center md:justify-start items-center gap-4">
            <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-red-500"></div><span className="text-sm">Automate</span></div>
            <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-blue-500"></div><span className="text-sm">Augment</span></div>
            <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-green-500"></div><span className="text-sm">Human</span></div>
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaved}
          className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg transition-all ${
            isSaved ? 'bg-green-100 text-green-700' : 'bg-white text-slate-800 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          {isSaved ? <><CheckCircle2 size={20} /> Saved</> : <><Save size={20} /> Save Profile</>}
        </button>
      </div>

      {/* Top Row: Chart & Timeline */}
      <div className="grid md:grid-cols-2 gap-8">
        
        {/* Donut Chart */}
        <div className="bg-white p-6 rounded-3xl shadow-lg border border-slate-100 flex flex-col items-center">
          <h3 className="text-lg font-semibold mb-4 text-slate-800">Impact Distribution</h3>
          <div className="h-64 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
               <span className="text-3xl font-bold text-slate-800">{result.percentages.augment}%</span>
               <p className="text-xs text-slate-500 font-medium uppercase">Augment</p>
            </div>
          </div>
        </div>

        {/* Timeline Table */}
        <div className="bg-white p-6 rounded-3xl shadow-lg border border-slate-100">
          <h3 className="text-lg font-semibold mb-4 text-slate-800">Impact Timeline</h3>
          <div className="space-y-4">
            {result.timeline.map((item, i) => (
              <div key={i} className="flex items-start gap-4 pb-4 border-b border-slate-50 last:border-0">
                <div className="w-20 font-bold text-slate-400 text-sm pt-1">{item.period}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                      item.impactLevel === 'High' ? 'bg-red-100 text-red-600' : 
                      item.impactLevel === 'Medium' ? 'bg-yellow-100 text-yellow-600' : 'bg-green-100 text-green-600'
                    }`}>{item.impactLevel} Impact</span>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">{item.prediction}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Plan & Skills */}
      <div className="grid md:grid-cols-3 gap-8">
        {/* Tools */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 rounded-3xl shadow-lg md:col-span-1">
          <div className="flex items-center gap-2 mb-4 text-blue-300">
            <Cpu size={20} />
            <h3 className="font-semibold">AI Tools to Master</h3>
          </div>
          <ul className="space-y-3">
            {result.tools.slice(0, 5).map((tool, i) => (
              <li key={i} className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                <span className="text-slate-200 text-sm">{tool}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Action Plan */}
        <div className="bg-white p-6 rounded-3xl shadow-lg border border-blue-100 md:col-span-2 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-10">
            <Zap size={120} />
          </div>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2 text-blue-600">
               <CheckCircle2 size={20} />
               <h3 className="font-semibold">30-Day Action Plan</h3>
            </div>
            <button 
              onClick={() => playAudio(result.actionPlan)}
              className="p-2 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
              title="Listen to advice"
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>
          </div>
          <p className="text-slate-700 leading-relaxed mb-6 relative z-10">
            {result.actionPlan}
          </p>
          
          <div className="mt-6 pt-6 border-t border-slate-100">
            <h4 className="text-sm font-bold text-slate-900 mb-3">Key Skills to Develop</h4>
            <div className="flex flex-wrap gap-2">
              {result.skillsToDevelop.map((skill, i) => (
                <span key={i} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-600 rounded-2xl p-8 text-center text-white shadow-xl">
        <h3 className="text-2xl font-bold mb-2">Ready to future-proof your career?</h3>
        <p className="text-blue-100 mb-6">Start learning these skills today.</p>
        <button className="px-6 py-3 bg-white text-blue-600 rounded-lg font-bold hover:bg-blue-50 transition-colors">
          Explore Learning Resources
        </button>
      </div>
    </div>
  );
};
