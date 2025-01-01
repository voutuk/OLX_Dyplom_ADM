import { useDispatch, useSelector } from "react-redux";
import { clearError, getRedirect } from "../../redux/slices/appSlice";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const RedirectHendler: React.FC = () => {
    const redirect = useSelector(getRedirect);
    const navigate = useNavigate()
    const dispatcher = useDispatch();
    useEffect(() => {
        if (redirect) {
            navigate(redirect)
            dispatcher(clearError())
        }
    }, [redirect])
    return null
};
export default RedirectHendler;