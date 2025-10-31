// ** Import configureStore from redux for store setup ** \\
import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import userSlice from "./slices/userSlice";
import authApi from "./apis/authApi"

// ** Initialize store ** \\
const store = configureStore({
    reducer: {
        user: userSlice,
        [authApi.reducerPath]: authApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(authApi.middleware)
});


// ** Custom types for app dispatch and selector ** \\
type RootState = ReturnType<typeof store.getState>
type AppDispatch = typeof store.dispatch
const useAppDispatch = () => useDispatch<AppDispatch>();
const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// ** Export all ** \\
export {
    store,
    useAppSelector,
    useAppDispatch,
}
