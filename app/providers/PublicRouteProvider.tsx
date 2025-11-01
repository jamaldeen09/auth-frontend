"use client"
// ** Imports (client component) ** \\
import React, { useEffect, useState } from 'react'; // 🔑 ADDED useState
import { useRouter } from 'next/navigation';
import useAuth from '@/hooks/useAuth';
import { useGetAuthStateQuery } from '@/redux/apis/authApi';
import CustomSpinner from '@/components/reusableUi/CustomSpinner';

interface PublicRouteProps {
  children: React.ReactNode
}

// ** Component ** \\
const PublicRouteProvider: React.FC<PublicRouteProps> = ({ children }): React.ReactElement => {
  const router = useRouter();
  const REDIRECT_PATH = '/dashboard';
  // 🔑 Destructure the synchronous token check flag
  const { usersAuthState, hasLocalAccessToken } = useAuth(); 

  // 🔑 ADDED: State to track if the component has mounted on the client side
  const [isMounted, setIsMounted] = useState(false);

  // ** Trigger the request (RTK Query deduplication ensures only one request is sent) ** \\
  const { isLoading, isFetching } = useGetAuthStateQuery();

  const isPending = isLoading || isFetching;

  useEffect(() => {
      setIsMounted(true);
      
      // ** Finished checking AND the user IS authenticated ** \\
      if (!isPending && usersAuthState.isAuthenticated) {
        router.replace(REDIRECT_PATH);
      };

  }, [isPending, usersAuthState.isAuthenticated, router, REDIRECT_PATH]);


  // ** 🔑 RENDER LOGIC: Hydration Guard and FOUC Check ** \\
  if (isPending) {

    if (!isMounted) {
      return (
        <div
          className="flex items-center justify-center flex-col gap-2 text-center h-screen"
        >
          <CustomSpinner className="size-8" />
          <p className="text-sm">Checking status...</p> 
        </div>
      );
    }
    

    if (hasLocalAccessToken) {
      return (
        <div
          className="flex items-center justify-center flex-col gap-2 text-center h-screen"
        >
          <CustomSpinner className="size-8" />
          <p className="text-sm">Redirecting to Dashboard...</p>
        </div>
      );
    }

    return (
      <div
        className="flex items-center justify-center flex-col gap-2 text-center h-screen"
      >
        <CustomSpinner className="size-8" />
        <p className="text-sm">Checking status...</p>
      </div>
    );
  }

  // ** Finished checking AND the user IS authenticated ** \\
  if (usersAuthState.isAuthenticated) {
    return (
      <div
        className="flex items-center justify-center flex-col gap-2 text-center h-screen"
      >
        <CustomSpinner className="size-8" />
        <p className="text-sm">Redirecting to Dashboard...</p>
      </div>
    )
  }

  // ** Finished checking AND the user IS NOT authenticated ** \\

  return <>{children}</>;
};

export default PublicRouteProvider;