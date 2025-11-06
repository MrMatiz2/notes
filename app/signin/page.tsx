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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <AuthForm mode="Login" onSubmit={handleLogin} />
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Don't have an account?{" "}
              <a
                href="/signup"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
              >
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}