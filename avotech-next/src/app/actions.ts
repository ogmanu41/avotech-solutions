"use server"

export async function submitContactForm(prevState: any, formData: FormData) {
  const fullName = formData.get("fullName") as string;
  const email    = formData.get("email") as string;
  const phone    = formData.get("phone") as string;
  const subject  = formData.get("subject") as string;
  const message  = formData.get("message") as string;

  // Validation checks
  if (!fullName || !email || !subject || !message) {
    return { success: false, error: "Please fill in all required fields." };
  }

  if (fullName.trim().length < 2 || fullName.trim().length > 100) {
    return { success: false, error: "Name must be between 2 and 100 characters." };
  }

  // Strict email regex match
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { success: false, error: "Please enter a valid email address." };
  }

  if (subject.trim().length < 3 || subject.trim().length > 200) {
    return { success: false, error: "Subject must be between 3 and 200 characters." };
  }

  if (message.trim().length < 10 || message.trim().length > 5000) {
    return { success: false, error: "Message must be between 10 and 5000 characters." };
  }

  // Log to standard stream securely (Vercel logger handles cloud preservation safely)
  console.log(`[Form Submission] Received query. Name: ${fullName}, Email: ${email}, Phone: ${phone || "None"}, Subject: ${subject}`);

  return { success: true, error: null };
}
export type FormState = {
  success: boolean;
  error: string | null;
};
