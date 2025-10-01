import { LoginRequestType, LoginResponseType } from "@/types/auth";
import fetch from "../interceptor/fetchInterceptor";


const JwtAuthService = {
  login: (data: LoginRequestType): Promise<LoginResponseType> => {
    return fetch({
      url: "/login",
      method: "post",
      headers: {
        "public-request": "true", // Custom header for unauthenticated routes
      },
      data,
    });
  },

};

export default JwtAuthService;
