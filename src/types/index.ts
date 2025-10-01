
export interface Job {
  id: string;
  date: string;
  title: string;
  category: string;
  jobType: 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
  experience: string;
  status: 'Active' | 'Inactive' | 'Draft';
  description: string;
  responsibilities: string;
  requirements: string;
  niceToHave: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}
