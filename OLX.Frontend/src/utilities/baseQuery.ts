
import { APP_ENV } from '../constants/env';
import { IAuthResponse } from '../models/account';
import { accountApiAuth } from '../services/accountServiceAuth';
import { RootState } from '../store';
import { setCredentials } from '../store/slices/userSlice';
import { BaseQueryApi, FetchArgs, fetchBaseQuery } from '@reduxjs/toolkit/query';


const logout = async (api: BaseQueryApi) => {
    const logoutMutation = api.dispatch(accountApiAuth.endpoints.logout.initiate({}));

    const result = await logoutMutation.unwrap();
    if (!result.error) {
        console.error('Unauthorized! Redirecting to login...');
        window.location.href = '/login'
    }
    else{
        console.error(result.error);
    }

}

export const createBaseQuery = (endpoint: string) =>
    fetchBaseQuery({
        baseUrl: `${APP_ENV.API_URL}/${endpoint}/`
    })

export const createBaseQueryWithAuth = (endpoint: string) => {
    const baseQuery = fetchBaseQuery({
        baseUrl: `${APP_ENV.API_URL}/${endpoint}/`,
        prepareHeaders: (headers, { getState }) => {
            const user = (getState() as RootState).user.user;
            if (user && new Date(user.exp * 1000) >= new Date()) {
                const token = (getState() as RootState).user.token;
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        },
    });
    return async (args: string | FetchArgs, api: BaseQueryApi, extraOptions: { headers?: Record<string, string> } = {}) => {

        //const state = api.getState() as RootState;
        //const user = state.user.user;
        // if (user) {
        //     let token: string | null;
        //     if (new Date(user.exp * 1000) < new Date()) {
        //         const response = await baseQuery(
        //             {
        //                 url: 'user/refresh',
        //                 method: 'POST',
        //                 credentials: 'include',
        //             },
        //             api,
        //             extraOptions
        //         );
        //         if (response.data && (response.data as IAuthResponse).accessToken) {
        //             const newToken = (response.data as IAuthResponse).accessToken;
        //             token = newToken;
        //             api.dispatch(setCredentials({ token: newToken }))
        //         }
        //         else {
        //             logout(api);
        //             return  { error: { status: 401, message: 'Unauthorized' } };
        //         }
        //     }
        //     else {
        //       token = state.user.token;
        //    }
        // extraOptions.headers = {
        //     ...extraOptions.headers,
        //     'Authorization': `Bearer ${state.user.token}`
        // };
        //}

        const result = await baseQuery(args, api, extraOptions);
        if (result.error && result.error.status === 401) {
            logout(api);
        }
        return result;
    };
}