import React from 'react';
import { AppView } from '../types';

interface Props {
  currentView: AppView;
  onViewChange: (view: AppView) => void;
  children: React.ReactNode;
}

export const Layout: React.FC<Props> = ({ currentView, onViewChange, children }) => {
  const navItems = [
    { id: AppView.DANCE_STUDIO, label: 'Dance Studio', icon: '🎵' },
    { id: AppView.IMAGE_STUDIO, label: 'Image Studio', icon: '🎨' },
    { id: AppView.ANALYSIS_LAB, label: 'Analysis Lab', icon: '🔬' },
    { id: AppView.ASSISTANT, label: 'Search Assistant', icon: '🤖' },
  ];

  return (
    <div className="flex h-screen w-full bg-[#0f172a] overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 glass-panel border-r border-slate-800 flex flex-col hidden md:flex">
        <div className="p-6">
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            GrooveGen
          </h1>
          <p className="text-xs text-slate-500 mt-1">Powered by Gemini</p>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                currentView === item.id 
                ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
             <span className="text-xs text-slate-500">System Online</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 relative flex flex-col h-full">
         {/* Mobile Header */}
         <div className="md:hidden h-16 glass-panel border-b border-slate-800 flex items-center justify-between px-4">
            <span className="font-bold text-lg text-white">GrooveGen</span>
            <div className="flex gap-2">
                {navItems.map(item => (
                    <button key={item.id} onClick={() => onViewChange(item.id)} className={`p-2 rounded-lg ${currentView === item.id ? 'bg-blue-600 text-white' : 'text-slate-400'}`}>
                        {item.icon}
                    </button>
                ))}
            </div>
         </div>
         
         <div className="flex-1 overflow-hidden relative">
           {children}
         </div>
      </main>
    </div>
  );
};
