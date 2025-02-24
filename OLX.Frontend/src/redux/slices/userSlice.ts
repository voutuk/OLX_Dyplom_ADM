import { createSlice } from '@reduxjs/toolkit'
import { IUser, IUserAuth, IUserState } from '../../models/account';
import { APP_ENV } from '../../constants/env';
import { jwtParse } from '../../utilities/jwtParser';
import { RootState } from '..';
import { IAdminMesssage } from '../../models/adminMesssage';




const getUserFromToken = (token: string | null): IUser | null => token ? jwtParse(token) : null
const getUserAuth = (user: IUser | null, remember?: boolean | undefined): IUserAuth => {
    return ({
        isAdmin: user !== null && user.roles.includes('Admin'),
        isUser: user !== null && user.roles.includes('User'),
        isAuth: user !== null,
        location: user?.roles.includes('Admin') ? '/admin' : '/',
        roles: user?.roles || [],
        remember: remember || false
    })
}

const userInit = (): IUserState => {
    const sessionToken = sessionStorage.getItem(APP_ENV.ACCESS_KEY);
    const savedToken = localStorage.getItem(APP_ENV.ACCESS_KEY);
    const sessionRefToken = sessionStorage.getItem(APP_ENV.REFRESH_KEY);
    const savedToRefToken = localStorage.getItem(APP_ENV.REFRESH_KEY);
    const token: string | null = sessionToken || savedToken;
    const refreshToken: string | null = sessionRefToken || savedToRefToken
    const user = getUserFromToken(token)
    const auth = getUserAuth(user, savedToken !== null);
    return ({
        user: user,
        token: token,
        auth: auth,
        messages: [],
        refreshToken: refreshToken,
    })
}

const initialState: IUserState = userInit();
const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {

        setCredentials: (state, action: { payload: { token: string, refreshToken: string, remember: boolean | undefined } }) => {
            const { token, refreshToken, remember } = action.payload
            state.user = getUserFromToken(token)
            state.token = token
            state.refreshToken = refreshToken
            state.auth = getUserAuth(state.user, remember)

            if (state.user !== null) {
                if (state.user.roles.includes('User') && remember) {
                    localStorage.setItem(APP_ENV.ACCESS_KEY, token);
                    localStorage.setItem(APP_ENV.REFRESH_KEY, refreshToken);
                }
                else {
                    sessionStorage.setItem(APP_ENV.ACCESS_KEY, token);
                    sessionStorage.setItem(APP_ENV.REFRESH_KEY, refreshToken);
                }
            }
        },

        updateAccessToken: (state, action: { payload: { token: string } }) => {
            const { token } = action.payload
            state.user = getUserFromToken(token)
            state.token = token
            if (state.user !== null) {
                if (state.user.roles.includes('User') && state.auth.remember) {
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
            localStorage.removeItem(APP_ENV.REFRESH_KEY);
            sessionStorage.removeItem(APP_ENV.REFRESH_KEY)
            state.user = null
            state.token = null
            state.refreshToken = null
            state.messages = []
            state.auth = getUserAuth(null)
        },
        setMessages: (state, action: { payload: IAdminMesssage[] }) => {
            state.messages = action.payload
        },
        addMessage: (state, action: { payload: IAdminMesssage }) => {
            state.messages.push(action.payload)
        },
        removeMessage: (state, action: { payload: number }) => {
            state.messages = state.messages.filter(x => x.id !== action.payload)
        },
        setReaded: (state, action: { payload: number }) => {
            const message = state.messages.find(x => x.id === action.payload)
            if (message) {
                message.readed = true;
            }
        },
        clearMessages: (state) => {
            state.messages = []
        },
    },
})
export const getUser = (state: RootState) => state.user.user;
export const getAuth = (state: RootState) => state.user.auth;
export const getToken = (state: RootState) => state.user.token;
export const getRefreshToken = (state: RootState) => state.user.refreshToken
export const getUnreadedCount = (state: RootState) => state.user.messages.filter(x => !x.readed).length;
export const getMessages = (state: RootState) => state.user.messages;

export const { setCredentials, updateAccessToken, logOut, addMessage, removeMessage, setReaded, clearMessages, setMessages } = userSlice.actions
export default userSlice.reducer