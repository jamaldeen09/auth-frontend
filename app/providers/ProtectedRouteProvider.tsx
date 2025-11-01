"use client"
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuth from '@/hooks/useAuth';
import { useGetAuthStateQuery } from '@/redux/apis/authApi';
import CustomSpinner from '@/components/reusableUi/CustomSpinner';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRouteProvider: React.FC<ProtectedRouteProps> = ({ children }) => {
    const router = useRouter();
    // 🔑 Destructure the new synchronous flag
    const { usersAuthState, hasLocalAccessToken } = useAuth(); 

    // ** The result updates the isAuthenticated flag in your Redux store via extraReducer ** \\
    const { isLoading, isFetching } = useGetAuthStateQuery();

    // ** Combine all loading indicators ** \\
    const isPending = isLoading || isFetching;

    useEffect(() => {
        // ** Finished checking AND the user is NOT authenticated ** \\
 
        if (!isPending && !usersAuthState.isAuthenticated) {
            router.replace("/?auth=login"); 
        }
    }, [isPending, usersAuthState.isAuthenticated, router]);

    // ** Still checking authentication status (blocks FOUC) ** \\
    if (isPending || (hasLocalAccessToken && !usersAuthState.isAuthenticated)) {
        return (
            <div
                className="flex items-center justify-center h-screen"
            >
                <CustomSpinner className="size-8" />
            </div>
        )
    }

    // ** Finished checking AND the user is NOT authenticated ** \\
    if (!usersAuthState.isAuthenticated) {
        // ** Return loading/null while the redirect takes effect **
        return (
            <div
                className="flex items-center justify-center flex-col gap-2 text-center h-screen"
            >
                <CustomSpinner className="size-8" />
                <p className="text-sm">Redirecting to login...</p>
            </div>
        )
    }

    // ** Finished checking AND the user IS authenticated ** \\
    return <>{children}</>;
};

export default ProtectedRouteProvider;