export enum AppView {
  DANCE_STUDIO = 'dance_studio',
  IMAGE_STUDIO = 'image_studio',
  ANALYSIS_LAB = 'analysis_lab',
  ASSISTANT = 'assistant',
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isLoading?: boolean;
  groundingUrls?: string[];
  timestamp: number;
}

export interface GeneratedMedia {
  url: string;
  type: 'image' | 'video';
  prompt: string;
  timestamp: number;
}

export interface AnalysisResult {
  text: string;
  timestamp: number;
}
