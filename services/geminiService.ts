
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { Task, AnalysisResult, Language } from "../types";

// Helper to get client with key
const getClient = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || (window.process && window.process.env && window.process.env.API_KEY);
  if (!apiKey) {
    console.error("API Key is missing");
    throw new Error("API Key is missing");
  }
  return new GoogleGenAI({ apiKey });
};

// 1. Suggest Role Details (Flash - Fast)
export const suggestRoleDetails = async (jobTitle: string, language: Language = 'en'): Promise<{ tasks: string[], hardSkills: string[], softSkills: string[] }> => {
  const ai = getClient();
  const langName = language === 'nl' ? 'Dutch' : 'English';
  
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: `Analyze the role of a "${jobTitle}". 
    List:
    1. 10 distinct, key professional tasks.
    2. 5 key hard skills (technical).
    3. 5 key soft skills (interpersonal).
    
    IMPORTANT: Output everything in ${langName}.
    Return as JSON object.`,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          tasks: { type: Type.ARRAY, items: { type: Type.STRING } },
          hardSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
          softSkills: { type: Type.ARRAY, items: { type: Type.STRING } }
        }
      }
    }
  });

  const text = response.text;
  if (!text) return { tasks: [], hardSkills: [], softSkills: [] };
  return JSON.parse(text);
};

// 2. Assess Tasks (Flash + Light Thinking - Balanced Speed/Smarts)
export const assessTasksWithAI = async (jobTitle: string, tasks: string[], language: Language = 'en'): Promise<Task[]> => {
  const ai = getClient();
  const langName = language === 'nl' ? 'Dutch' : 'English';

  const prompt = `
    As an expert AI workforce consultant (KAI Model), analyze these tasks for a "${jobTitle}".
    
    For each task, rate on a scale of 1-5:
    1. Pattern Recognition (High score = highly repetitive/predictable)
    2. Human Interaction (High score = requires deep empathy/negotiation)
    3. Complexity/Context (High score = requires high judgment/ambiguity)
    4. Creativity/Knowledge (High score = requires novel thought)
    5. Data Accessibility (High score = data is digital and structured)

    Then, classify the task into one of three categories based on the ratings:
    - "Automate" (High pattern, high data, low human/complexity)
    - "Augment" (High complexity/creativity, mixed human)
    - "Human" (High human interaction, high judgment, low pattern)
    
    IMPORTANT: Ensure the 'description' field is in ${langName}.

    Tasks: ${JSON.stringify(tasks)}
  `;

  // Switched to Flash with lower thinking budget for speed
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      // thinkingConfig: { thinkingBudget: 2048 }, // Reduced budget for faster response
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            description: { type: Type.STRING },
            patternRecognition: { type: Type.INTEGER },
            humanInteraction: { type: Type.INTEGER },
            complexity: { type: Type.INTEGER },
            creativity: { type: Type.INTEGER },
            dataAccessibility: { type: Type.INTEGER },
            category: { type: Type.STRING, enum: ['Automate', 'Augment', 'Human'] }
          }
        }
      }
    }
  });

  const text = response.text;
  if (!text) return [];
  
  const rawData = JSON.parse(text);
  return rawData.map((item: any, index: number) => ({
    id: `task-${index}`,
    ...item
  }));
};

// 3. Generate Career Analysis (Flash + Light Thinking - Fast)
export const generateCareerAnalysis = async (
  jobTitle: string, 
  assessedTasks: Task[],
  hardSkills: string[] = [],
  softSkills: string[] = [],
  language: Language = 'en'
): Promise<AnalysisResult> => {
  const ai = getClient();
  const langName = language === 'nl' ? 'Dutch' : 'English';
  
  const prompt = `
    Analyze the future impact of AI on the role of "${jobTitle}".
    
    Context:
    - Tasks & Impact Ratings: ${JSON.stringify(assessedTasks)}
    - Current Hard Skills: ${JSON.stringify(hardSkills)}
    - Current Soft Skills: ${JSON.stringify(softSkills)}

    Provide a comprehensive career strategy report in ${langName} including:
    1. Percentages for Automate, Augment, Human.
    2. A timeline (0-6 months, 6-18 months, 18+ months) of expected changes.
    3. Specific AI tools relevant to this role.
    4. Key NEW skills to develop to stay relevant (gap analysis).
    5. A concrete action plan for the next month.
  `;

  // Switched to Flash with lower thinking budget for speed
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      // thinkingConfig: { thinkingBudget: 2048 }, // Reduced budget for faster response
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          percentages: {
            type: Type.OBJECT,
            properties: {
              automate: { type: Type.NUMBER },
              augment: { type: Type.NUMBER },
              human: { type: Type.NUMBER }
            }
          },
          timeline: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                period: { type: Type.STRING },
                prediction: { type: Type.STRING },
                impactLevel: { type: Type.STRING, enum: ['High', 'Medium', 'Low'] }
              }
            }
          },
          tools: { type: Type.ARRAY, items: { type: Type.STRING } },
          skillsToDevelop: { type: Type.ARRAY, items: { type: Type.STRING } },
          actionPlan: { type: Type.STRING }
        }
      }
    }
  });

  const text = response.text;
  return JSON.parse(text || '{}');
};

// 4. TTS Service
export const speakText = async (text: string): Promise<ArrayBuffer | null> => {
  const ai = getClient();
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Puck' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      const binaryString = atob(base64Audio);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      return bytes.buffer;
    }
    return null;
  } catch (error) {
    console.error("TTS Error:", error);
    return null;
  }
};

// 5. Chat Bot (Pro)
export const sendChatMessage = async (history: {role: string, parts: {text: string}[]}[], message: string, language: Language = 'en') => {
  const ai = getClient();
  const langName = language === 'nl' ? 'Dutch' : 'English';
  const chat = ai.chats.create({
    model: 'gemini-3-pro-preview',
    history: history,
    config: {
      systemInstruction: `You are a helpful AI Career Coach using the KAI model methodology. Keep answers concise and encouraging. Respond in ${langName}.`
    }
  });
  
  const result = await chat.sendMessage({ message });
  return result.text;
};
