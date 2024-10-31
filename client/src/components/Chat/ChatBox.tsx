import { useState } from "react";
import { useAuth } from "../../context/AuthContext"
import { useChat } from "../../context/chatContext";
import { getRecipientUser } from "../../hooks/getRecipient";

export const ChatBox = () => {
    const { user } = useAuth();
    const { currentChat, messages, isMessagesLoading, sendTextMessage } = useChat();
    const { recipientUser } = getRecipientUser(currentChat, user);
    const [textMessage, setTextMessage] = useState<string>('');

    if (!recipientUser) return (
        <p>
            Select chat...
        </p>
    )
    if (isMessagesLoading) return <p>Loading messages...</p>

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTextMessage(e.target.value);
    };

    const formatDate = (isoString: string) => {
        const date = new Date(isoString);
        return date.toLocaleString('en-il', {
            hour: '2-digit',
            minute: '2-digit',
            day: '2-digit',
            month: '2-digit',
            hour12: false,
        }).replace(',', ''); // Remove comma to match desired format
    };



    return (
        <div className="w-[400px] flex flex-col shadow-xl ">
            <div className="text-2xl font-semibold text-white text-center rounded-t-md bg-blue-500 h-10">
                {recipientUser?.name}</div>

            {messages && messages.map((message, index) =>
                <div key={index}
                    className={`m-2 p-2 rounded-lg text-center
                    ${message?.senderId === user?._id
                            ? 'bg-blue-500 text-white self-end'
                            : 'bg-gray-300 text-black self-start'
                        }`} >
                    <div className="text-l font-medium">{message.content}</div>
                    <div className="text-sm">{formatDate(message.createdAt)}</div>

                </div>)}

            <div className="text-xl p-4 border-t flex"  >
                <input className="w-full px-3 py-1 border rounded-l-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    type="text"
                    onChange={handleInputChange}
                    value={textMessage}
                    placeholder="Type your message..."
                />
                <button className=" bg-blue-500 text-white px-3 py-1 rounded-r-md hover:bg-blue-600 transition duration-300"
                    onClick={() => sendTextMessage(textMessage, user?._id, currentChat?._id, setTextMessage)}>
                    send
                </button>
            </div>
        </div >
    )
}
