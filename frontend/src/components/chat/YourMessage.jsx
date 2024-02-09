const YourMessage = ({text}) => {
    return (
    <div className="flex justify-end mb-4">
        <div
            className="mr-2 py-3 px-4 bg-blue-400 rounded-bl-3xl rounded-tl-3xl rounded-tr-xl text-white">
            {text}
        </div>
        <img
            src="https://source.unsplash.com/vpOeXr5wmR4/600x600"
            alt=""
            className="mt-1.5 object-cover h-9 w-9 rounded-full"
        />
    </div>
    )
}

export default YourMessage;