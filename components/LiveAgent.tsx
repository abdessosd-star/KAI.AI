
import React, { useState, useEffect, useRef } from 'react';
import { LiveSessionManager } from '../services/liveService';
import { Mic, MicOff, Activity, X } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../constants/translations';

interface LiveAgentProps {
  language: Language;
}

export const LiveAgent: React.FC<LiveAgentProps> = ({ language }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<string>("disconnected");
  const managerRef = useRef<LiveSessionManager | null>(null);
  const t = translations[language].live;

  useEffect(() => {
    return () => {
      if (managerRef.current) {
        managerRef.current.disconnect();
      }
    };
  }, []);

  // Update manager's language if possible, but session is stateful. 
  // Re-connecting on language switch would be disruptive, so we just pass it on new connections.

  const toggleSession = async () => {
    if (status === "connected") {
      managerRef.current?.disconnect();
      managerRef.current = null;
    } else {
      managerRef.current = new LiveSessionManager(setStatus, language);
      await managerRef.current.connect();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
      {isOpen && (
        <div className="bg-white rounded-2xl shadow-2xl p-6 w-80 border border-blue-100 transition-all animate-in fade-in slide-in-from-bottom-10">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${status === 'connected' ? 'bg-green-500 animate-pulse' : 'bg-slate-300'}`}></span>
              <h3 className="font-bold text-slate-800">{t.title}</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600">
              <X size={18} />
            </button>
          </div>

          <div className="h-32 bg-slate-50 rounded-xl flex flex-col items-center justify-center border border-slate-100 mb-4">
            {status === 'connected' ? (
              <div className="flex items-center gap-1">
                <div className="w-1 h-4 bg-blue-500 animate-[bounce_1s_infinite] mx-0.5"></div>
                <div className="w-1 h-8 bg-blue-500 animate-[bounce_1.2s_infinite] mx-0.5"></div>
                <div className="w-1 h-6 bg-blue-500 animate-[bounce_0.8s_infinite] mx-0.5"></div>
                <div className="w-1 h-8 bg-blue-500 animate-[bounce_1.1s_infinite] mx-0.5"></div>
                <div className="w-1 h-4 bg-blue-500 animate-[bounce_0.9s_infinite] mx-0.5"></div>
              </div>
            ) : (
              <p className="text-sm text-slate-500">{t.ready}</p>
            )}
          </div>

          <button
            onClick={toggleSession}
            className={`w-full py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors ${
              status === 'connected' 
                ? 'bg-red-50 text-red-600 hover:bg-red-100' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {status === 'connected' ? <><MicOff size={18} /> {t.end}</> : <><Mic size={18} /> {t.start}</>}
          </button>
          <p className="text-xs text-slate-400 text-center mt-3">{t.powered}</p>
        </div>
      )}

      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full shadow-xl flex items-center justify-center text-white hover:scale-105 transition-transform"
        >
          <Activity size={24} />
        </button>
      )}
    </div>
  );
};
