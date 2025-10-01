
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useApp } from '@/context/AppContext';
import { Job } from '@/types';
import { toast } from '@/hooks/use-toast';

interface JobFormProps {
  job?: Job | null;
  onClose: () => void;
}

const JobForm: React.FC<JobFormProps> = ({ job, onClose }) => {
  const { addJob, updateJob } = useApp();
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    experience: '',
    jobType: 'Full-time' as Job['jobType'],
    description: '',
    responsibilities: '',
    requirements: '',
    niceToHave: '',
    status: 'Active' as Job['status'],
  });

  useEffect(() => {
    if (job) {
      setFormData({
        title: job.title,
        category: job.category,
        experience: job.experience,
        jobType: job.jobType,
        description: job.description,
        responsibilities: job.responsibilities,
        requirements: job.requirements,
        niceToHave: job.niceToHave,
        status: job.status,
      });
    }
  }, [job]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (job) {
      updateJob(job.id, formData);
      toast({
        title: "Job Updated",
        description: "The job post has been successfully updated.",
      });
    } else {
      addJob(formData);
      toast({
        title: "Job Added",
        description: "New job post has been successfully created.",
      });
    }
    
    onClose();
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{job ? 'Edit Job Post' : 'Add New Job Post'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Job Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="experience">Experience *</Label>
              <Select value={formData.experience} onValueChange={(value) => handleChange('experience', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select experience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0-1 years">0-1 years</SelectItem>
                  <SelectItem value="1-2 years">1-2 years</SelectItem>
                  <SelectItem value="2-3 years">2-3 years</SelectItem>
                  <SelectItem value="3-5 years">3-5 years</SelectItem>
                  <SelectItem value="5-7 years">5-7 years</SelectItem>
                  <SelectItem value="7+ years">7+ years</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="jobType">Job Type *</Label>
              <Select value={formData.jobType} onValueChange={(value: Job['jobType']) => handleChange('jobType', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Full-time">Full-time</SelectItem>
                  <SelectItem value="Part-time">Part-time</SelectItem>
                  <SelectItem value="Contract">Contract</SelectItem>
                  <SelectItem value="Internship">Internship</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select value={formData.status} onValueChange={(value: Job['status']) => handleChange('status', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                  <SelectItem value="Draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Job Description *</Label>
            <Textarea
              id="description"
              rows={4}
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="responsibilities">Key Responsibilities *</Label>
            <Textarea
              id="responsibilities"
              rows={4}
              value={formData.responsibilities}
              onChange={(e) => handleChange('responsibilities', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="requirements">Key Requirements *</Label>
            <Textarea
              id="requirements"
              rows={4}
              value={formData.requirements}
              onChange={(e) => handleChange('requirements', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="niceToHave">Nice to Have</Label>
            <Textarea
              id="niceToHave"
              rows={3}
              value={formData.niceToHave}
              onChange={(e) => handleChange('niceToHave', e.target.value)}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              {job ? 'Update Job' : 'Create Job'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default JobForm;
