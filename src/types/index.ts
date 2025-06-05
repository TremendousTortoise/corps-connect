
export interface User {
  id: string;
  name: string;
  organizations: string[];
  bio?: string;
}

export interface Visit {
  id: string;
  userId: string;
  userName: string;
  startDate: Date;
  endDate?: Date;
  status: 'current' | 'planned';
  notes?: string;
}

export interface ActivitySuggestion {
  id: string;
  userId: string;
  userName: string;
  visitId: string;
  title: string;
  description: string;
  suggestedDate?: Date;
  createdAt: Date;
}
