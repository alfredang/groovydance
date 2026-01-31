import React, { useState } from 'react';
import { generateHighQualityImage, editImage, fileToBase64 } from '../services/geminiService';

export const ImageStudio: React.FC = () => {
  const [mode, setMode] = useState<'generate' | 'edit'>('generate');
  const [prompt, setPrompt] = useState('');
  const [imageSize, setImageSize] = useState<'1K' | '2K' | '4K'>('1K');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const f = e.target.files[0];
      setUploadFile(f);
      setPreviewUrl(URL.createObjectURL(f));
    }
  };

  const execute = async () => {
    if (!prompt) return;
    setLoading(true);
    setResultImage(null);
    try {
      if (mode === 'generate') {
        const result = await generateHighQualityImage(prompt, imageSize);
        setResultImage(result);
      } else {
        if (!uploadFile) return;
        const b64 = await fileToBase64(uploadFile);
        const result = await editImage(b64, uploadFile.type, prompt);
        setResultImage(result);
      }
    } catch (e: any) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto custom-scrollbar p-6">
      <div className="mb-6 flex justify-center gap-4">
        <button 
          onClick={() => setMode('generate')}
          className={`px-6 py-2 rounded-full font-medium transition-colors ${mode === 'generate' ? 'bg-teal-500 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
        >
          Generate (Pro)
        </button>
        <button 
           onClick={() => setMode('edit')}
           className={`px-6 py-2 rounded-full font-medium transition-colors ${mode === 'edit' ? 'bg-amber-500 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
        >
          Edit (Nano Banana)
        </button>
      </div>

      <div className="max-w-4xl mx-auto w-full glass-panel p-8 rounded-2xl">
        <div className="space-y-6">
          
          {mode === 'edit' && (
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-600 rounded-xl h-48 bg-slate-800/30 relative overflow-hidden group">
              {previewUrl ? (
                <img src={previewUrl} className="h-full w-full object-contain" />
              ) : (
                <span className="text-slate-400">Upload Image to Edit</span>
              )}
              <input type="file" accept="image/*" onChange={handleUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
            </div>
          )}

          {mode === 'generate' && (
             <div className="flex gap-4 items-center">
                <span className="text-slate-300">Resolution:</span>
                {(['1K', '2K', '4K'] as const).map(s => (
                  <button
                    key={s}
                    onClick={() => setImageSize(s)}
                    className={`px-3 py-1 rounded border ${imageSize === s ? 'border-teal-500 text-teal-400 bg-teal-500/10' : 'border-slate-600 text-slate-500'}`}
                  >
                    {s}
                  </button>
                ))}
             </div>
          )}

          <div className="flex gap-2">
            <input 
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={mode === 'generate' ? "A futuristic city on Mars..." : "Add fireworks in the background..."}
              className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <button 
              onClick={execute}
              disabled={loading || (mode === 'edit' && !uploadFile)}
              className="px-6 py-3 bg-gradient-to-r from-teal-500 to-emerald-600 text-white rounded-lg font-bold disabled:opacity-50"
            >
              {loading ? 'Working...' : 'Go'}
            </button>
          </div>
        </div>

        {resultImage && (
          <div className="mt-8 border-t border-slate-700 pt-8 flex justify-center">
            <div className="relative">
              <img src={resultImage} alt="Result" className="max-h-[500px] rounded-lg shadow-2xl" />
              <a 
                href={resultImage} 
                download={`gemini-${mode}-${Date.now()}.png`}
                className="absolute top-2 right-2 bg-black/70 p-2 rounded-full text-white hover:bg-black/90"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
