"use client";

import AuthForm from "@/components/AuthForm";
import { signUp } from "@/app/lib/auth-client";

export default function SignUp() {

  const handleSignUp = async (formData: { email: string; password: string, name: string }) => {
    const { email, password, name } = formData;
    const { data, error } = await signUp.email({
      email,
      password,
      name,
      callbackURL: "/dashboard" // A URL to redirect to after the user verifies their email (optional)
    }, {
      onRequest: (ctx) => {
        //show loading
      },
      onSuccess: (ctx) => {
        //redirect to the dashboard or sign in page
      },
      onError: (ctx) => {
        // display the error message
        alert(ctx.error.message);
      },
    });
  };

  return (
    <AuthForm mode="Signup" onSubmit={handleSignUp} />
  );
}