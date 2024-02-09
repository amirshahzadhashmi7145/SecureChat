import './App.css'
import Login from "./components/Login.jsx";
import {Routes,Route} from "react-router-dom";
import Signup from "./components/Signup.jsx";
import ChatHome from "./components/chat/ChatHome.jsx";
import PrivateRoutes from "./PrivateRoutes.jsx";

function App() {
  return (
      <div>
          <Routes>
              <Route element={<PrivateRoutes />}>
                  <Route path="/chat" element={<ChatHome />} />
              </Route>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
          </Routes>
      </div>
)
}

export default App
