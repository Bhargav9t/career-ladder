import { GoogleGenerativeAI } from "@google/generative-ai";
import { UserProfile, Opportunity, AIAnalysisResult } from "../types";

let genAI: any = null;

const getAI = () => {
  if (!genAI) {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY?.trim();
    
    if (!apiKey) {
      console.error("CRITICAL: VITE_GEMINI_API_KEY is not defined in .env.local");
      throw new Error("API Key missing");
    }

    genAI = new GoogleGenerativeAI(apiKey);
  }
  return genAI;
};

/** * SWITCHED TO GEMINI-PRO for universal endpoint compatibility.
 */
const MODEL_NAME = "gemini-pro";

const parseSafeJson = (text: string) => {
  try {
    // Pro sometimes wraps JSON in text; this regex extracts just the object
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const cleaned = jsonMatch ? jsonMatch[0] : text.replace(/```json|```/g, "").trim();
    return JSON.parse(cleaned);
  } catch (e) {
    console.error("AI JSON Parse Error:", e);
    return null;
  }
};

export const analyzeOpportunityFit = async (
  user: UserProfile, 
  opp: Opportunity
): Promise<AIAnalysisResult> => {
  try {
    const ai = getAI();
    // Gemini-pro handles JSON best when told to in the prompt rather than the config
    const model = ai.getGenerativeModel({ model: MODEL_NAME });

    const prompt = `
      Analyze this career opportunity for ${user.name}.
      Profile: ${JSON.stringify({ major: user.major, skills: user.skills })}
      Opportunity: ${JSON.stringify({ title: opp.title, desc: opp.description })}

      Return ONLY a JSON object with this exact structure:
      {
        "fitScore": number,
        "strengths": string[],
        "projectPivot": "1-sentence suggestion",
        "skillGaps": string[],
        "roadmap": string[]
      }
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const data = parseSafeJson(text);
    
    if (!data) throw new Error("Invalid AI response format");
    return data as AIAnalysisResult;
  } catch (error: any) {
    console.warn("Analysis Error:", error.message);
    return {
      fitScore: 70,
      strengths: ["Technical background", "Academic alignment"],
      projectPivot: "Leverage your technical projects to meet the core requirements of this role.",
      skillGaps: ["Industry Frameworks", "System Scaling"],
      roadmap: ["Review requirements", "Update portfolio", "Submit application"]
    };
  }
};

export const getAcademicAdvice = async (user: UserProfile, message: string): Promise<string> => {
  try {
    const ai = getAI();
    const model = ai.getGenerativeModel({ model: MODEL_NAME }); 
    
    const prompt = `
      Context: You are a technical career mentor for ${user.name}. 
      Background: ${user.major}, interested in ESP-32 hardware and React.
      Question: ${message}
      Response (technical, brief, and supportive):
    `;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error: any) {
    console.error("Mentor Error:", error.message);
    
    if (error.message.includes("404")) {
        return "CRITICAL ERROR: The API still cannot find the model. Verify your Google AI Studio project settings.";
    }

    if (error.message.includes("API key not valid")) {
      return "AUTHENTICATION ERROR: Check your API Key in .env.local.";
    }
    
    return `Advisor is offline. (${error.message})`;
  }
};

export const getWhyFitsSummary = async (
  user: UserProfile,
  opp: Opportunity
): Promise<string[]> => {
  try {
    const ai = getAI();
    const model = ai.getGenerativeModel({ model: MODEL_NAME });
    
    const prompt = `Provide 3 bullet points explaining why "${opp.title}" fits a ${user.major} student. Return as JSON: { "bullets": ["point1", "point2", "point3"] }`;

    const result = await model.generateContent(prompt);
    const data = parseSafeJson(result.response.text());
    return data?.bullets || ["Matches your profile", "Strategic fit", "Relevant skills"];
  } catch (error) {
    return ["Technical alignment", "Career growth potential", "Skill-matched opportunity"];
  }
};