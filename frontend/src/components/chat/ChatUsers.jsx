import {useDispatch} from "react-redux";
import {selected} from "../../redux/actions/selectedRecipientAction.js";

const ChatUsers = ({name,username,id}) => {
    const dispatch = useDispatch();

    const handleClick = (e) => {
        e.preventDefault();
        dispatch(selected(id));
    }

    return (
        <div className="flex flex-row py-4 px-2 justify-center items-center border-b-2 cursor-pointer" onClick={handleClick}>
            <div className="w-1/4">
                <img
                    src="https://avatar.iran.liara.run/public"
                    alt=""
                    className="object-cover h-12 w-12 rounded-full"
                />
            </div>
            <div className="w-full text-start">
                <div className="text-lg font-semibold text-gray-900">{name}</div>
                <span className="text-gray-500">{username}</span>
            </div>
        </div>
    )
}

export default ChatUsers;