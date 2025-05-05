import { atom } from "nanostores";

export const SERVICE_ID = import.meta.env.VITE_SERVICE_ID;
export const TEMPLATE_ID = import.meta.env.VITE_TEMPLATE_ID;
export const PUBLIC_KEY = import.meta.env.VITE_PUBLIC_KEY;

export const templateParams = atom({
  user_name: "",
  user_email: "",
  user_message: "",
});
