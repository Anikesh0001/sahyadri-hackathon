export type UserRole = 'User' | 'Developer' | 'Admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
}

export type BugStatus = 'Open' | 'Funded' | 'Claimed' | 'In Review' | 'Resolved';

export interface Bug {
  id: string;
  title: string;
  description: string;
  repoLink: string;
  logs?: string;
  tags: string[];
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  expectedBehavior: string;
  status: BugStatus;
  createdAt: string;
  bounty: number;
  fundsRaised: number;
  contributors: number;
  authorId: string;
  assignedDeveloperId?: string;
  aiScore?: number;
}

export interface Developer {
  id: string;
  name: string;
  skills: string[];
  successRate: number;
  bugsResolved: number;
  avatarUrl?: string;
}

export interface AIAnalysis {
  bugId: string;
  category: string;
  complexity: 'Low' | 'Medium' | 'High' | 'Extreme';
  estimatedBounty: number;
  confidenceScore: number;
  impactScore: {
    userImpact: number;
    severity: number;
    urgency: number;
    popularity: number;
  };
  nlpSummary: string;
  errorClusters: string[];
  logInsights: string[];
}

export interface FixVerification {
  bugId: string;
  developerId: string;
  prLink: string;
  similarityScore: number;
  passed: boolean;
  diffSummary: string;
}
