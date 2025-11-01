// ** Imports ** \\
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logout, refreshAuth, setAuth } from "./slices/userSlice";

// ** Define api result upon response ** \\
interface ApiResult {
    success: boolean;
    message: string;
    statusCode: number;
    error?: string;
    data?: unknown;
}

// ** Base query with access token from localStorage ** \\
const baseQuery = fetchBaseQuery({
    baseUrl: "https://auth-microservice-18d6.onrender.com/api/v1",
    prepareHeaders: (headers) => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            headers.set("Authorization", `Bearer ${token}`);
        }
        return headers;
    },
});

// ** Base query with automatic refresh on 401 ** \\
const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
    args,
    api,
    extraOptions
) => {
    // ** First, try the original request ** \\
    let result = await baseQuery(args, api, extraOptions);

    // ** If 401, try refreshing token ** \\
    if (result.error && result.error.status === 401) {
        const refreshToken = localStorage.getItem("refreshToken");

        if (!refreshToken) {
            api.dispatch(logout());
            return result;
        }

        const refreshResult = await baseQuery(
            {
                url: "/auth/refresh",
                method: "POST",
                headers: { "x-refresh-token": refreshToken },
            },
            api,
            extraOptions
        );

        if (refreshResult.data) {
            const typedResult = (refreshResult.data as ApiResult).data as {
                auth: { userId: string; name: string; };
                accessToken: string;
            };

            // ** Update tokens in localStorage ** \\
            localStorage.setItem("accessToken", typedResult.accessToken);

            // ** Update redux state ** \\
            api.dispatch(refreshAuth({...typedResult.auth, accessToken: typedResult.accessToken }));

            // ** Retry the original request ** \\
            result = await baseQuery(args, api, extraOptions);
        } else {
            // ** Refresh failed, log user out ** \\
            api.dispatch(logout());
        }
    }

    return result;
};

export { baseQueryWithReauth, type ApiResult };
