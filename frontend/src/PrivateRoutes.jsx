import {Navigate, Outlet} from "react-router-dom";


const PrivateRoutes = () => {
    let token = document.cookie.split("; ").find((cookie) => cookie.startsWith("token="));

    return (
        token ? <Outlet /> : <Navigate to="/login" />
    )
}

export default PrivateRoutes;