// --- Utility: File to Base64 ---
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Remove data URL prefix (e.g., "data:image/png;base64,")
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// --- API Key Management ---
export const checkApiKey = async (): Promise<boolean> => true;
export const promptApiKey = async (): Promise<void> => {};

// --- API Helper ---
const callGeminiAPI = async (action: string, payload: any): Promise<any> => {
  const response = await fetch('/api/gemini', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ action, payload }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'API request failed');
  }

  const data = await response.json();
  return data.result;
};

// --- Features ---

// 1. Dance Generator (Downgraded to Image Generation for Free Tier Testing)
export const generateDanceVideo = async (
  imageBase64: string,
  imageMimeType: string,
  prompt: string
): Promise<string> => {
  return callGeminiAPI('generateDanceVideo', {
    imageBase64,
    imageMimeType,
    prompt,
  });
};

// 2. Image Generation
export const generateHighQualityImage = async (
  prompt: string,
  size: '1K' | '2K' | '4K' = '1K'
): Promise<string> => {
  return callGeminiAPI('generateImage', { prompt, size });
};

// 3. Image Editing
export const editImage = async (
  imageBase64: string,
  mimeType: string,
  prompt: string
): Promise<string> => {
  return callGeminiAPI('editImage', { imageBase64, mimeType, prompt });
};

// 4. Analysis
export const analyzeContent = async (
  fileBase64: string,
  mimeType: string,
  prompt: string,
  isVideo: boolean = false
): Promise<string> => {
  return callGeminiAPI('analyzeContent', { fileBase64, mimeType, prompt, isVideo });
};

// 5. Assistant with Search Grounding
export const chatWithSearch = async (
  history: { role: 'user' | 'model'; text: string }[],
  newMessage: string
): Promise<{ text: string; groundingUrls: string[] }> => {
  return callGeminiAPI('chatWithSearch', { history, newMessage });
};

// 6. Fast Text Gen
export const generateFastText = async (prompt: string): Promise<string> => {
  return callGeminiAPI('generateFastText', { prompt });
};
