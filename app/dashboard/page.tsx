"use client"
// ** Imports (client component) ** \\
import React, { useEffect } from "react";
import ProtectedRouteProvider from "../providers/ProtectedRouteProvider";
import { Button } from "@/components/ui/button";
import useAuth from "@/hooks/useAuth";
import { useLogoutMutation } from "@/redux/apis/authApi";
import CustomSpinner from "@/components/reusableUi/CustomSpinner";
import { callToast } from "../providers/SonnerProvider";
import { useRouter } from "next/navigation";
import { ApiResult } from "@/redux/apiSettings";


// ** Component ** \\
const Dashboard = (): React.ReactElement => {
  // ** Fake stats ** \\
  const fakeStats = [
    { title: "Projects", value: 8 },
    { title: "Tasks Completed", value: 124 },
    { title: "API Calls (Today)", value: 3_247 },
  ];

  // ** Custom hook to grab name from auth state and get the state clearing function ** \\
  const { usersAuthState, logUserOut: clearAuthState } = useAuth();

  // ** Rtk query ** \\
  const [logout, { isLoading, error, isError, isSuccess, data }] = useLogoutMutation();

  const logUserOut = async () => {
    try {
      return await logout();
    } catch (err) {
      console.error(`Error occured in "logUserOut" function in file "page.tsx(/dashboard)": ${err}`);
      return callToast("error", "A server error occured while trying to log you out")
    }
  };

  // ** UseEffect to handle successfull and failure cases during logout ** \\
  useEffect(() => {
    let isMounted = true;
    if (isSuccess && !isError && !error) {
      if (isMounted) {
        callToast("success", data.message);

        clearAuthState();
      }
    }

    if (isError && error && "data" in error && !isSuccess) {
      if (isMounted) {
        callToast("error", (error.data as ApiResult).message);
      }
    }

    return () => { isMounted = false }
  }, [isSuccess, error, isError, data])
  return (
    <ProtectedRouteProvider>
      <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
        <div className="bg-white rounded-2xl p-8 w-full max-w-2xl text-center border border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Welcome back, {usersAuthState.name.split(" ")[0]} 👋
          </h1>
          <p className="text-gray-500 mb-8">
            You’re logged in as <span className="font-medium">a developer</span>
          </p>

          <div className="grid md:grid-cols-3 gap-4 ">
            {fakeStats.map((stat, i: number) => (
              <div
                key={stat.title}
                className="bg-gray-100 p-4 rounded-sm hover:bg-gray-200 transition cursor-pointer"
              >
                <p className="text-sm text-gray-500">{stat.title}</p>
                <p className="text-2xl font-semibold text-gray-800">
                  {stat.value.toLocaleString()}
                </p>
              </div>
            ))}
          </div>

          <Button
            disabled={isLoading}
            onClick={logUserOut}
            variant="destructive"
            className="rounded-sm mt-8 cursor-pointer hover:brightness-90"
          >
            {isLoading ? <CustomSpinner /> : "Logout"}
          </Button>
        </div>
      </main>
    </ProtectedRouteProvider>
  );
};

// ** Component export ** \\
export default Dashboard;