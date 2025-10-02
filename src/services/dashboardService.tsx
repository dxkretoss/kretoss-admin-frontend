import fetch from "../interceptor/fetchInterceptor";

const DashboardService = {
  getDashboard: (): Promise<any> => {
    return fetch({
      url: `/dashboard`,
      method: "get",
    });
  },
};

export default DashboardService;
