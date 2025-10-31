// ** Imports ** \\
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import authApi from "../apis/authApi";

// ** Setup interface/schema for the initial state ** \\
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

// ** Setup initial state to pass into the slice ** \\
const initialState: User = {
    profile: { name: "", email: "", _id: "" },
    auth: {
        userId: "", name: "",
        isAuthenticated: false,
    }
};

// ** Create the user slice ** \\
const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setAuth: (state, action: PayloadAction<Omit<User["auth"], "isAuthenticated">>) => {
            state.auth = { ...action.payload, isAuthenticated: true }
        },
        logout: (state) => {
            state.profile = { name: "", email: "", _id: "" };
            state.auth = {
                userId: "",
                name: "",
                isAuthenticated: false,
            }
        },
    },
    extraReducers: (builder) => {
        // ** --- Successful Fetch: Set Auth State --- ** \\
        builder.addMatcher(
            authApi.endpoints.getAuthState.matchFulfilled,
            (state, action) => {
                const authData = (action.payload.data as { auth: { userId: string; name: string;} }).auth
                state.auth.userId = authData.userId;
                state.auth.name = authData.name;
                state.auth.isAuthenticated = true; 
            }
        );

        // ** --- Failed Fetch (401/403): Clear Auth State --- ** \\
        builder.addMatcher(
            authApi.endpoints.getAuthState.matchRejected,
            (state) => {
                state.auth.isAuthenticated = false;
                state.auth.userId = "";
                state.auth.name = "";
                state.profile = { name: "", email: "", _id: "" };
            }
        );
    }

});

// ** Export the reducers and the slice itself ** \\
export const { setAuth, logout } = userSlice.actions;
export { type User };
export default userSlice.reducer;



