
import { APP_ENV } from '../../constants/env';
import { RootState } from '..';
import { BaseQueryApi, FetchArgs, fetchBaseQuery } from '@reduxjs/toolkit/query';
import { IAuthResponse } from '../../models/account';
import { setCredentials } from '../slices/userSlice';





export const createBaseQuery = (endpoint: string) =>
    fetchBaseQuery({
        baseUrl: `${APP_ENV.API_URL}/${endpoint}/`
    })

export const createBaseQueryWithAuth = (endpoint: string) => {
    const baseQuery = createBaseQuery(endpoint)
    return async (args: string | FetchArgs, api: BaseQueryApi, extraOptions: { headers?: Record<string, string> } = {}) => {

        const state = api.getState() as RootState;
        const user = state.user.user;
        if (user) {
            let token = state.user.token;
            if (new Date(user.exp * 1000) < new Date()) {
                const response = await baseQuery(
                    {
                        url: 'user/refresh',
                        method: 'POST',
                        credentials: 'include',
                    },
                    api,
                    extraOptions
                );
                if (response.data && (response.data as IAuthResponse).accessToken) {
                    const newToken = (response.data as IAuthResponse).accessToken;
                    token = newToken;
                    const remember = state.user.auth.remember
                    api.dispatch(setCredentials({ token: newToken, remember: remember }))
                }
                else if(response.error){
                    return response
                }
            }
            extraOptions.headers = {
                ...extraOptions.headers,
                'Authorization': `Bearer ${token}`
            };
            return await baseQuery(args, api, extraOptions);
        }
        return {
            status: 401,
            data: {
                message: 'Unauthorized',
                error: 'Invalid credentials' 
            }
        }
    }
}