export interface JobPost {
  id: number;
  title: string;
  content: string;
  author: {
    id: string;
    name: string;
  };
  date: string;
  isNotice: boolean;
  views: number;
  deadline?: string;
  school?: string;
  location?: string;
  position?: string;
  requirements?: string;
  status: 'active' | 'closed';
}

export interface JobPostFormData {
  title: string;
  content: string;
  isNotice: boolean;
  deadline?: string;
  school?: string;
  location?: string;
  position?: string;
  requirements?: string;
} 