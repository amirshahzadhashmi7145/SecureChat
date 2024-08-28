const SenderMessage = ({text}) => {
    return (
        <div className="flex justify-start mb-4">
            <img
                src="https://avatar.iran.liara.run/public"
                alt=""
                className="mt-1.5 object-cover h-9 w-9 rounded-full"
            />
            <div
                className="ml-2 py-3 px-4 bg-gray-400 rounded-br-3xl rounded-tr-3xl rounded-tl-3xl text-white">
                {text}
            </div>
        </div>
    )
}

export default SenderMessage;