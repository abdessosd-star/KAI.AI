import React, { useState } from 'react';
import { Copy, Check, Code } from 'lucide-react';

export const EmbedGenerator: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const embedCode = `<iframe src="${window.location.origin}" width="100%" height="800" frameborder="0" title="KAI Career Assessment"></iframe>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-800 text-white p-6 rounded-2xl shadow-2xl w-80">
      <div className="flex items-center gap-2 mb-4 text-blue-400">
        <Code size={20} />
        <h3 className="font-bold">Embed This Tool</h3>
      </div>
      <p className="text-xs text-slate-400 mb-4">
        Copy this code to add the KAI Assessment tool to your own website or dashboard.
      </p>
      <div className="bg-slate-900 p-3 rounded-lg border border-slate-700 relative group">
        <code className="text-xs font-mono text-slate-300 break-all block pr-8">
          {embedCode}
        </code>
        <button
          onClick={handleCopy}
          className="absolute top-2 right-2 p-1.5 bg-slate-700 hover:bg-slate-600 rounded text-white transition-colors"
          title="Copy Code"
        >
          {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
        </button>
      </div>
    </div>
  );
};
