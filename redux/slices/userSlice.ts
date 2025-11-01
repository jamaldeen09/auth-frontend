import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import authApi from "../apis/authApi";

interface User {
    profile: {
        name: string;
        _id: string;
        email: string;
    };
    auth: {
        userId: string;
        name: string;
        isAuthenticated: boolean;
    };
}

const initialState: User = {
    profile: { name: "", email: "", _id: "" },
    auth: {
        userId: "",
        name: "",
        isAuthenticated: false,
    },
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setAuth: (state, action: PayloadAction<Omit<User["auth"], "isAuthenticated"> & { accessToken: string; refreshToken: string; }>) => {
            state.auth = { ...action.payload, isAuthenticated: true };

            if (typeof window !== "undefined") {
                localStorage.setItem("accessToken", action.payload.accessToken) 
                localStorage.setItem("refreshToken", action.payload.refreshToken) 
            }
        },

        refreshAuth: (state, action: PayloadAction<Omit<User["auth"], "isAuthenticated"> & { accessToken: string; }>) => {
            state.auth = { ...action.payload, isAuthenticated: true };
            if (typeof window !== "undefined") { localStorage.setItem("accessToken", action.payload.accessToken) }
        },

        logout: (state) => {
            state.profile = { name: "", email: "", _id: "" };
            state.auth = { userId: "", name: "", isAuthenticated: false };

            if (typeof window !== "undefined") {
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                localStorage.removeItem("userAuth");
            }
        },
    },
    extraReducers: (builder) => {
        builder.addMatcher(
            authApi.endpoints.getAuthState.matchFulfilled,
            (state, action) => {
                const authData = (action.payload.data as { auth: { userId: string; name: string; } }).auth;
                state.auth.userId = authData.userId;
                state.auth.name = authData.name;
                state.auth.isAuthenticated = true;
            }
        );

        builder.addMatcher(
            authApi.endpoints.getAuthState.matchRejected,
            (state) => {
                state.auth.isAuthenticated = false;
                state.auth.userId = "";
                state.auth.name = "";
                state.profile = { name: "", email: "", _id: "" };
            }
        );
    },
});

export const { setAuth, logout, refreshAuth } = userSlice.actions;
export type { User };
export default userSlice.reducer;
