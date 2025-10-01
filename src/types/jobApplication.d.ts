export interface JobApplicationType {
    id: number;
    full_name: string;
    email: string;
    phone_number: string;
    applied_for: string;
    experience: string;
    current_salary: string;
    expected_salary: string;
    linkedin_url: string;
    resume_url: string | null;
    createdAt: string;
    updatedAt: string;
    status: JobApplicationStatus;
}

export type JobApplicationStatus = "NEW" | "REVIEWING" | "SHORTLISTED" | "REJECTED" | "HIRED";


export interface GetAllJobApplicationsResponseType {
    success: boolean;
    message: string;
    data: JobApplicationType[];
}
export interface UpdateJobApplicationsRequestType {
    id: number;
    status: JobApplicationStatus
}
export interface UpdateJobApplicationsResponseType {
    success: boolean;
    message: string;
    data: JobApplicationType;
}
