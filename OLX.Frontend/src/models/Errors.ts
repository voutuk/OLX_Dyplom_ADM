export interface ILoginErrorData {
    status: number
    data: IUserLockoutError
}

export interface IUserLockoutError {
    message: string | undefined
    Message: string | undefined
    UnlockTime: string | undefined
}