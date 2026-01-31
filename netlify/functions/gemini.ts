import type { Handler, HandlerEvent } from "@netlify/functions";
import { GoogleGenAI } from "@google/genai";

const getAIClient = (): GoogleGenAI => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not set");
  }
  return new GoogleGenAI({ apiKey });
};

const handler: Handler = async (event: HandlerEvent) => {
  // Only allow POST requests
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  // CORS headers
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };

  try {
    const body = JSON.parse(event.body || "{}");
    const { action, payload } = body;

    const ai = getAIClient();

    switch (action) {
      case "generateDanceVideo": {
        const { imageBase64, imageMimeType, prompt } = payload;
        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash-image",
          contents: {
            parts: [
              {
                inlineData: {
                  data: imageBase64,
                  mimeType: imageMimeType,
                },
              },
              {
                text: `Generate a cinematic full-body shot of this person performing this dance move: ${prompt}. Keep the character consistent.`,
              },
            ],
          },
        });

        for (const part of response.candidates?.[0]?.content?.parts || []) {
          if (part.inlineData) {
            return {
              statusCode: 200,
              headers,
              body: JSON.stringify({
                result: `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`,
              }),
            };
          }
        }
        throw new Error("Video/Image generation failed.");
      }

      case "generateImage": {
        const { prompt } = payload;
        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash-image",
          contents: {
            parts: [{ text: prompt }],
          },
        });

        for (const part of response.candidates?.[0]?.content?.parts || []) {
          if (part.inlineData) {
            return {
              statusCode: 200,
              headers,
              body: JSON.stringify({
                result: `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`,
              }),
            };
          }
        }
        throw new Error("No image generated.");
      }

      case "editImage": {
        const { imageBase64, mimeType, prompt } = payload;
        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash-image",
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
            return {
              statusCode: 200,
              headers,
              body: JSON.stringify({
                result: `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`,
              }),
            };
          }
        }

        if (response.text) {
          throw new Error(`Model returned text instead of image: ${response.text}`);
        }
        throw new Error("Image editing failed.");
      }

      case "analyzeContent": {
        const { fileBase64, mimeType, prompt } = payload;
        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
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

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            result: response.text || "No analysis returned.",
          }),
        };
      }

      case "chatWithSearch": {
        const { history, newMessage } = payload;
        const chat = ai.chats.create({
          model: "gemini-3-flash-preview",
          history: history.map((h: { role: string; text: string }) => ({
            role: h.role,
            parts: [{ text: h.text }],
          })),
          config: {
            tools: [{ googleSearch: {} }],
          },
        });

        const response = await chat.sendMessage({ message: newMessage });
        const groundingChunks =
          response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
        const urls: string[] = [];

        groundingChunks.forEach((chunk: any) => {
          if (chunk.web?.uri) urls.push(chunk.web.uri);
        });

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            result: {
              text: response.text || "I couldn't generate a response.",
              groundingUrls: urls,
            },
          }),
        };
      }

      case "generateFastText": {
        const { prompt } = payload;
        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash-lite-latest",
          contents: prompt,
        });

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            result: response.text || "",
          }),
        };
      }

      default:
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: `Unknown action: ${action}` }),
        };
    }
  } catch (error: any) {
    console.error("Gemini API error:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message || "Internal server error" }),
    };
  }
};

export { handler };
