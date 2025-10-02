export interface JobPostData {
  items: JobPostType[];
  total: number;
}

export interface JobPostType {
  id?: string;
  title: string;
  slug?: string;
  category: string;
  jobType: string;
  experience: string;
  createdAt?: string;
  status?: string;
  date?: string;
  description?: string;
  keyResponsibilities?: string[];
  keyRequirements?: string[];
  niceToHave?: string[];
  jobDescription?: string;
  location?: string;
}

// export type JobPostStatus = "OPEN" | "CLOSED";

export interface GetAllJobPostsResponseType {
  success: boolean;
  message: string;
  data: JobPostData;
}
export interface UpdateJobPostsRequestType {
  id: number;
  status: JobPostStatus;
}
export interface UpdateJobPostsResponseType {
  success: boolean;
  message: string;
  data?: JobPostType;
}
