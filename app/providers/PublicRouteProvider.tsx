"use client"
// ** Imports (client component) ** \\
import React, { useEffect } from 'react';
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
  const { usersAuthState } = useAuth();

  // ** Trigger the request (RTK Query deduplication ensures only one request is sent) ** \\
  const { isLoading, isFetching } = useGetAuthStateQuery();

  const isPending = isLoading || isFetching;


  useEffect(() => {
    let isMounted = true;
    // ** Finished checking AND the user IS authenticated ** \\
    if (!isPending && usersAuthState.isAuthenticated) {
      // ** Immediately redirect the logged-in user away from the public page *8\\
      if (isMounted) router.replace(REDIRECT_PATH);
    };

    return () => { isMounted = false }
  }, [isPending, usersAuthState.isAuthenticated, router, REDIRECT_PATH]);


  // ** Still checking authentication status (blocks the page content) ** \\
  if (isPending) {
    return (
      <div
        className="flex items-center justify-center flex-col gap-2 text-center h-screen"
      >
        <CustomSpinner className="size-8" />
        <p className="text-sm">Checking status...</p>
      </div>
    )
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


  return <>{children}</>;
};

export default PublicRouteProvider;