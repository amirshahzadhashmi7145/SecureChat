import axios from 'axios'
import {useNavigate} from "react-router-dom";
const ChatHeader = () => {
    const navigate = useNavigate();
    const handleClick = (e) => {
        e.preventDefault();
        axios.post('http://localhost:8000/logout',{},{withCredentials:true}).then(response => {
            if(response.status === 200){
                alert("Good Bye!")
                navigate('/login')
            }
        })
            .catch(() => {
                alert("Some Error Occured");
            })
    }

    return (
        <div className="px-5 py-5 flex justify-between items-center bg-white border-b-2">
            <div className="font-semibold text-2xl text-blue-600">SecureChat</div>

            <div className="flex flex-row justify-between space-x-4">
                <div onClick={handleClick} className="bg-blue-500 hover:bg-blue-950 text-white font-bold pt-3 px-4 rounded">
                    Logout
                </div>

                <div
                    className="h-12 w-12 p-2 bg-yellow-500 rounded-full text-white font-semibold flex items-center justify-center"
                >
                    RA
                </div>
            </div>

        </div>
    )
}

export default ChatHeader;