import ChatUsers from "./ChatUsers.jsx";
import YourMessage from "./YourMessage.jsx";
import SenderMessage from "./SenderMessage.jsx";
import ChatHeader from "./ChatHeader.jsx";
import {useEffect, useRef, useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import {io} from 'socket.io-client';
const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;
const socket = io(`${baseUrl}`,{
    withCredentials: true,
    autoConnect: false
})
import {v4 as uuidv4} from "uuid";

const Chat = () => {
    const myRef = useRef(null);

    const navigate = useNavigate();

    const [userId,setUserId] = useState('');
    const recipientId = useSelector(state => state.selectedRecipient.recipientId);
    const [users,setUsers] = useState([]);
    const [messages,setMessages] = useState([]);
    const [message,setMessage] = useState('');

    const generateUniqueId = () => {
        return uuidv4();
    };


    useEffect(() => {
        axios.get(`${baseUrl}/api/getCurrentUserId`, {withCredentials: true})
            .then((response) => {
                setUserId(response.data.userId)

                socket.connect();
                socket.on("connect", async () => {
                    await socket.emit("joinRoom", {roomName: response.data.userId});
                })

                let userId = response.data.userId;

                axios.get(`${baseUrl}/auth/api/getAllUsers`, {withCredentials: true})
                    .then((response) => {
                        if (response) {
                            const users = response.data.filter(user => user._id !== userId);
                            setUsers(users)
                        }
                    })
                    .catch((error) => {
                        if (error.response.status === 401) {
                            alert("Plz Login again!")
                            navigate("/login");
                        } else {
                            alert("Something happened on our side");
                            navigate("/login");
                        }
                    })

            })
            .catch(() => {
                alert("Some Error Occured")
                navigate('/login')
            })

        socket.on('disconnect',() => {
            socket.disconnect();
            console.log("Socket disconnected")
        })
    }, []);

    useEffect(() => {
        if(recipientId !== "") {
            if(userId !== ""){
                axios.get(`${baseUrl}/auth/api/${userId}/${recipientId}`,{withCredentials:true})
                    .then((response) => {setMessages(response.data)})
            }
        }
    }, [recipientId]);

    useEffect(() => {
        const newMessage = (data) => {
            console.log("New Message " + data.message);
            const count = generateUniqueId();
            setMessages((prevMessages) => [...prevMessages, {_id:count.toString(), senderId: data.senderId, recipientId: data.receiverId, text: data.message}]);
            myRef.current.scrollIntoView(false,{behavior: "smooth",block: "end"});
        }

        socket.on("newMessage",newMessage);

        // Clean up event listeners when component unmounts
        return () => {
            socket.off("newMessage",newMessage);
        }
    }, [socket]);

    const handleSend = async (event) => {
        if(event.key === 'Enter'){
            const count = generateUniqueId();
            setMessages((prevState) => [...prevState,{_id: count.toString(),senderId:userId,recipient:recipientId,text:message}])
            await socket.emit('privateMessage',{message:message,receiverId:recipientId,senderId:userId});
            await axios.post(`${baseUrl}/auth/api/sendMessage`,{senderId:userId,recipient:recipientId,text:message},{withCredentials:true});
            setMessage('');
            myRef.current.scrollIntoView(false,{behavior: "smooth",block: "end"});
        }
    }

    return (
        <div className="container mx-auto shadow-lg rounded-lg h-[88vh]">

            <ChatHeader />

            {/*chatting*/}
            <div className="flex flex-row justify-between bg-white h-[88vh]">

                {/*chat list*/}
                <div className="flex flex-col w-2/5 border-r-2 overflow-y-auto">

                    {/*search chatlist*/}
                    <div className="border-b-2 py-4 px-2">
                        <input
                            type="text"
                            placeholder="search chatting"
                            className="bg-white px-2 py-2 border-2 border-gray-200 rounded-2xl w-full"
                        />
                    </div>
                    {/*end search here*/}

                    {/*userlist chatlist*/}
                    <div className="max-h-full border-b-2 border-gray-300 overflow-y-auto">

                        {users.length !== 0 ? (
                            users.map((user) => (
                                <ChatUsers name={user.name} username={user.username} id={user._id} key={user._id}/>
                            ))
                        ) : (
                            <p>No User Found!</p>
                        )}

                    </div>
                    {/*userlist chatlist end*/}

                </div>
                {/*chatlist end here*/}


                {/*messages*/}
                <div className="w-full px-5 flex flex-col justify-between cursor-all-scroll">
                    <div className="flex flex-col mt-5 overflow-y-auto">

                        <div ref={myRef}>
                            {messages.length !== 0 ? (
                                messages.map((message) => (
                                    message.senderId === userId ? (
                                        <YourMessage key={message._id} text={message.text} />
                                    ) : (
                                        <SenderMessage key={message._id} text={message.text} />
                                    )
                                ))
                            ) : (
                                <YourMessage text="Let's start Conversation" />
                            )}
                        </div>


                    </div>
                    <div className="py-5">
                        <input
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="w-full bg-gray-300 py-5 px-3 rounded-xl text-gray-900"
                            type="text"
                            placeholder="type your message here..."
                            onKeyDown={handleSend}
                        />
                    </div>
                </div>
                {/*messages end here*/}


            </div>
            {/*chatting end here*/}
        </div>
    )
}

export default Chat;