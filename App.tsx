
import React, { useState, Suspense } from 'react';
import { Step, Task, SavedProfile, Language } from './types';
import { Step1 } from './components/Step1';
import { Step2 } from './components/Step2';
import { Step3 } from './components/Step3';
import { Dashboard } from './components/Dashboard';
import { Landing } from './components/Landing';
import { LiveAgent } from './components/LiveAgent';
import { ChatBot } from './components/ChatBot';
import { EmbedGenerator } from './components/EmbedGenerator';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Layers, ChevronRight, LayoutDashboard, Share2, X, Globe, Loader2 } from 'lucide-react';
import { translations } from './constants/translations';

function AppContent() {
  const [currentStep, setCurrentStep] = useState<Step>(Step.Landing);
  const [jobTitle, setJobTitle] = useState('');
  const [rawTasks, setRawTasks] = useState<string[]>([]);
  const [hardSkills, setHardSkills] = useState<string[]>([]);
  const [softSkills, setSoftSkills] = useState<string[]>([]);
  const [assessedTasks, setAssessedTasks] = useState<Task[]>([]);
  const [loadedAnalysis, setLoadedAnalysis] = useState<any>(null);
  const [showHomeEmbed, setShowHomeEmbed] = useState(false);
  const [language, setLanguage] = useState<Language>('nl'); // Default Dutch

  const t = translations[language];

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

  const goToHome = () => {
    setCurrentStep(Step.Landing);
  };

  const goToDashboard = () => {
    setCurrentStep(Step.Dashboard);
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'nl' ? 'en' : 'nl');
  };

  return (
    <div className="min-h-screen bg-slate-50 relative">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={goToHome}>
            <div className="bg-blue-600 p-1.5 rounded-lg text-white">
              <Layers size={20} />
            </div>
            <span className="font-bold text-xl text-slate-800">KAI<span className="text-blue-600">.ai</span></span>
          </div>
          
          {/* Progress Steps - Hide on Landing and Dashboard */}
          {currentStep !== Step.Dashboard && currentStep !== Step.Landing && (
            <div className="hidden md:flex items-center gap-4 text-sm font-medium">
              <div className={`flex items-center gap-2 ${currentStep >= Step.Scope ? 'text-blue-600' : 'text-slate-400'}`}>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center border ${currentStep >= Step.Scope ? 'bg-blue-50 border-blue-200' : 'border-slate-200'}`}>1</span>
                {t.header.scope}
              </div>
              <ChevronRight size={16} className="text-slate-300" />
              <div className={`flex items-center gap-2 ${currentStep >= Step.Assess ? 'text-blue-600' : 'text-slate-400'}`}>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center border ${currentStep >= Step.Assess ? 'bg-blue-50 border-blue-200' : 'border-slate-200'}`}>2</span>
                {t.header.assess}
              </div>
              <ChevronRight size={16} className="text-slate-300" />
              <div className={`flex items-center gap-2 ${currentStep >= Step.Impact ? 'text-blue-600' : 'text-slate-400'}`}>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center border ${currentStep >= Step.Impact ? 'bg-blue-50 border-blue-200' : 'border-slate-200'}`}>3</span>
                {t.header.impact}
              </div>
            </div>
          )}

          <div className="flex items-center gap-3">
            {/* Language Toggle */}
            <div className="flex items-center bg-slate-100 rounded-lg p-1 border border-slate-200">
               <button 
                  onClick={() => setLanguage('nl')} 
                  className={`px-2 py-1 rounded-md text-xs font-bold transition-all ${language === 'nl' ? 'bg-white shadow-sm text-blue-700' : 'text-slate-500'}`}
               >
                 NL
               </button>
               <button 
                  onClick={() => setLanguage('en')} 
                  className={`px-2 py-1 rounded-md text-xs font-bold transition-all ${language === 'en' ? 'bg-white shadow-sm text-blue-700' : 'text-slate-500'}`}
               >
                 EN
               </button>
            </div>

             <button 
               onClick={goToDashboard}
               className={`p-2 rounded-lg transition-colors ${currentStep === Step.Dashboard ? 'bg-blue-100 text-blue-700' : 'text-slate-500 hover:bg-slate-100'}`}
               title={t.header.dashboard}
             >
               <LayoutDashboard size={20} />
             </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
        {currentStep === Step.Landing && <Landing onStart={handleNewAssessment} language={language} />}
        {currentStep === Step.Scope && <Step1 onNext={handleStep1Next} language={language} />}
        {currentStep === Step.Assess && <Step2 jobTitle={jobTitle} rawTasks={rawTasks} onNext={handleStep2Next} language={language} />}
        {currentStep === Step.Impact && (
          <Step3 
            jobTitle={jobTitle} 
            assessedTasks={assessedTasks} 
            hardSkills={hardSkills}
            softSkills={softSkills}
            existingAnalysis={loadedAnalysis}
            language={language}
          />
        )}
        {currentStep === Step.Dashboard && <Dashboard onLoadProfile={handleLoadProfile} onNewAssessment={handleNewAssessment} language={language} />}
      </main>

      {/* Embed Generator - Only on Landing & Scope */}
      {(currentStep === Step.Scope || currentStep === Step.Landing) && (
        <div className="fixed right-0 top-24 z-20 flex flex-col items-end">
            {!showHomeEmbed ? (
               <button 
                 onClick={() => setShowHomeEmbed(true)}
                 className="bg-slate-900 text-white p-3 rounded-l-xl shadow-lg hover:bg-slate-800 transition-all translate-x-1 hover:translate-x-0 flex items-center gap-2"
                 title={t.embed.title}
               >
                 <span className="text-xs font-bold uppercase tracking-wider hidden md:block pl-1">{t.embed.button}</span>
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
                 <EmbedGenerator language={language} />
               </div>
            )}
        </div>
      )}

      {/* Persistent AI Assistants - Only Visible when Career Strategy is Generated (Step.Impact) */}
      {currentStep === Step.Impact && (
        <>
          <ChatBot language={language} />
          <LiveAgent language={language} />
        </>
      )}
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={
        <div className="h-screen w-screen flex items-center justify-center bg-slate-50">
          <Loader2 className="animate-spin text-blue-600" size={48} />
        </div>
      }>
        <AppContent />
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;
