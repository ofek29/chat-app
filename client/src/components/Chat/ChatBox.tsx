import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../context/AuthContext"
import { useChat } from "../../context/chatContext";
import { getRecipientUser } from "../../hooks/getRecipient";

export const ChatBox = () => {
    const { user } = useAuth();
    const { currentChat, messages, isMessagesLoading, sendTextMessage } = useChat();
    const { recipientUser } = getRecipientUser(currentChat, user);
    const [textMessage, setTextMessage] = useState<string>('');

    //auto scroll to new message
    const chatBoxRef = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
        if (chatBoxRef.current) {
            chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        }
    }, [messages]);

    if (!recipientUser) return (
        <p>
            Select chat...
        </p>
    )
    if (isMessagesLoading) return <p>Loading messages...</p>

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTextMessage(e.target.value);
    };

    const handleEnterPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter') {
            sendTextMessage(textMessage, user?._id, currentChat?._id, setTextMessage);
        }
    };

    const formatDate = (isoString: string) => {
        const messageDate = new Date(isoString);
        const today = new Date();
        const isToday =
            messageDate.getDate() === today.getDate() &&
            messageDate.getMonth() === today.getMonth() &&
            messageDate.getFullYear() === today.getFullYear();

        if (isToday) {
            return `Today ${messageDate.toLocaleTimeString('en-il', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            })}`;
        }
        return messageDate.toLocaleString('en-il', {
            hour: '2-digit',
            minute: '2-digit',
            day: '2-digit',
            month: '2-digit',
            hour12: false,
        }).replace(',', '');
    };


    return (
        <div className="w-[400px]  shadow-xl bg-[#374151]">
            <div className="text-2xl font-semibold text-white text-center rounded-t-md bg-blue-500 h-10">
                {recipientUser?.name}
            </div>
            <div className="overflow-y-auto scroll-smooth max-h-96 flex flex-col " //add this to users list?
                ref={chatBoxRef}>
                {messages && messages.map((message, index) =>
                    <div key={index}
                        className={`my-1 mx-2 px-2 py-1 rounded-lg text-center
                    ${message?.senderId === user?._id
                                ? 'bg-blue-500 text-white self-end'
                                : 'bg-gray-300 text-black self-start'
                            }`} >
                        <div className="text-l font-medium break-words hyphens-auto max-w-60">{message.content}</div>
                        <div className="text-sm">{formatDate(message.createdAt)}</div>

                    </div>)}
            </div>

            <div className="text-xl p-4 border-t flex flex-row items-end"  >
                <input
                    className="w-full px-3 py-1 text-black border rounded-l-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    type="text"
                    onChange={handleInputChange}
                    onKeyDown={handleEnterPress}
                    value={textMessage}
                    placeholder="Type your message..."
                />
                <button
                    className=" bg-blue-500  px-3 py-1 rounded-r-md hover:bg-blue-600 transition duration-300"
                    onClick={() => sendTextMessage(textMessage, user?._id, currentChat?._id, setTextMessage)}>
                    send
                </button>
            </div>
        </div >
    )
}
