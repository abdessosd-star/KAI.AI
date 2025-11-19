
import { SavedProfile, AnalysisResult, Task } from "../types";

const STORAGE_KEY = 'kai_career_profiles';

const generateId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

export const saveProfile = (
  jobTitle: string, 
  tasks: Task[], 
  hardSkills: string[],
  softSkills: string[],
  analysis: AnalysisResult
): SavedProfile => {
  const profiles = getProfiles();
  const newProfile: SavedProfile = {
    id: generateId(),
    jobTitle,
    date: new Date().toISOString(),
    tasks,
    hardSkills,
    softSkills,
    analysis
  };
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify([newProfile, ...profiles]));
  return newProfile;
};

export const getProfiles = (): SavedProfile[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error("Failed to load profiles", e);
    return [];
  }
};

export const deleteProfile = (id: string): void => {
  const profiles = getProfiles().filter(p => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
};
