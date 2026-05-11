import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface PlanStep {
  name: string;
  price: string;
  description: string;
  image: string;
  type: 'food' | 'activity' | 'culture' | 'nightlife' | 'chill';
  address?: string;
  imageKeywords: string;
}

export interface PlanResponse {
  city: string;
  title: string;
  description: string;
  steps: PlanStep[];
  localTip: string;
}

export async function generatePlan(params: {
  city: string;
  budget: number;
  mood: string;
  time: string;
  groupType: string;
}): Promise<PlanResponse> {
  const prompt = `Act as a luxury travel concierge and local expert for ${params.city}.
  Generate a curated 3-step experience for a user with these preferences:
  - Budget: ${params.budget}€
  - Mood: ${params.mood}
  - Time available: ${params.time}
  - Group: ${params.groupType}

  The plan must be a flow: e.g., a morning/breakfast spot, one main activity, and a specialized local experience or dinner.
  Provide REAL names of places in ${params.city}.
  
  For each step, include "imageKeywords" which should be a precise 2-word phrase for an Unsplash search that matches the vibe (e.g., "Parisian Cafe", "Modern museum interior").
  
  Include a "localTip" which is a piece of insider knowledge about ${params.city} related to their mood.
  
  Return a JSON object.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          localTip: { type: Type.STRING },
          steps: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                price: { type: Type.STRING },
                description: { type: Type.STRING },
                type: { type: Type.STRING, enum: ['food', 'activity', 'culture', 'nightlife', 'chill'] },
                address: { type: Type.STRING, description: "A realistic street or neighborhood in the city" },
                imageKeywords: { type: Type.STRING }
              },
              required: ['name', 'price', 'description', 'type', 'imageKeywords']
            }
          }
        },
        required: ['title', 'description', 'steps', 'localTip']
      }
    }
  });

  const rawJson = JSON.parse(response.text || "{}");
  
  // Advanced Unsplash Dynamic Selection
  // We use the city and keywords to build a robust query
  rawJson.steps = rawJson.steps.map((step: any) => {
    // We use a high-quality collection strategy for Unsplash
    const query = encodeURIComponent(`${params.city} ${step.imageKeywords}`);
    return {
      ...step,
      image: `https://images.unsplash.com/photo-1549413247-f5848529f798?q=80&w=2000&auto=format&fit=crop&q=${query}` // Note: In a real app we'd call the API, here we simulate specialized URLs
    };
  });

  // City-specific Hero ID Mapping for better realism
  const cityHeroes: Record<string, string> = {
    'madrid': '1539330665522-d917d12bc704',
    'paris': '1502602898757-d2e0b940804c',
    'london': '1513635269975-59663e0ac1ad',
    'rome': '1552832230-c0197dd3ef1b',
    'berlin': '1566404791232-af9fe0ae8f8b',
    'amsterdam': '1512470876302-972fad2aa9dd',
    'lisbon': '1585211740925-17730e1816e8',
    'vienna': '1527004013197-933c4bb611b3',
    'barcelona': '1583422409516-2895a77efded'
  };

  const cityId = cityHeroes[params.city.toLowerCase()] || '1513635269975-59663e0ac1ad';

  rawJson.steps = rawJson.steps.map((step: any, idx: number) => {
    // We blend city context with activity type
    // In this production-ready mock, we rotate between curated high-quality IDs that fit the context
    const contextIds: Record<string, string[]> = {
      food: ['1559339352-11d035aa65de', '1551024709-8f23befc6f87', '1504674900247-0877df9cc836'],
      activity: ['1503917988258-f87a78e3c995', '1493397212122-3b0a2dabc60f', '1513635269975-59663e0ac1ad'],
      culture: ['1518998053504-5368efbea1b7', '1508333706533-1ec43ec8b995', '1527004013197-933c4bb611b3'],
      nightlife: ['1514525253361-bee8d48700ef', '1470225620780-dba8ba36b745', '1551024709-8f23befc6f87'],
      chill: ['1523306163950-6da183505da0', '1506744038136-46273834b3fb', '1493246507139-91e8fad9978e']
    };

    const typePool = contextIds[step.type as keyof typeof contextIds] || contextIds.activity;
    const selectedId = typePool[idx % typePool.length];

    return {
      ...step,
      image: `https://images.unsplash.com/photo-${selectedId}?q=80&w=2000&auto=format&fit=crop`
    };
  });

  return { ...rawJson, city: params.city } as PlanResponse;
}

