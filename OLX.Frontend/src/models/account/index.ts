export interface IUser {
    id: number
    firstName: string
    lastName: string
    email: string
    photo: string
    exp: number
    roles:string[],
    phone:string
}

export interface IUserState {
    user: IUser | null
    token: string | null
}

export interface IAuthResponse{
    accessToken:string
}

export interface ILoginRequest{
    email:string,
    password:string
}