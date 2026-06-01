import { GoogleGenAI } from "@google/genai";
import OpenAI from "openai";

export interface AIProvider {
  generateItinerary(prompt: string): Promise<string>;
}

export class GeminiProvider implements AIProvider {
  private ai: GoogleGenAI;
  private apiKey: string;

  constructor(apiKey: string) {
    this.ai = new GoogleGenAI({ apiKey });
    this.apiKey = apiKey;
  }

  async generateItinerary(prompt: string): Promise<string> {
    const payload = {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
      }
    };

    let retries = 3;
    let lastError = null;

    while (retries > 0) {
      try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${this.apiKey}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        const data = await res.json();
        
        if (data.error) {
          if (data.error.code === 503 || data.error.message.includes("high demand")) {
            console.log("High demand, retrying...");
            retries--;
            lastError = data.error.message;
            await new Promise(r => setTimeout(r, 2000)); // wait 2s before retry
            continue;
          }
          throw new Error(data.error.message);
        }

        if (data.candidates && data.candidates.length > 0) {
          return data.candidates[0].content.parts[0].text;
        }

        return "{}";
      } catch (err: any) {
        if (err.message.includes("high demand")) {
          retries--;
          lastError = err.message;
          await new Promise(r => setTimeout(r, 2000));
          continue;
        }
        throw err;
      }
    }
    
    throw new Error(lastError || "Failed to generate itinerary after retries due to high demand.");
  }
}

export class OpenAIProvider implements AIProvider {
  private openai: OpenAI;

  constructor(apiKey: string) {
    this.openai = new OpenAI({ apiKey });
  }

  async generateItinerary(prompt: string): Promise<string> {
    const response = await this.openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are an expert travel planner. Output only valid JSON." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" }
    });

    return response.choices[0].message?.content || "{}";
  }
}

export function getAIProvider(): AIProvider {
  const provider = process.env.AI_PROVIDER || "gemini";
  
  if (provider === "openai") {
    if (!process.env.OPENAI_API_KEY) throw new Error("OPENAI_API_KEY is not set");
    return new OpenAIProvider(process.env.OPENAI_API_KEY);
  } else {
    // Default to Gemini
    if (!process.env.GOOGLE_GEMINI_API_KEY) throw new Error("GOOGLE_GEMINI_API_KEY is not set");
    return new GeminiProvider(process.env.GOOGLE_GEMINI_API_KEY);
  }
}
