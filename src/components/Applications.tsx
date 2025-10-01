
import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import JobApplicationService from '@/services/jobApplicationService';
import { JobApplicationStatus, JobApplicationType } from '@/types/jobApplication';
import { SpinLoader } from './ui/spin-loader';
import { formatDate } from '@/lib/utils';

const Applications: React.FC = () => {
  // const { applications, updateApplicationStatus } = useApp();
  const [applications, setApplications] = useState<JobApplicationType[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [loading, setLoading] = useState<boolean>(false);

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.applied_for.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || app.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (id: number, status: JobApplicationStatus) => {
    JobApplicationService.update({ id: id, status: status })
      .then((response) => {
        console.log("response= ", response);
        toast({
          title: "Status Updated",
          description: "Application status has been updated successfully.",
        });
        // 🔁 Update the local state with new status
        setApplications((prev) =>
          prev.map((app) =>
            app.id === id ? { ...app, status } : app
          )
        );
      })
      .catch((err) => {
        console.log("err= ", err);
      })
  };

  const handleViewCV = (cvUrl: string) => {
    window.open(cvUrl, '_blank');
  };

  const fetchJobApplications = () => {
    setLoading(true);
    JobApplicationService.getAll()
      .then((response) => {
        console.log("response = ", response);
        setApplications(response.data);
      })
      .catch((err) => {
        console.log("err = ", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  useEffect(() => {
    fetchJobApplications()
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Job Applications</h1>
        <p className="text-gray-600">Manage candidate applications</p>
      </div>

      {loading ? (
        <SpinLoader />
      ) : (<Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>All Applications ({filteredApplications.length})</CardTitle>
            <div className="flex space-x-4">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All</SelectItem>
                  <SelectItem value="NEW">New</SelectItem>
                  <SelectItem value="REVIEWING">Reviewing</SelectItem>
                  <SelectItem value="SHORTLISTED">Shortlisted</SelectItem>
                  <SelectItem value="REJECTED">Rejected</SelectItem>
                  <SelectItem value="HIRED">Hired</SelectItem>
                </SelectContent>
              </Select>
              <Input
                placeholder="Search applications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Applicant Name</TableHead>
                  <TableHead>Job Title</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Experience</TableHead>
                  <TableHead>Current Salary</TableHead>
                  <TableHead>Expected Salary</TableHead>
                  <TableHead>CV</TableHead>
                  <TableHead>LinkedIn</TableHead>
                  <TableHead>Posted Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredApplications.length > 0 ? (
                  filteredApplications.map((application) => (
                    <TableRow key={application.id}>
                      <TableCell className="font-medium">{application.full_name}</TableCell>
                      <TableCell>{application.applied_for}</TableCell>
                      <TableCell>{application.email}</TableCell>
                      <TableCell>{application.phone_number}</TableCell>
                      <TableCell>{application.experience}</TableCell>
                      <TableCell>₹ {application.current_salary}</TableCell>
                      <TableCell>₹ {application.expected_salary}</TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewCV(application.resume_url)}
                        >
                          View CV
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(application.linkedin_url, '_blank')}
                        >
                          LinkedIn
                        </Button>
                      </TableCell>
                      <TableCell>{formatDate(application.createdAt)}</TableCell>
                      <TableCell>
                        <Select
                          value={application.status}
                          onValueChange={(value: JobApplicationStatus) =>
                            handleStatusChange(application.id, value)
                          }
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="NEW">New</SelectItem>
                            <SelectItem value="REVIEWING">Reviewing</SelectItem>
                            <SelectItem value="SHORTLISTED">Shortlisted</SelectItem>
                            <SelectItem value="REJECTED">Rejected</SelectItem>
                            <SelectItem value="HIRED">Hired</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))) : (
                  <TableRow>
                    <TableCell colSpan={11} className="text-center text-gray-500 py-6">
                      No applications found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>)}
    </div>
  );
};

export default Applications;
