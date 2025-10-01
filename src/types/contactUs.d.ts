// export interface ContactUsFormType {
//   id: number;
//   name: string;
//   email: string;
//   phone: string;
//   subject: string;
//   message: string;
//   createdAt: string;
//   updatedAt: string;
// }

export interface GetAllContactUsResponseType {
  success: boolean;
  message: string;
  data: ContactForm[];
}

export interface ContactForm {
  createdAt: string;
  email: string;
  id: string;
  message: string;
  name: string;
  phone: string;
  subject: string;
  createdAt: string;
}