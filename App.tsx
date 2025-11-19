
import React, { useState } from 'react';
import { Step, Task, SavedProfile } from './types';
import { Step1 } from './components/Step1';
import { Step2 } from './components/Step2';
import { Step3 } from './components/Step3';
import { Dashboard } from './components/Dashboard';
import { LiveAgent } from './components/LiveAgent';
import { ChatBot } from './components/ChatBot';
import { EmbedGenerator } from './components/EmbedGenerator';
import { Layers, ChevronRight, LayoutDashboard, Share2, X } from 'lucide-react';

function App() {
  const [currentStep, setCurrentStep] = useState<Step>(Step.Scope);
  const [jobTitle, setJobTitle] = useState('');
  const [rawTasks, setRawTasks] = useState<string[]>([]);
  const [hardSkills, setHardSkills] = useState<string[]>([]);
  const [softSkills, setSoftSkills] = useState<string[]>([]);
  const [assessedTasks, setAssessedTasks] = useState<Task[]>([]);
  const [loadedAnalysis, setLoadedAnalysis] = useState<any>(null);
  const [showHomeEmbed, setShowHomeEmbed] = useState(false);

  const handleStep1Next = (title: string, tasks: string[], hard: string[], soft: string[]) => {
    setJobTitle(title);
    setRawTasks(tasks);
    setHardSkills(hard);
    setSoftSkills(soft);
    setLoadedAnalysis(null); // Clear any loaded historical data
    setCurrentStep(Step.Assess);
  };

  const handleStep2Next = (tasks: Task[]) => {
    setAssessedTasks(tasks);
    setCurrentStep(Step.Impact);
  };

  const handleLoadProfile = (profile: SavedProfile) => {
    setJobTitle(profile.jobTitle);
    setAssessedTasks(profile.tasks);
    setHardSkills(profile.hardSkills || []);
    setSoftSkills(profile.softSkills || []);
    setLoadedAnalysis(profile.analysis);
    setCurrentStep(Step.Impact);
  };

  const handleNewAssessment = () => {
    setJobTitle('');
    setRawTasks([]);
    setHardSkills([]);
    setSoftSkills([]);
    setAssessedTasks([]);
    setLoadedAnalysis(null);
    setCurrentStep(Step.Scope);
  };

  const goToDashboard = () => {
    setCurrentStep(Step.Dashboard);
  };

  return (
    <div className="min-h-screen bg-slate-50 relative">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={handleNewAssessment}>
            <div className="bg-blue-600 p-1.5 rounded-lg text-white">
              <Layers size={20} />
            </div>
            <span className="font-bold text-xl text-slate-800">KAI<span className="text-blue-600">.ai</span></span>
          </div>
          
          {/* Progress Steps */}
          {currentStep !== Step.Dashboard && (
            <div className="hidden md:flex items-center gap-4 text-sm font-medium">
              <div className={`flex items-center gap-2 ${currentStep >= Step.Scope ? 'text-blue-600' : 'text-slate-400'}`}>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center border ${currentStep >= Step.Scope ? 'bg-blue-50 border-blue-200' : 'border-slate-200'}`}>1</span>
                Scope Job
              </div>
              <ChevronRight size={16} className="text-slate-300" />
              <div className={`flex items-center gap-2 ${currentStep >= Step.Assess ? 'text-blue-600' : 'text-slate-400'}`}>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center border ${currentStep >= Step.Assess ? 'bg-blue-50 border-blue-200' : 'border-slate-200'}`}>2</span>
                Assess Impact
              </div>
              <ChevronRight size={16} className="text-slate-300" />
              <div className={`flex items-center gap-2 ${currentStep >= Step.Impact ? 'text-blue-600' : 'text-slate-400'}`}>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center border ${currentStep >= Step.Impact ? 'bg-blue-50 border-blue-200' : 'border-slate-200'}`}>3</span>
                Career Strategy
              </div>
            </div>
          )}

          <div className="flex items-center gap-4">
             <button 
               onClick={goToDashboard}
               className={`p-2 rounded-lg transition-colors ${currentStep === Step.Dashboard ? 'bg-blue-100 text-blue-700' : 'text-slate-500 hover:bg-slate-100'}`}
               title="Dashboard"
             >
               <LayoutDashboard size={20} />
             </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
        {currentStep === Step.Scope && <Step1 onNext={handleStep1Next} />}
        {currentStep === Step.Assess && <Step2 jobTitle={jobTitle} rawTasks={rawTasks} onNext={handleStep2Next} />}
        {currentStep === Step.Impact && (
          <Step3 
            jobTitle={jobTitle} 
            assessedTasks={assessedTasks} 
            hardSkills={hardSkills}
            softSkills={softSkills}
            existingAnalysis={loadedAnalysis} 
          />
        )}
        {currentStep === Step.Dashboard && <Dashboard onLoadProfile={handleLoadProfile} onNewAssessment={handleNewAssessment} />}
      </main>

      {/* Embed Generator - Only on Home Page (Scope) */}
      {currentStep === Step.Scope && (
        <div className="fixed right-0 top-24 z-20 flex flex-col items-end">
            {!showHomeEmbed ? (
               <button 
                 onClick={() => setShowHomeEmbed(true)}
                 className="bg-slate-900 text-white p-3 rounded-l-xl shadow-lg hover:bg-slate-800 transition-all translate-x-1 hover:translate-x-0 flex items-center gap-2"
                 title="Embed this tool"
               >
                 <span className="text-xs font-bold uppercase tracking-wider hidden md:block pl-1">Embed</span>
                 <Share2 size={20} />
               </button>
            ) : (
               <div className="relative mr-4 animate-in slide-in-from-right">
                 <button 
                   onClick={() => setShowHomeEmbed(false)}
                   className="absolute -top-3 -right-3 bg-white text-slate-800 rounded-full p-1 shadow-md border border-slate-200 z-30 hover:bg-slate-50"
                 >
                   <X size={16} />
                 </button>
                 <EmbedGenerator />
               </div>
            )}
        </div>
      )}

      {/* Persistent AI Assistants - Only Visible when Career Strategy is Generated (Step.Impact) */}
      {currentStep === Step.Impact && (
        <>
          <ChatBot />
          <LiveAgent />
        </>
      )}
    </div>
  );
}

export default App;
