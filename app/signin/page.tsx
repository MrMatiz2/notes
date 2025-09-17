"use client";

import AuthForm from "@/components/AuthForm";
import { signIn } from "@/app/lib/auth-client";

export default function Login() {

  const handleLogin = async (formData: { email: string; password: string }) => {
      const { email, password } = formData;
      const { data, error } = await signIn.email({
        email,
        password,
        callbackURL: "/dashboard",
        /**
         * remember the user session after the browser is closed. 
         * @default true
         */
        rememberMe: false
      }, {
        //callbacks
      })
    };

  return (
    <AuthForm mode="Login" onSubmit={handleLogin} />
  );
}