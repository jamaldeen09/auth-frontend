// ** Imports ** \\
import { createApi } from "@reduxjs/toolkit/query/react";
import { ApiResult, baseQueryWithReauth } from "../apiSettings";

// ** Define expected credentials ** \\
interface Credentials {
    register: {email: string; name: string; password: string;};
    login: Omit<Credentials["register"], "name">;
}

// ** Api definition ** \\
const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({
        register: builder.mutation<ApiResult, Credentials["register"]>({
            query: (body) => ({
                url: "auth/register",
                method: "POST",
                body,
            })
        }),

        login: builder.mutation<ApiResult, Credentials["login"]>({
            query: (body) => ({
                url: "auth/login",
                method: "POST",
                body,
            })
        }),

        getAuthState: builder.query<ApiResult, void>({
            query: () => "auth/me"
        }),

        logout: builder.mutation<ApiResult, void>({
            query: (body) => ({
                url: "auth/logout",
                method: "POST",
                body,
            })
        }),
    }),
});


// ** Exports ** \\
export const { useRegisterMutation, useLoginMutation, useGetAuthStateQuery, useLogoutMutation } = authApi;
export { type Credentials }
export default authApi