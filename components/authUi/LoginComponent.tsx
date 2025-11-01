"use client"

// ** Imports (client component) ** \\
import { useLoginValidation } from "@/hooks/useValidations";
import React, { useEffect } from "react";
import useAuth from "@/hooks/useAuth";
import { ApiResult } from "@/redux/apiSettings";
import { callToast } from "@/app/providers/SonnerProvider";
import { useRouter } from "next/navigation";
import z from "zod"
import { useLoginMutation } from "@/redux/apis/authApi";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import CustomSpinner from "../reusableUi/CustomSpinner";

const LoginComponent = (): React.ReactElement => {
  // ** Custom hook for registration validation ** \\
  const loginSchema = useLoginValidation();

  // ** Login form ** \\
  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
    mode: "onChange"
  });

  // ** Rtk query hook for registration request to the backend server ** \\
  const [login, { isLoading, isError, error, isSuccess, data }] = useLoginMutation();

  // ** Function to login user ** \\
  const loginUser = async (values: z.infer<typeof loginSchema>) => {
    try {
      return await login(values);
    } catch (err) {
      console.error(`Error occured in "registerUser" in file RegistrationComponent.tsx: ${err}`);
      return callToast("error", "An unexpected error occured while trying to register your account");
    }
  };

  // ** Router initialization ** \\
  const router = useRouter();

  // ** Custom hook for user auth ** \\
  const { setAuthState } = useAuth();

  // ** UseEffect to handle api responses ** \\
  useEffect(() => {
    let isMounted = true;

    if (isSuccess && !isError && !error) {
      const typedData = ((data.data) as {
        auth: { userId: string; name: string; },
        accessToken: string;
        refreshToken: string;
      });



      if (isMounted) {
        setAuthState({ ...typedData.auth, accessToken: typedData.accessToken, refreshToken: typedData.refreshToken });
        loginForm.reset();
        router.push("/dashboard");
      }
    }

    if (isError && error && "data" in error && !isSuccess) {
      if (isMounted) {
        callToast("error", (error as { data: ApiResult }).data.message);
      }
    }

    return () => {
      isMounted = false;
    }
  }, [isSuccess, isError, error, data, callToast]);
  return (
    <Form {...loginForm}>
      <form
        onSubmit={loginForm.handleSubmit(loginUser)}
        className="space-y-4 w-full max-w-xs sm:max-w-sm bg-white rounded-sm  p-6 border border-gray-200"
      >
        {/* Heading */}
        <header
          className="flex items-center justify-center mb-6"
        >
          <h1 className="text-2xl font-medium">Login to your account</h1>
        </header>


        {/* Email field */}
        <FormField
          control={loginForm.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder="Email address"
                  type="email"
                  {...field}
                  className="h-11"
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        {/* Password field */}
        <FormField
          control={loginForm.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder="Password"
                  type="text"
                  {...field}
                  className="h-11"
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        {/* Submit button */}
        <Button
          disabled={isLoading}
          className="cursor-pointer w-full h-12"
        >
          {isLoading ? (
            <CustomSpinner />
          ) : (
            "Login"
          )}
        </Button>

        {/* Signup text*/}
        <footer
          className="flex items-center justify-center"
        >
          <p
            className="text-xs mx-auto"
          >
            Dont have an account? {" "}
            <span
              onClick={() => router.push("/?auth=register")}
              className="underline text-blue-600 cursor-pointer hover:text-blue-800
                transition-colors duration-200">register here</span>
          </p>
        </footer>
      </form>
    </Form>
  );
};

export default LoginComponent;