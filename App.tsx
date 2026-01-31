import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { DanceStudio } from './components/DanceStudio';
import { ImageStudio } from './components/ImageStudio';
import { AnalysisLab } from './components/AnalysisLab';
import { Assistant } from './components/Assistant';
import { ApiKeyGuard } from './components/ApiKeyGuard';
import { AppView } from './types';

function App() {
  const [currentView, setCurrentView] = useState<AppView>(AppView.DANCE_STUDIO);

  return (
    <ApiKeyGuard>
      <Layout currentView={currentView} onViewChange={setCurrentView}>
        {currentView === AppView.DANCE_STUDIO && <DanceStudio />}
        {currentView === AppView.IMAGE_STUDIO && <ImageStudio />}
        {currentView === AppView.ANALYSIS_LAB && <AnalysisLab />}
        {currentView === AppView.ASSISTANT && <Assistant />}
      </Layout>
    </ApiKeyGuard>
  );
}

export default App;
