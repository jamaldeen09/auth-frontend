"use client"
import { logout, setAuth } from "@/redux/slices/userSlice";
import { useAppDispatch, useAppSelector } from "@/redux/store"

// ** Imports (client hook) ** \\

// ** Hook ** \\
const useAuth = () => {
    const dispatch = useAppDispatch();
    const usersAuthState = useAppSelector((state) => state.user.auth);

    const hasLocalAccessToken = typeof window !== 'undefined' 
        ? !!localStorage.getItem("accessToken") 
        : false;

    // ** Function to set a users auth state ** \\
    const setAuthState = (
        authData: {
            name: string;
            userId: string;
            accessToken: string;
            refreshToken: string;
        }
    ) => {
        dispatch(setAuth(authData));
    };

    // ** Function to log a user out (clear auth state) ** \\
    const logUserOut = () => {
        dispatch(logout());
    };

    return {
        usersAuthState,
        setAuthState,
        logUserOut,
        hasLocalAccessToken, // 🔑 Export the new flag
    }
}

export default useAuth
