import { isRejectedWithValue, Middleware, MiddlewareAPI } from '@reduxjs/toolkit';
import { setError, setRedirect } from '../slices/appSlice';
import { IError } from '../../models/errors';
import { toast } from 'react-toastify';


const errorMiddleware: Middleware = (api: MiddlewareAPI) => (next) => (action) => {
    if (isRejectedWithValue(action)) {
        const error: IError = action.payload as IError;
        switch (error.status) {
            case 403:
            case 423:
            case 400:
                toast(error.data.message || error.data.Message, {
                    type: 'info'
                })
                if (error.data.Message && error.data.UnlockTime) {
                    toast(`До ${new Date(error.data.UnlockTime).toLocaleDateString()} ${new Date(error.data.UnlockTime).toLocaleTimeString()}`, {
                        type: 'info'
                    })
                }
                break;
            case 401:
                api.dispatch(setRedirect('/'))
                break;
            default:
                api.dispatch(setError(error))
        }
    }
    return next(action);
};

export default errorMiddleware;


