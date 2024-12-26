import { createSlice } from '@reduxjs/toolkit'
import { IUserState } from '../../models/account';
import { APP_ENV } from '../../constants/env';
import { jwtParse } from '../../utilities/jwtParser';


const storedToken: string | null = localStorage.getItem(APP_ENV.ACCESS_KEY);
const initialState: IUserState = {
    user: storedToken ? jwtParse(storedToken) : null,
    token: storedToken
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setCredentials: (state, action: { payload: { token: string } }) => {
            const { token } = action.payload
            state.user = token ? jwtParse(token) : null;
            state.token = token
            if(state.user !== null && state.user.roles.includes('User')){
                localStorage.setItem(APP_ENV.ACCESS_KEY,token);
            }
        },
        logOut: (state) => {
            if(state.user !== null && state.user.roles.includes('User')){
                localStorage.removeItem(APP_ENV.ACCESS_KEY);
            }
            state.user = null
            state.token = null
        },
    },
})

export const isAdmin = (state: { user: IUserState }): boolean => state.user.user !== null && state.user.user.roles.includes('Admin')
export const isUser = (state: { user: IUserState }): boolean => state.user.user !== null && state.user.user?.roles.includes('User')
export const getUser = (state: { user: IUserState }) => state.user.user
export const getToken = (state: { user: IUserState }) => state.user.token
export const { setCredentials, logOut } = userSlice.actions
export default userSlice.reducer