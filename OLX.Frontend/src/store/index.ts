import { configureStore } from "@reduxjs/toolkit";
import userReducer from './slices/userSlice'
import appReducer from './slices/appSlice'
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { accountApi } from "../services/accountService";
import { accountApiAuth } from "../services/accountServiceAuth";
import errorMiddleware from "./middlewares/errorMiddleware";
import { setupListeners } from "@reduxjs/toolkit/query/react";


export const store = configureStore({
    reducer: {
        user: userReducer,
        app: appReducer,
        //[productApi.reducerPath]: productApi.reducer,
        [accountApi.reducerPath]: accountApi.reducer,
        [accountApiAuth.reducerPath]: accountApiAuth.reducer,
       // [categoryApi.reducerPath]: categoryApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            accountApi.middleware,
            accountApiAuth.middleware,
            errorMiddleware)
})
setupListeners(store.dispatch);
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

