import emailjs from "@emailjs/browser";

const SERVICE_ID = import.meta.env.VITE_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_PUBLIC_KEY;

const getSuggestion = () => {
  console.log(emailjs);

  return SERVICE_ID;
};

export default getSuggestion;
