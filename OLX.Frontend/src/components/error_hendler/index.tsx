import { useDispatch, useSelector } from "react-redux";
import { clearError, getError } from "../../store/slices/appSlice";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";


const ErrorHendler: React.FC = () => {
    const error = useSelector(getError);
    const navigator = useNavigate()
    const location = useLocation();
    const dispatcher = useDispatch();
    useEffect(() => {
        if (error) {
            dispatcher(clearError())
            navigator('/error', {
                replace: false,
                state: {
                    title: isNaN(error.status) ? 'Упс...щось пішло не так ...' : error.status.toString(),
                    subTitle: error.message || "Нажаль сталася помилка ... :(",
                    status: isNaN(error.status) ? 500 : error.status,
                    location: location.pathname
                }
            })
        }
    }, [error])
    return null
};
export default ErrorHendler;