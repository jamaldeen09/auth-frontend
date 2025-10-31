// ** Imports ** \\
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {logout, setAuth } from "./slices/userSlice"; 


// ** Define api result upon response ** \\
interface ApiResult {
    success: boolean;
    message: string;
    statusCode: number;
    error?: string;
    data?: unknown;
}

// ** Define base query ** \\
const baseQuery = fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    credentials: "include",
});

// ** Logic to refresh token immediately after access token expires ** \\
const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
    args,
    api,
    extraOptions
) => {
    let result = await baseQuery(args, api, extraOptions);
    if (result.error && result.error.status === 401) {
        const refreshResult = await baseQuery("auth/refresh", api, extraOptions);

        if (refreshResult.data) {
            const typedResult = (refreshResult.data as ApiResult).data as {
                auth: { userId: string; name: string; }
            }

            api.dispatch(setAuth(typedResult.auth));
            
            // ** Retry the original query ** \\
            result = await baseQuery(args, api, extraOptions);
        } else {
            // ** Logout if refresh failed ** \\
            api.dispatch(logout());
        }
    }

    return result;
};

export { baseQueryWithReauth, type ApiResult }