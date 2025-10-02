import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Job } from "@/types";
import { ContactForm } from "@/types/contactUs";
import {
  JobApplicationStatus,
  JobApplicationType,
} from "@/types/jobApplication";
import JobPostService from "@/services/jobPostService";
import { toast } from "@/hooks/use-toast";
import { JobPostType } from "@/types/jobPost";
import DashboardService from "@/services/dashboardService";

interface AppContextType {
  jobs: JobPostType[];
  applications: JobApplicationType[];
  contacts: ContactForm[];
  fetchJobs: (
    page?: number,
    search?: string,
    limit?: number
  ) => Promise<{ total: number; items: JobPostType[] }>;
  addJob: (
    job: Omit<JobPostType, "id" | "date">
  ) => Promise<{ success: boolean; data?: JobPostType; message?: string }>;
  getJobById: (id: string) => Promise<JobPostType | null>;
  updateJob: (
    id: string,
    job: Partial<JobPostType>
  ) => Promise<{ success: boolean; data?: JobPostType; message?: string }>;
  deleteJob: (id: string) => void;
  updateApplicationStatus: (id: number, status: JobApplicationStatus) => void;
  deleteContact: (id: string) => void;
  markContactAsRead: (id: string) => void;
  dashboardData: {
    totalJobs: number;
    totalApplications: number;
    newApplications: number;
    totalContacts: number;
    recentApplications: JobApplicationType[];
    activeJobs: JobPostType[];
  } | null;
  fetchDashboardData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [jobs, setJobs] = useState<JobPostType[]>([]);
  const [applications, setApplications] = useState<JobApplicationType[]>([]);
  const [contacts, setContacts] = useState<ContactForm[]>([]);

  const [dashboardData, setDashboardData] = useState<{
    totalJobs: number;
    totalApplications: number;
    newApplications: number;
    totalContacts: number;
    recentApplications: JobApplicationType[];
    activeJobs: JobPostType[];
  } | null>(null);

  const fetchDashboardData = async () => {
    try {
      const res = await DashboardService.getDashboard(); // your new API
      if (res.success && res.data) {
        setDashboardData(res.data);
      } else {
        toast({
          title: "Error",
          description: res.message || "Failed to fetch dashboard data.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Error fetching dashboard data:", error);
      toast({
        title: "Error",
        description: "Something went wrong while fetching dashboard data.",
        variant: "destructive",
      });
    }
  };

  const fetchJobs = async (
    page: number = 1,
    search: string = "",
    limit: number = 10
  ): Promise<{ total: number; items: JobPostType[] }> => {
    try {
      const res = await JobPostService.getAll({ search, page, limit });
      if (res.success) {
        setJobs(res.data.items);
        return { total: res.data.total, items: res.data.items };
      } else {
        toast({
          title: "Error",
          description: res.message || "Failed to fetch jobs.",
          variant: "destructive",
        });
        return { total: 0, items: [] };
      }
    } catch (error: any) {
      console.error("Error fetching jobs:", error);
      toast({
        title: "Error",
        description: "Something went wrong while fetching job posts.",
        variant: "destructive",
      });
      return { total: 0, items: [] };
    }
  };

  const addJob = async (
    jobData: Omit<JobPostType, "id" | "date">
  ): Promise<{ success: boolean; message?: string; data?: JobPostType }> => {
    try {
      // Call backend API to create the job
      const res = await JobPostService.create(jobData);

      if (res.success) {
        // Update local state with the newly created job
        const newJob: JobPostType = {
          ...res.data, // Assuming API returns the created job with id & date
        };
        setJobs((prev) => [...prev, newJob]);

        toast({
          title: "Job Added",
          description: "The job post has been successfully added.",
        });
      } else {
        toast({
          title: "Error",
          description: res.message || "Failed to add job.",
          variant: "destructive",
        });
      }
      return res;
    } catch (error: any) {
      console.error("Error adding job:", error);
      toast({
        title: "Error",
        description:
          error?.message || "Something went wrong while adding the job post.",
        variant: "destructive",
      });
      return { success: false, message: error?.response?.data?.message }; // ✅ return failure
    }
  };

  const getJobById = async (id: string): Promise<JobPostType | null> => {
    try {
      const res = await JobPostService.getById(id);
      if (res.success) {
        return res.data;
      } else {
        toast({
          title: "Error",
          description: res.message || "Failed to fetch job details.",
          variant: "destructive",
        });
        return null;
      }
    } catch (error: any) {
      console.error("Error fetching job by ID:", error);
      toast({
        title: "Error",
        description: "Something went wrong while fetching job details.",
        variant: "destructive",
      });
      return null;
    }
  };

  const updateJob = async (
    id: string,
    jobData: Partial<JobPostType>
  ): Promise<{ success: boolean; message?: string; data?: JobPostType }> => {
    try {
      // Call backend API to update the job
      const res = await JobPostService.update(id, jobData);

      if (res.success) {
        // Update local state
        setJobs((prev) =>
          prev.map((job) => (job.id === id ? { ...job, ...res.data } : job))
        );

        toast({
          title: "Job Updated",
          description: "The job post has been successfully updated.",
        });
      } else {
        toast({
          title: "Error",
          description: res.message || "Failed to update job.",
          variant: "destructive",
        });
      }

      return res;
    } catch (error: any) {
      console.error("Error updating job:", error);
      toast({
        title: "Error",
        description:
          error?.response?.data?.message ||
          "Something went wrong while updating the job post.",
        variant: "destructive",
      });
      return { success: false, message: error?.response?.data?.message };
    }
  };

  const deleteJob = async (id: string) => {
    try {
      const res = await JobPostService.delete(id);

      if (res.success) {
        setJobs((prev) => prev.filter((job) => job.id !== id));
        toast({
          title: "Job Deleted",
          description: "The job post has been successfully deleted.",
        });
      } else {
        toast({
          title: "Error",
          description: res.message || "Failed to delete job.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Error deleting job:", error);
      toast({
        title: "Error",
        description: "Something went wrong while deleting the job post.",
        variant: "destructive",
      });
    }
  };

  const updateApplicationStatus = (
    id: number,
    status: JobApplicationStatus
  ) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status } : app))
    );
  };

  const deleteContact = (id: string) => {
    setContacts((prev) => prev.filter((contact) => contact.id !== id));
  };

  const markContactAsRead = (id: string) => {
    setContacts((prev) =>
      prev.map((contact) =>
        contact.id === id ? { ...contact, status: "Read" } : contact
      )
    );
  };

  return (
    <AppContext.Provider
      value={{
        jobs,
        applications,
        contacts,
        fetchJobs,
        addJob,
        getJobById,
        updateJob,
        deleteJob,
        updateApplicationStatus,
        deleteContact,
        markContactAsRead,
        dashboardData, // <-- new
        fetchDashboardData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
