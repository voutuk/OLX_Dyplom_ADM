import { useSelector } from "react-redux";
import { getAuth } from "../../store/slices/userSlice";
import { Navigate, Outlet } from "react-router-dom";
import Error from "../../pages/error";

const ProtectedRoutes = ({ requiredRole }: { requiredRole?: string | string[] }) => {
    const { roles, isAuth } = useSelector(getAuth);
    if (!isAuth) return <Navigate to="/login" replace />;
    let alow: boolean | undefined = true;
    if (requiredRole) {
         alow = Array.isArray(requiredRole)
         ? roles.some(role => requiredRole.includes(role)) 
         : roles.includes(requiredRole as string)
    }
    return alow
        ? <Outlet />
        : <Error
            status="403"
            title="403"
            subTitle="Вибачте, ви не маєте прав для доступу до цієї сторінки."
        />;
};

export default ProtectedRoutes;