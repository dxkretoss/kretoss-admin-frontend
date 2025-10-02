import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useApp } from "@/context/AppContext";
import { toast } from "@/hooks/use-toast";
import { JobPostType } from "@/types/jobPost";
import { SpinLoader } from "./ui/spin-loader";

const JobPosts: React.FC = () => {
  const navigate = useNavigate();
  const { fetchJobs, deleteJob } = useApp();

  const [jobs, setJobs] = useState<JobPostType[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalJobs, setTotalJobs] = useState(0);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<JobPostType | null>(null);

  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const loadJobs = async (page = 1, search = "") => {
    setLoading(true);
    const data = await fetchJobs(page, search, itemsPerPage);
    if (data) {
      setJobs(data.items);
      setTotalPages(Math.ceil(data.total / itemsPerPage));
      setCurrentPage(page);
      setTotalJobs(data.total);
    }
    setLoading(false);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      if (value.length >= 2 || value.length === 0) {
        loadJobs(1, value);
      }
    }, 300);
  };

  const goToPage = async (page: number) => {
    if (page < 1 || page > totalPages) return;
    await loadJobs(page, searchTerm);
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const handleAdd = () => {
    navigate("/job/add");
  };

  const handleEdit = (job: JobPostType) => {
    navigate(`/job/edit/${job.id}`);
  };

  const confirmDelete = (job: JobPostType) => {
    setJobToDelete(job);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!jobToDelete) return;
    try {
      await deleteJob(jobToDelete.id);
      toast({
        title: "Job Deleted",
        description: "The job post has been successfully deleted.",
      });
      setDeleteDialogOpen(false);
      setJobToDelete(null);
      loadJobs(currentPage, searchTerm);
    } catch {
      toast({ title: "Error", description: "Failed to delete job" });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Job Posts</h1>
          <p className="text-gray-600">Manage your job postings</p>
        </div>
        <Button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700">
          Add New Job
        </Button>
      </div>

      {loading ? (
        <SpinLoader />
      ) : (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>All Job Posts ({totalJobs})</CardTitle>
              <Input
                placeholder="Search jobs..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-64"
              />
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div
              className={`overflow-x-auto relative ${
                totalPages > 1
                  ? "max-h-[calc(100vh-290px)]"
                  : "max-h-[calc(100vh-230px)]"
              }`}
            >
              <Table className="min-w-full">
                <TableHeader className="bg-gray-100 sticky top-0 z-10">
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Job Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Job Type</TableHead>
                    <TableHead>Experience</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {jobs.length > 0 ? (
                    jobs.map((job: JobPostType) => (
                      <TableRow key={job.id}>
                        <TableCell>{job.date}</TableCell>
                        <TableCell className="font-medium">
                          {job.title}
                        </TableCell>
                        <TableCell>{job.category}</TableCell>
                        <TableCell>{job.jobType}</TableCell>
                        <TableCell>{job.experience}</TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              job.status === "ACTIVE"
                                ? "bg-green-100 text-green-800"
                                : job.status === "INACTIVE"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {job.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(job)}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => confirmDelete(job)}
                            >
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="text-center py-10 text-gray-500"
                      >
                        No job posts found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>

          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 py-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Prev
              </Button>
              <div>
                Page {currentPage} of {totalPages}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </Card>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to delete
            <span className="font-semibold"> this job post</span>?
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default JobPosts;
