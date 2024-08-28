import './App.css'
import Login from "./components/Login.jsx";
import {createBrowserRouter,RouterProvider} from "react-router-dom";
import Signup from "./components/Signup.jsx";
import ChatHome from "./components/chat/ChatHome.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";

const router = createBrowserRouter([
    {
        path: '/login',
        element: <Login />,
    },
    {
        path: '/signup',
        element: <Signup />,
    },
    {
        path: '/',
        element:
           <ProtectedRoute>
               <ChatHome />
           </ProtectedRoute>
    }
])

function App() {
  return (
      <RouterProvider router={router} />
)
}

export default App
