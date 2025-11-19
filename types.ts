
export interface Task {
  id: string;
  description: string;
  // KAI Ratings (1-5)
  patternRecognition: number;
  humanInteraction: number;
  complexity: number;
  creativity: number;
  dataAccessibility: number;
  // Calculated Classification
  category: 'Automate' | 'Augment' | 'Human';
}

export interface JobProfile {
  title: string;
  tasks: Task[];
}

export interface AnalysisResult {
  percentages: {
    automate: number;
    augment: number;
    human: number;
  };
  timeline: Array<{
    period: string; // '0-6 mnd', '6-18 mnd', '18+ mnd'
    prediction: string;
    impactLevel: 'High' | 'Medium' | 'Low';
  }>;
  tools: string[];
  skillsToDevelop: string[];
  actionPlan: string;
}

export enum Step {
  Scope = 1,
  Assess = 2,
  Impact = 3,
  Dashboard = 4
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isThinking?: boolean;
}

export interface SavedProfile {
  id: string;
  jobTitle: string;
  date: string;
  tasks: Task[];
  hardSkills: string[];
  softSkills: string[];
  analysis: AnalysisResult;
}
