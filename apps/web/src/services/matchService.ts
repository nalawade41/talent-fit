import { apiService } from './api/client';

export interface MatchSuggestion {
  profile: {
    user_id: number;
    user?: { first_name: string; last_name: string; email: string };
    skills?: string[];
    geo?: string;
    type?: string;
  };
  candidate_id?: number;
  score?: number;
  reason?: string;
}

export default class MatchService {
  static async getProjectSuggestions(projectId: number): Promise<MatchSuggestion[]> {
    const res = await apiService.get<any>(`/api/v1/project/${projectId}/suggestions`);
    const list = Array.isArray(res?.data) ? res.data : res;
    return list || [];
  }
}


