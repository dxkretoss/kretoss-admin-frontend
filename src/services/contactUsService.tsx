import { GetAllContactUsResponseType } from "@/types/contactUs";
import fetch from "../interceptor/fetchInterceptor";

const ContactUsService = {
    getAll: (): Promise<GetAllContactUsResponseType> => {
        return fetch({
            url: "/contact-us/all",
            method: "get",
        });
    },
};

export default ContactUsService;
