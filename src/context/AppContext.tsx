
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Job } from '@/types';
import { ContactForm } from '@/types/contactUs';
import { JobApplicationStatus, JobApplicationType } from '@/types/jobApplication';

interface AppContextType {
  jobs: Job[];
  applications: JobApplicationType[];
  contacts: ContactForm[];
  addJob: (job: Omit<Job, 'id' | 'date'>) => void;
  updateJob: (id: string, job: Partial<Job>) => void;
  deleteJob: (id: string) => void;
  updateApplicationStatus: (id: number, status: JobApplicationStatus) => void;
  deleteContact: (id: string) => void;
  markContactAsRead: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [jobs, setJobs] = useState<Job[]>([
    {
      id: '1',
      date: '2024-01-15',
      title: 'Senior React Developer',
      category: 'Technology',
      jobType: 'Full-time',
      experience: '3-5 years',
      status: 'Active',
      description: 'We are looking for a Senior React Developer...',
      responsibilities: 'Develop and maintain React applications...',
      requirements: 'Bachelor\'s degree in Computer Science...',
      niceToHave: 'Experience with TypeScript...'
    },
    {
      id: '2',
      date: '2024-01-10',
      title: 'UI/UX Designer',
      category: 'Design',
      jobType: 'Full-time',
      experience: '2-4 years',
      status: 'Active',
      description: 'We need a creative UI/UX Designer...',
      responsibilities: 'Design user interfaces and experiences...',
      requirements: 'Portfolio showcasing design work...',
      niceToHave: 'Experience with Figma and Adobe Creative Suite...'
    }
  ]);

  const [applications, setApplications] = useState<JobApplicationType[]>([]);

  const [contacts, setContacts] = useState<ContactForm[]>([]);

  const addJob = (jobData: Omit<Job, 'id' | 'date'>) => {
    const newJob: Job = {
      ...jobData,
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0]
    };
    setJobs(prev => [...prev, newJob]);
  };

  const updateJob = (id: string, jobData: Partial<Job>) => {
    setJobs(prev => prev.map(job => job.id === id ? { ...job, ...jobData } : job));
  };

  const deleteJob = (id: string) => {
    setJobs(prev => prev.filter(job => job.id !== id));
  };

  const updateApplicationStatus = (id: number, status: JobApplicationStatus) => {
    setApplications(prev => prev.map(app => app.id === id ? { ...app, status } : app));
  };

  const deleteContact = (id: string) => {
    setContacts(prev => prev.filter(contact => contact.id !== id));
  };

  const markContactAsRead = (id: string) => {
    setContacts(prev => prev.map(contact => contact.id === id ? { ...contact, status: 'Read' } : contact));
  };

  return (
    <AppContext.Provider value={{
      jobs,
      applications,
      contacts,
      addJob,
      updateJob,
      deleteJob,
      updateApplicationStatus,
      deleteContact,
      markContactAsRead
    }}>
      {children}
    </AppContext.Provider>
  );
};
