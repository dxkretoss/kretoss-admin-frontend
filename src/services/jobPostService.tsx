import {
  GetAllJobPostsResponseType,
  JobPostType,
  UpdateJobPostsRequestType,
  UpdateJobPostsResponseType,
} from "@/types/jobPost";
import fetch from "../interceptor/fetchInterceptor";

interface GetAllJobPostsParams {
  search?: string;
  page?: number;
  limit?: number;
}

const JobPostService = {
  // ✅ Add params for search and pagination
  getAll: (
    params?: GetAllJobPostsParams
  ): Promise<GetAllJobPostsResponseType> => {
    const query = new URLSearchParams();

    if (params?.search) query.append("search", params.search);
    if (params?.page) query.append("page", params.page.toString());
    if (params?.limit) query.append("limit", params.limit.toString());

    const queryString = query.toString() ? `?${query.toString()}` : "";

    return fetch({
      url: `/get-jobpost${queryString}`,
      method: "get",
    });
  },
  create: (
    data: Omit<JobPostType, "id" | "date">
  ): Promise<{ success: boolean; data: JobPostType; message?: string }> => {
    return fetch({
      url: "/create-jobpost", // your backend POST endpoint
      method: "post",
      data,
    });
  },
  update: (
    id: string,
    data: Partial<JobPostType>
  ): Promise<UpdateJobPostsResponseType> => {
    return fetch({
      url: `/update-jobpost/${id}`,
      method: "put",
      data,
    });
  },
  getById: (id: string): Promise<UpdateJobPostsResponseType> => {
    return fetch({
      url: `/get-jobpostbyid/${id}`,
      method: "get",
    });
  },
  delete: (id: string): Promise<UpdateJobPostsResponseType> => {
    return fetch({
      url: `/delete-jobpost/${id}`,
      method: "delete",
    });
  },
};

export default JobPostService;
