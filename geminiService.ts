
import { GoogleGenAI, Type } from "@google/genai";
import { Item, Category } from "../types";

// Initialize the API client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// System instruction to set the persona
const SYSTEM_INSTRUCTION = `You are an intelligent assistant for "Campus P2P Renting", a dedicated peer-to-peer marketplace for NIT Raipur students. 
Your goal is to help students rent items efficiently, write better descriptions, and ensure fair pricing in Indian Rupee (INR).
You are friendly, concise, and safety-conscious.`;

export const suggestDescription = async (title: string, category: string, condition: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Write a short, appealing description (max 50 words) for a rental item.
      Item: ${title}
      Category: ${category}
      Condition: ${condition}
      Target Audience: Students at NIT Raipur, India.`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      }
    });
    return response.text || "Could not generate description.";
  } catch (error) {
    console.error("Error generating description:", error);
    return "Great item for students!";
  }
};

export const suggestPrice = async (title: string, originalPrice: number): Promise<{ price: number; reasoning: string }> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Suggest a daily rental price in INR (₹) for: ${title} which costs ₹${originalPrice} new (MRP).
      The context is the NIT Raipur campus (peer-to-peer). Price should be affordable for students but fair for the lender.
      Return JSON only.`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            price: { type: Type.NUMBER, description: "Suggested daily rental price in INR" },
            reasoning: { type: Type.STRING, description: "Short explanation for the price" }
          },
          required: ["price", "reasoning"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response");
    return JSON.parse(text);
  } catch (error) {
    console.error("Error suggesting price:", error);
    return { price: Math.ceil(originalPrice * 0.05), reasoning: "Standard 5% of value estimation." };
  }
};

export const smartSearch = async (query: string, items: Item[]): Promise<string[]> => {
  try {
    // Create a simplified list for the model to process to save tokens
    const itemList = items.map(i => ({ id: i.id, title: i.title, desc: i.description, cat: i.category }));
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `User Query: "${query}"
      Available Items: ${JSON.stringify(itemList)}
      
      Return a JSON object containing an array of item IDs that match the user's intent. 
      Even if the words don't match exactly (e.g., "fix bike" -> "cycle pump"), make the connection.`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            matchIds: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING } 
            }
          }
        }
      }
    });

    const text = response.text;
    if (!text) return [];
    const result = JSON.parse(text);
    return result.matchIds || [];
  } catch (error) {
    console.error("Smart search failed:", error);
    return [];
  }
};

export const analyzeSafety = async (item: Item): Promise<string[]> => {
   try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Give 3 short safety tips for renting out or borrowing a "${item.title}" (${item.category}) in an Indian college campus context like NIT Raipur.
      Include a tip about the refundable security deposit.`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                tips: { type: Type.ARRAY, items: { type: Type.STRING }}
            }
        }
      }
    });
    const text = response.text;
    if (!text) return ["Inspect item before handover.", "Meet in a public pickup zone.", "Verify student ID."];
    return JSON.parse(text).tips;
  } catch (error) {
    return ["Inspect item before handover.", "Meet in a public pickup zone.", "Verify student ID."];
  }
}
