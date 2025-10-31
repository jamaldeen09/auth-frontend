"use client"

// ** Imports (client component) ** \\
import { useRegistrationValidation } from "@/hooks/useValidations";
import { callToast } from "@/app/providers/SonnerProvider";
import { useRegisterMutation } from "@/redux/apis/authApi";
import z from "zod"
import { Button } from "../ui/button";
import CustomSpinner from "../reusableUi/CustomSpinner";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import { ApiResult } from "@/redux/apiSettings";
import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";



// ** Component ** \\
const RegistrationComponent = (): React.ReactElement => {
  // ** Custom hook for registration validation ** \\
  const registrationSchema = useRegistrationValidation();

  // ** Registration form ** \\
  const registrationForm = useForm<z.infer<typeof registrationSchema>>({
    resolver: zodResolver(registrationSchema),
    defaultValues: { email: "", password: "", name: "" },
    mode: "onChange"
  });

  // ** Rtk query hook for registration request to the backend server ** \\
  const [register, { isLoading, isError, error, isSuccess, data }] = useRegisterMutation();

  // ** Function to register user** \\
  const registerUser = async (values: z.infer<typeof registrationSchema>) => {
    try {
      return await register(values);
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
      const typedData = ((data.data) as { auth: { userId: string; name: string; } });
      if (isMounted) {
        setAuthState(typedData?.auth);
        registrationForm.reset();
        router.push("/dashboard");
      }
    }

    if (isError && error && "data" in error && !isSuccess) {
      if (isMounted) callToast("error", (error as { data: ApiResult }).data.message);
    }

    return () => {
      isMounted = false;
    }
  }, [isSuccess, isError, error, data, callToast]);
  return (
    <Form {...registrationForm}>
      <form
        onSubmit={registrationForm.handleSubmit(registerUser)}
        className="space-y-4 w-full max-w-xs sm:max-w-sm bg-white shadow-sm rounded-sm p-6 border
        border-gray-200"
      >
        {/* Heading */}
        <header
          className="flex items-center justify-center mb-6"
        >
          <h1 className="text-2xl font-medium">Register</h1>
        </header>


        {/* Email field */}
        <FormField
          control={registrationForm.control}
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
          control={registrationForm.control}
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

        <FormField
          control={registrationForm.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder="Name"
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
          type="submit"
          disabled={isLoading}
          className="cursor-pointer w-full h-12"
        >
          {isLoading ? (
            <CustomSpinner />
          ) : (
            "Create your account"
          )}
        </Button>

        {/* Login text*/}
        <footer
          className="flex items-center justify-center"
        >
          <p
            className="text-xs mx-auto"
          >
            Already have an account? {" "}
            <span
              onClick={() => router.push("/?auth=login")}
              className="underline text-blue-600 cursor-pointer hover:text-blue-800
                transition-colors duration-200">login here</span>
          </p>
        </footer>
      </form>
    </Form>
  );
};

// ** Component export ** \\
export default RegistrationComponent;
