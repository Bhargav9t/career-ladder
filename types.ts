export enum EducationLevel {
  HIGH_SCHOOL = 'HIGH_SCHOOL',
  UNDERGRADUATE = 'UNDERGRADUATE',
  GRADUATE = 'GRADUATE',
  PROFESSIONAL = 'PROFESSIONAL'
}

export enum OpportunityType {
  SCHOLARSHIP = 'SCHOLARSHIP',
  INTERNSHIP = 'INTERNSHIP',
  RESEARCH = 'RESEARCH',
  FELLOWSHIP = 'FELLOWSHIP',
  COMPETITION = 'COMPETITION',
  HACKATHON = 'HACKATHON'
}

export enum ApplicationStatus {
  SAVED = 'SAVED',
  IN_PROGRESS = 'IN_PROGRESS',
  SUBMITTED = 'SUBMITTED',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED'
}

export interface UserProfile {
  name: string;
  email: string;
  educationLevel: EducationLevel;
  major?: string;
  gpa?: string;
  interests: string[];
  skills: string[];
}

export interface Opportunity {
  id: string;
  title: string;
  organization: string;
  description: string;
  deadline: string;
  type: OpportunityType;
  // This supports the mapping logic we wrote in App.tsx
  educationLevel?: string; 
  level: EducationLevel[];
  amount?: string;
  location: string;
  requirements: string[];
  eligibility: string;
}

export interface Application {
  id: string;
  opportunityId: string;
  userId: string;
  status: ApplicationStatus;
  notes: string;
  updatedAt: string;
}

export interface AIAnalysisResult {
  fitScore: number;
  strengths: string[]; // This replaces the old 'recommendations' or 'analysis'
  projectPivot: string; // The "Reasoning" field
  skillGaps: string[];  // The "Gap" field
  roadmap: string[];    // The "Ladder" steps
}