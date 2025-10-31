import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useApp } from "@/context/AppContext";
import { JobPostType } from "@/types/jobPost";
import { toast } from "@/hooks/use-toast";
import { SpinLoader } from "./ui/spin-loader";

interface FormData {
  title: string;
  slug: string;
  category: string;
  location: string;
  experience: string;
  jobType: string;
  jobDescription: string;
  status: string;
  description: string;
  keyResponsibilities: string[];
  keyRequirements: string[];
  niceToHave: string[];
}

interface FormErrors {
  [key: string]: string;
}

const JobFormPage: React.FC = () => {
  const { jobs, addJob, updateJob, getJobById } = useApp();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [formData, setFormData] = useState<FormData>({
    slug: "",
    title: "",
    description: "",
    category: "",
    location: "",
    experience: "",
    jobType: "Full-time",
    jobDescription: "",
    status: "Active",
    keyResponsibilities: [""],
    keyRequirements: [""],
    niceToHave: [""],
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      if (id) {
        const jobFromApi = await getJobById(id);
        if (jobFromApi) {
          setFormData({
            slug: jobFromApi.slug || "",
            title: jobFromApi.title,
            category: jobFromApi.category,
            location: jobFromApi.location,
            experience: jobFromApi.experience,
            jobType: jobFromApi.jobType,
            jobDescription: jobFromApi.jobDescription,
            status: jobFromApi.status || "Active",
            description: jobFromApi.description || "",
            keyResponsibilities: jobFromApi.keyResponsibilities.length
              ? jobFromApi.keyResponsibilities
              : [""],
            keyRequirements: jobFromApi.keyRequirements.length
              ? jobFromApi.keyRequirements
              : [""],
            niceToHave: jobFromApi.niceToHave.length
              ? jobFromApi.niceToHave
              : [""],
          });
        } else {
          toast({
            title: "Error",
            description: "Job not found",
            variant: "destructive",
          });
          navigate("/jobs"); // redirect if job not found
        }
      }
    };

    fetchJob();
  }, [id]);

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      // auto-generate slug from title only if creating a new job
      if (field === "title" && !id) {
        updated.slug = value
          .toLowerCase()
          .trim()
          .replace(/[^\w\s-]/g, "")
          .replace(/\s+/g, "-");
      }
      return updated;
    });
  };

  const handleArrayChange = (
    field: keyof FormData,
    idx: number,
    value: string
  ) => {
    const arr = [...formData[field]];
    arr[idx] = value;
    setFormData((prev) => ({ ...prev, [field]: arr }));
  };

  const addArrayItem = (field: keyof FormData) => {
    const arr = [...formData[field], ""];
    setFormData((prev) => ({ ...prev, [field]: arr }));
  };

  const removeArrayItem = (field: keyof FormData, idx: number) => {
    const arr = [...formData[field]];
    if (arr.length > 1) {
      arr.splice(idx, 1);
      setFormData((prev) => ({ ...prev, [field]: arr }));
    } else {
      toast({
        title: "Error",
        description: `At least 1 ${field
          .replace(/([A-Z])/g, " $1")
          .toLowerCase()} is required.`,
      });
    }
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!formData.slug.trim()) newErrors.slug = "Slug is required";
    if (!formData.title.trim()) newErrors.title = "Job title is required";
    if (!formData.category.trim()) newErrors.category = "Category is required";
    if (!formData.location.trim()) newErrors.location = "Location is required";
    if (!formData.experience.trim())
      newErrors.experience = "Experience is required";
    if (!formData.jobType.trim()) newErrors.jobType = "Job Type is required";
    if (!formData.jobDescription.trim())
      newErrors.jobDescription = "Job Description is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";

    ["keyResponsibilities", "keyRequirements", "niceToHave"].forEach(
      (field) => {
        const arr = formData[field];
        const fieldName = field.replace(/([A-Z])/g, " $1").toLowerCase();
        if (!arr.length || arr.every((item) => !item.trim())) {
          newErrors[field] = `At least one ${fieldName} is required`;
        } else {
          arr.forEach((item, idx) => {
            if (!item.trim())
              newErrors[`${field}_${idx}`] = `${fieldName} cannot be empty`;
          });
        }
      }
    );

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setTimeout(async () => {
      if (id) {
        const result = await updateJob(id, formData);
        setLoading(false);
        if (result?.success) {
          navigate("/jobs"); // ✅ only redirect if success
        }
      } else {
        const result = await addJob(formData);
        setLoading(false);
        if (result?.success) {
          navigate("/jobs"); // ✅ only redirect if success
        }
      }
    }, 500);
  };

  return (
    <div className="w-full mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">
        {id ? "Edit Job Post" : "Add New Job Post"}
      </h1>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <SpinLoader />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Job Title *</Label>
              <Input
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
              />
              {errors.title && (
                <p className="text-red-500 text-sm">{errors.title}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Slug *</Label>
              <Input
                value={formData.slug}
                onChange={(e) => handleChange("slug", e.target.value)}
                placeholder="Enter slug (or leave auto-generated)"
              />
              {errors.slug && (
                <p className="text-red-500 text-sm">{errors.slug}</p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Category *</Label>
              <Input
                value={formData.category}
                onChange={(e) => handleChange("category", e.target.value)}
              />
              {errors.category && (
                <p className="text-red-500 text-sm">{errors.category}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Location *</Label>
              <Input
                value={formData.location}
                onChange={(e) => handleChange("location", e.target.value)}
              />
              {errors.location && (
                <p className="text-red-500 text-sm">{errors.location}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Description *</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
            />
            {errors.description && (
              <p className="text-red-500 text-sm">{errors.description}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Experience *</Label>
              <Input
                value={formData.experience}
                placeholder="e.g., 3-5 years"
                onChange={(e) => handleChange("experience", e.target.value)}
              />
              {errors.experience && (
                <p className="text-red-500 text-sm">{errors.experience}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="jobType">Job Type *</Label>
              <Input
                id="jobType"
                placeholder="Enter job type (e.g., Full-time)"
                value={formData.jobType}
                onChange={(e) => handleChange("jobType", e.target.value)}
              />
              {errors.jobType && (
                <p className="text-red-500 text-sm">{errors.jobType}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Status *</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleChange("status", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["ACTIVE", "INACTIVE", "DRAFT"].map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Job Description *</Label>
            <Textarea
              value={formData.jobDescription}
              onChange={(e) => handleChange("jobDescription", e.target.value)}
            />
            {errors.jobDescription && (
              <p className="text-red-500 text-sm">{errors.jobDescription}</p>
            )}
          </div>

          {/* Array Fields */}
          {(
            [
              "keyResponsibilities",
              "keyRequirements",
              "niceToHave",
            ] as (keyof FormData)[]
          ).map((field) => (
            <div key={field} className="space-y-2">
              <Label className="capitalize">
                {field.replace(/([A-Z])/g, " $1")} *
              </Label>
              {errors[field] && (
                <p className="text-red-500 text-sm">{errors[field]}</p>
              )}
              {(formData[field] as string[]).map((item, idx) => (
                <div key={idx} className="flex gap-2 mb-1">
                  <Input
                    value={item}
                    placeholder={`Enter ${field
                      .replace(/([A-Z])/g, " $1")
                      .toLowerCase()}`}
                    onChange={(e) =>
                      handleArrayChange(field, idx, e.target.value)
                    }
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => removeArrayItem(field, idx)}
                  >
                    Delete
                  </Button>
                  {errors[`${field}_${idx}`] && (
                    <p className="text-red-500 text-sm">
                      {errors[`${field}_${idx}`]}
                    </p>
                  )}
                </div>
              ))}
              <Button
                type="button"
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => addArrayItem(field)}
              >
                Add {field.replace(/([A-Z])/g, " $1").toLowerCase()}
              </Button>
            </div>
          ))}

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/jobs")}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? "Saving..." : id ? "Update Job" : "Create Job"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default JobFormPage;
