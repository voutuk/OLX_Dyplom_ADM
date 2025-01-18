import { isRejectedWithValue, Middleware, MiddlewareAPI } from '@reduxjs/toolkit';
import { setError, setRedirect } from '../slices/appSlice';
import { IError } from '../../models/errors';
import { toast } from 'react-toastify';
import { RootState } from '..';
import { logOut } from '../slices/userSlice';




const errorMiddleware: Middleware = (api: MiddlewareAPI) => (next) => (action) => {
    if (isRejectedWithValue(action)) {
        const error: IError = action.payload as IError;
        switch (error.status) {
            case 423:
                if (error.data?.Message && error.data?.UnlockTime) {
                    toast(`${error.data?.Message} до ${new Date(error.data.UnlockTime).toLocaleDateString()} ${new Date(error.data.UnlockTime).toLocaleTimeString()}`, {
                        type: 'info',
                        style: { width: 'fit-content' }
                    })
                }
                break;
            case 401:
                if ((api.getState() as RootState).user) {
                    api.dispatch(logOut())
                }
                else {
                    api.dispatch(setRedirect('/auth'))
                }
                break;
            case 400:
            case 404:
            case 403:
                if (error.data?.length && error.data?.length > 0) {
                    error.data?.forEach((element: any) => {

                        toast(`Error: "${element.ErrorMessage}"  Property: "${element.PropertyName}" Value: "${element.AttemptedValue}"`, {
                            type: 'error',
                            style: { width: 'fit-content' }
                        })
                    });
                }
                else {
                    toast(error.data?.message || error.message || error.data?.Message, {
                        type: 'info',
                        style: { width: 'fit-content' }
                    })
                }
                break;

            default:
                api.dispatch(setError(error))
        }
    }
    return next(action);
};

export default errorMiddleware;


