import { useDispatch, useSelector } from "react-redux";
import { clearError, getRedirect } from "../../store/slices/appSlice";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";


const RedirectHendler: React.FC = () => {
    const redirect = useSelector(getRedirect);
    const navigator = useNavigate()
    const dispatcher = useDispatch();
    useEffect(() => {
        if (redirect) {
            navigator(redirect)
            dispatcher(clearError())
        }
    }, [redirect])
    return null
};
export default RedirectHendler;