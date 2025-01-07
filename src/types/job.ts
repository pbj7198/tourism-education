export interface JobPost {
  id: string;
  title: string;
  company: string;
  description: string;
  requirements: string;
  location: string;
  salary: string;
  contactEmail: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  status?: 'active' | 'closed';
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