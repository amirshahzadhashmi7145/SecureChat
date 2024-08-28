import {Navigate} from 'react-router-dom';

const ProtectedRoute = ({children}) => {
    const token = document.cookie.split("; ").find((cookie) => cookie.startsWith("token="));
    if(!token) {
        return <Navigate to="/login" replace />
    }
    return children;
}

export default ProtectedRoute;