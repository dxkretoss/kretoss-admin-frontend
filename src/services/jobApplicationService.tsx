import fetch from "../interceptor/fetchInterceptor";
import { GetAllJobApplicationsResponseType, UpdateJobApplicationsRequestType, UpdateJobApplicationsResponseType } from "@/types/jobApplication";

const JobApplicationService = {
  getAll: (): Promise<GetAllJobApplicationsResponseType> => {
    return fetch({
      url: "/job-application/all",
      method: "get",
    });
  },
  update: (data: UpdateJobApplicationsRequestType): Promise<UpdateJobApplicationsResponseType> => {
    return fetch({
      url: "/job-application/update",
      method: "put",
      data
    });
  },
};

export default JobApplicationService;
