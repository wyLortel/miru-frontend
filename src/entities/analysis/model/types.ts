export type AnalysisStatus = 'COMPLETED' | 'IN_PROGRESS' | null;

export interface AnalysisItem {
  id: number;
  content: string;
  answerContext: string | null;
  status: AnalysisStatus;
}

export interface AnalysisListResponse {
  totalCount: number;
  items: AnalysisItem[];
}
