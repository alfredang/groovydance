import React, { useState, useRef } from 'react';
import { generateDanceVideo, fileToBase64, generateFastText } from '../services/geminiService';

export const DanceStudio: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [videoLink, setVideoLink] = useState('');
  const [dancePrompt, setDancePrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Suggested audio tracks to satisfy "add music" requirement
  const MUSIC_TRACKS = [
    { name: "Upbeat Funk", src: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/WFMU/Broke_For_Free/Directionless_EP/Broke_For_Free_-_01_-_Night_Owl.mp3" },
    { name: "Electronic Chill", src: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Tours/Enthusiast/Tours_-_01_-_Enthusiast.mp3" }
  ];
  const [selectedTrack, setSelectedTrack] = useState(MUSIC_TRACKS[0]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    }
  };

  const handleLinkAnalysis = async () => {
    if (!videoLink) return;
    setIsProcessing(true);
    // Simulate link analysis
    try {
        const suggestion = await generateFastText(`A user pasted this link: "${videoLink}". 
        Create a short, vivid prompt (max 15 words) describing a popular dance trend. 
        Just return the prompt description.`);
        setDancePrompt(suggestion.trim());
    } catch (e) {
        setDancePrompt("Doing a viral dance move with high energy");
    } finally {
        setIsProcessing(false);
    }
  };

  const handleGenerate = async () => {
    if (!imageFile || !dancePrompt) return;

    setIsProcessing(true);
    setResultUrl(null);

    try {
      const base64 = await fileToBase64(imageFile);
      // Generates an image preview of the dance (since we removed Veo for free tier)
      const uri = await generateDanceVideo(base64, imageFile.type, dancePrompt);
      setResultUrl(uri);
    } catch (error: any) {
      alert(`Error generating content: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (musicPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setMusicPlaying(!musicPlaying);
  };

  const isVideoResult = resultUrl && !resultUrl.startsWith('data:image');

  return (
    <div className="flex flex-col h-full overflow-y-auto custom-scrollbar p-6">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
          Dance Generator
        </h2>
        <p className="text-slate-400 mt-2">Transform a photo into a dance star</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto w-full">
        {/* Input Column */}
        <div className="space-y-6">
          
          {/* 1. Upload Image */}
          <div className="glass-panel p-6 rounded-2xl border-l-4 border-blue-500">
            <h3 className="text-lg font-semibold mb-4 text-blue-200">1. Upload Person</h3>
            <div className="relative group w-full h-64 border-2 border-dashed border-slate-600 rounded-xl flex items-center justify-center bg-slate-800/50 hover:bg-slate-800 transition-colors overflow-hidden">
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center p-4">
                  <svg className="w-12 h-12 mx-auto text-slate-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-slate-400">Click to upload photo</span>
                </div>
              )}
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageUpload} 
                className="absolute inset-0 opacity-0 cursor-pointer" 
              />
            </div>
          </div>

          {/* 2. Video Reference */}
          <div className="glass-panel p-6 rounded-2xl border-l-4 border-purple-500">
            <h3 className="text-lg font-semibold mb-4 text-purple-200">2. Dance Reference</h3>
            
            <div className="mb-4">
              <label className="block text-sm text-slate-400 mb-1">Video Link (TikTok / IG / YouTube)</label>
              <div className="flex gap-2">
                <input 
                  type="text"
                  value={videoLink}
                  onChange={(e) => setVideoLink(e.target.value)}
                  placeholder="https://tiktok.com/@user/video/..."
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button 
                  onClick={handleLinkAnalysis}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm text-white"
                >
                  Analyze Link
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-1">Describe the Dance Move</label>
              <textarea 
                value={dancePrompt}
                onChange={(e) => setDancePrompt(e.target.value)}
                placeholder="E.g., Performing a salsa spin, doing the moonwalk, robot dance..."
                className="w-full h-24 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* 3. Music */}
          <div className="glass-panel p-6 rounded-2xl border-l-4 border-pink-500">
             <h3 className="text-lg font-semibold mb-4 text-pink-200">3. Select Music</h3>
             <select 
               className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white"
               onChange={(e) => setSelectedTrack(MUSIC_TRACKS.find(t => t.name === e.target.value) || MUSIC_TRACKS[0])}
             >
               {MUSIC_TRACKS.map(t => <option key={t.name} value={t.name}>{t.name}</option>)}
             </select>
             <audio ref={audioRef} src={selectedTrack.src} loop className="hidden" />
          </div>

          <button
            onClick={handleGenerate}
            disabled={!imageFile || !dancePrompt || isProcessing}
            className={`w-full py-4 rounded-xl text-xl font-bold text-white shadow-lg transition-all transform hover:scale-[1.02] ${
              !imageFile || !dancePrompt || isProcessing 
              ? 'bg-slate-700 cursor-not-allowed text-slate-500' 
              : 'bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 shadow-purple-500/25'
            }`}
          >
            {isProcessing ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Magic...
              </span>
            ) : "Generate Dance Preview"}
          </button>
        </div>

        {/* Output Column */}
        <div className="flex flex-col">
          <div className="glass-panel flex-1 rounded-2xl p-2 min-h-[500px] flex items-center justify-center relative bg-black/40">
            {resultUrl ? (
              <div className="relative w-full h-full flex flex-col items-center justify-center">
                 {isVideoResult ? (
                    <video 
                      src={resultUrl} 
                      autoPlay 
                      loop 
                      playsInline 
                      className="max-h-[600px] w-full object-contain rounded-lg shadow-2xl"
                    />
                 ) : (
                    <img 
                      src={resultUrl} 
                      className="max-h-[600px] w-full object-contain rounded-lg shadow-2xl"
                      alt="Dance Preview"
                    />
                 )}
                 <button 
                   onClick={toggleMusic}
                   className="absolute bottom-8 px-6 py-2 bg-black/60 backdrop-blur-md rounded-full text-white flex items-center gap-2 hover:bg-black/80 transition"
                 >
                   {musicPlaying ? (
                     <>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      Pause Music
                     </>
                   ) : (
                     <>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      Play Music
                     </>
                   )}
                 </button>
              </div>
            ) : (
              <div className="text-center text-slate-500">
                <div className="w-20 h-20 bg-slate-800/50 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-10 h-10 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <p>Generated dance result will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
