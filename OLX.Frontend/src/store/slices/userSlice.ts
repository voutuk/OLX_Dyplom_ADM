import { createSlice } from '@reduxjs/toolkit'
import { IUserState } from '../../models/account';
import { APP_ENV } from '../../constants/env';
import { jwtParse } from '../../utilities/jwtParser';
import { RootState } from '..';




const storedToken: string | null = sessionStorage.getItem(APP_ENV.ACCESS_KEY) || localStorage.getItem(APP_ENV.ACCESS_KEY);
const initialState: IUserState = {
    user: storedToken ? jwtParse(storedToken) : null,
    token: storedToken
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setCredentials: (state, action: { payload: { token: string, remember: boolean | undefined } }) => {
            const { token ,remember} = action.payload
            state.user = token ? jwtParse(token) : null;
            state.token = token
            if (state.user !== null) {
                if (state.user.roles.includes('User') && remember) {
                    localStorage.setItem(APP_ENV.ACCESS_KEY, token);
                }
                else {
                    sessionStorage.setItem(APP_ENV.ACCESS_KEY, token);
                }
            }
        },
        logOut: (state) => {
            localStorage.removeItem(APP_ENV.ACCESS_KEY);
            sessionStorage.removeItem(APP_ENV.ACCESS_KEY)
            state.user = null
            state.token = null
        },
    },
})
export const getUser = (state: RootState) => state.user.user;
export const isAuth = (state: RootState): boolean => state.user.user !== null
export const isUser = (state: RootState): boolean => state.user.user !== null && state.user.user.roles.includes('User')
export const isAdmin = (state: RootState): boolean => state.user.user !== null && state.user.user.roles.includes('Admin')
export const { setCredentials, logOut } = userSlice.actions
export default userSlice.reducer