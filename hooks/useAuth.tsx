"use client"
import { logout, setAuth } from "@/redux/slices/userSlice";
import { useAppDispatch, useAppSelector } from "@/redux/store"

// ** Imports (client hook) ** \\

// ** Hook ** \\
const useAuth = () => {
    const dispatch = useAppDispatch();
    const usersAuthState = useAppSelector((state) => state.user.auth);

    // ** Function to set a users auth state ** \\
    const setAuthState = (
        authData: { name: string; userId: string; }
    ) => { dispatch(setAuth(authData)) };

    // ** Function to log a user out (clear auth state) ** \\
    const logUserOut = () => { dispatch(logout()) };

    return {
        usersAuthState,
        setAuthState,
        logUserOut
    }
}

export default useAuth

