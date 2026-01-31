import React, { useState } from 'react';
import { analyzeContent, fileToBase64 } from '../services/geminiService';

export const AnalysisLab: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const f = e.target.files[0];
      setFile(f);
      setPreview(URL.createObjectURL(f));
      setResult('');
    }
  };

  const handleAnalyze = async () => {
    if (!file || !prompt) return;
    setLoading(true);
    try {
      const b64 = await fileToBase64(file);
      const isVideo = file.type.startsWith('video');
      const text = await analyzeContent(b64, file.type, prompt, isVideo);
      setResult(text);
    } catch (error: any) {
      setResult(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto custom-scrollbar p-6">
      <h2 className="text-2xl font-bold mb-6 text-indigo-400">Analysis Lab (Gemini 3 Pro)</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
        <div className="flex flex-col gap-4">
          <div className="glass-panel p-6 rounded-2xl flex-1 flex flex-col">
            <div className="relative border-2 border-dashed border-indigo-500/30 rounded-xl flex-1 bg-slate-800/40 flex items-center justify-center overflow-hidden min-h-[300px]">
              {preview ? (
                 file?.type.startsWith('video') ? (
                    <video src={preview} controls className="max-h-full max-w-full" />
                 ) : (
                    <img src={preview} alt="Analysis Target" className="max-h-full max-w-full object-contain" />
                 )
              ) : (
                <div className="text-center p-6">
                   <p className="text-indigo-300 font-medium">Drop Image or Video here</p>
                </div>
              )}
              <input type="file" accept="image/*,video/*" onChange={handleUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
            </div>
            
            <div className="mt-4">
              <label className="text-sm text-slate-400">What do you want to know?</label>
              <div className="flex gap-2 mt-2">
                <input 
                  type="text" 
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe the scene, identify objects, summarize video..."
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white"
                />
                <button 
                  onClick={handleAnalyze}
                  disabled={loading || !file}
                  className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg disabled:opacity-50"
                >
                  {loading ? 'Scanning...' : 'Analyze'}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl overflow-y-auto custom-scrollbar bg-slate-900/50">
           <h3 className="text-lg font-semibold text-slate-300 mb-4">Gemini Findings</h3>
           {result ? (
             <div className="prose prose-invert max-w-none">
               <p className="whitespace-pre-wrap leading-relaxed text-slate-200">{result}</p>
             </div>
           ) : (
             <p className="text-slate-500 italic">Analysis results will appear here...</p>
           )}
        </div>
      </div>
    </div>
  );
};
