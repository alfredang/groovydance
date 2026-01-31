import { GoogleGenAI, Type, SchemaType } from "@google/genai";

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
// Simplified for free tier testing
export const checkApiKey = async (): Promise<boolean> => true;
export const promptApiKey = async (): Promise<void> => {};

const getAIClient = (): GoogleGenAI => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

// --- Features ---

// 1. Dance Generator (Downgraded to Image Generation for Free Tier Testing)
// Veo is not available on free tier, so we generate a keyframe of the dance instead.
export const generateDanceVideo = async (
  imageBase64: string,
  imageMimeType: string,
  prompt: string
): Promise<string> => {
  const ai = getAIClient();
  
  // Using gemini-2.5-flash-image to simulate the dance result as a static image
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          inlineData: {
            data: imageBase64,
            mimeType: imageMimeType,
          },
        },
        { text: `Generate a cinematic full-body shot of this person performing this dance move: ${prompt}. Keep the character consistent.` },
      ],
    },
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
  }
  throw new Error("Video/Image generation failed.");
};

// 2. Image Generation (Downgraded to Gemini 2.5 Flash Image)
export const generateHighQualityImage = async (
  prompt: string,
  size: '1K' | '2K' | '4K' = '1K'
): Promise<string> => {
  const ai = getAIClient();
  
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [{ text: prompt }]
    }
    // Note: aspect ratio/size config is limited in Flash Image compared to Pro
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
  }
  throw new Error("No image generated.");
};

// 3. Image Editing (Gemini 2.5 Flash Image)
export const editImage = async (
  imageBase64: string,
  mimeType: string,
  prompt: string
): Promise<string> => {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          inlineData: {
            data: imageBase64,
            mimeType: mimeType,
          },
        },
        { text: prompt },
      ],
    },
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
          return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
  }
  
  if (response.text) {
      throw new Error(`Model returned text instead of image: ${response.text}`);
  }
  
  throw new Error("Image editing failed.");
};

// 4. Analysis (Downgraded to Gemini 3 Flash for Free Tier)
export const analyzeContent = async (
  fileBase64: string,
  mimeType: string,
  prompt: string,
  isVideo: boolean = false
): Promise<string> => {
  const ai = getAIClient();
  const model = 'gemini-3-flash-preview'; 

  const response = await ai.models.generateContent({
    model,
    contents: {
      parts: [
        {
          inlineData: {
            data: fileBase64,
            mimeType: mimeType,
          },
        },
        { text: prompt },
      ],
    },
  });

  return response.text || "No analysis returned.";
};

// 5. Assistant with Search Grounding (Uses Flash, generally compatible)
export const chatWithSearch = async (
  history: { role: 'user' | 'model'; text: string }[],
  newMessage: string
): Promise<{ text: string; groundingUrls: string[] }> => {
  const ai = getAIClient();
  const model = 'gemini-3-flash-preview'; 

  const chat = ai.chats.create({
    model,
    history: history.map(h => ({ role: h.role, parts: [{ text: h.text }] })),
    config: {
      tools: [{ googleSearch: {} }],
    },
  });

  const response = await chat.sendMessage({ message: newMessage });
  
  const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
  const urls: string[] = [];

  groundingChunks.forEach((chunk: any) => {
    if (chunk.web?.uri) urls.push(chunk.web.uri);
  });

  return {
    text: response.text || "I couldn't generate a response.",
    groundingUrls: urls
  };
};

// 6. Fast Text Gen (Flash Lite)
export const generateFastText = async (prompt: string): Promise<string> => {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-lite-latest',
        contents: prompt
    });
    return response.text || "";
}
