import { createSlice } from '@reduxjs/toolkit'
import { IUser, IUserAuth, IUserState } from '../../models/account';
import { APP_ENV } from '../../constants/env';
import { jwtParse } from '../../utilities/jwtParser';
import { RootState } from '..';

const getUserFromToken = (token: string | null): IUser | null => token ? jwtParse(token) : null
const getUserAuth = (user: IUser | null): IUserAuth => {
    return {
        isAdmin: user !== null && user.roles.includes('Admin'),
        isUser: user !== null && user.roles.includes('User'),
        isAuth: user !== null,
        location: user?.roles.includes('Admin') ? '/admin' : '/',
        roles: user?.roles || []
    }
}

const userInit = (): IUserState => {
    const token: string | null = sessionStorage.getItem(APP_ENV.ACCESS_KEY) || localStorage.getItem(APP_ENV.ACCESS_KEY);
    const user = getUserFromToken(token)
    const auth = getUserAuth(user);
    return {
        user: user,
        token: token,
        auth: auth
    }
}

const initialState: IUserState = userInit();
const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setCredentials: (state, action: { payload: { token: string, remember: boolean | undefined } }) => {
            const { token, remember } = action.payload
            state.user = getUserFromToken(token)
            state.token = token
            state.auth = getUserAuth(state.user)
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
            state.auth = getUserAuth(null)
        },
    },
})
export const getUser = (state: RootState) => state.user.user;
export const getAuth = (state: RootState) => state.user.auth;
export const getToken = (state: RootState) => state.user.token;

export const { setCredentials, logOut } = userSlice.actions
export default userSlice.reducer