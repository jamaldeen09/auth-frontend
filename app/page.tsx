// ** Imports (server component) ** \\
import AuthPage from "@/components/authUi/AuthPage";
import { Suspense } from "react";

// ** Component ** \\
const page = (): React.ReactElement => {
  return (
    <Suspense fallback={<div className="h-screen flex justify-center items-center">Loading...</div>}>
      <AuthPage />
    </Suspense>
  );
};

// ** Component export ** \\
export default page;