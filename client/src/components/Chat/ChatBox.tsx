import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../context/AuthContext"
import { useChat } from "../../context/chatContext";
import { getRecipientUser } from "../../hooks/getRecipient";
import { LoadingSpinner } from "../ui/LoadingSpinner";

export const ChatBox = () => {
    const { user } = useAuth();
    const { currentChat, messages, isMessagesLoading, sendTextMessage } = useChat();
    const { recipientUser } = getRecipientUser(currentChat, user);
    const [textMessage, setTextMessage] = useState<string>('');

    //auto scroll to bottom of chat 
    const chatBoxRef = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
        if (chatBoxRef.current) {
            chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        }
    }, [messages]);

    if (!recipientUser) return (
        <p className="w-[50%] text-center relative top-[50%] text-xl">
            Select chat...
        </p>
    )
    if (isMessagesLoading) return <LoadingSpinner text='Loading messages...' />;

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

    return (<>
        <div className="w-[50%] min-w-[300px] h-full ">
            <div className="text-2xl font-semibold shadow-lg text-center rounded-t-md  h-10">
                {recipientUser?.name}
            </div>

            <div className="h-[calc(100%-7rem)] overflow-scroll scroll-smooth flex flex-col" //add this to users list?
                ref={chatBoxRef}>
                {messages && messages.map((message, index) =>
                    <div key={index}
                        className={`my-1 mx-2 px-2 py-2 text-center
                    ${message?.senderId === user?._id
                                ? 'bg-[#6b87fd] text-white self-end rounded-l-2xl rounded-tr-xl'
                                : 'bg-[#2e333d] text-white self-start rounded-r-2xl rounded-tl-xl'
                            }`} >
                        <div className="text-l font-medium break-words hyphens-auto max-w-60">{message.content}</div>
                        <div className="text-xs font-thin text-right">{formatDate(message.createdAt)}</div>
                    </div>)}
            </div>
            <div className="text-xl p-4 shadow-lg rounded-lg text-[#a2a7b3] flex flex-row items-end"  >
                <input
                    className="w-full px-3 py-1 bg-inherit rounded-l-md focus:outline-none"
                    type="text"
                    onChange={handleInputChange}
                    onKeyDown={handleEnterPress}
                    value={textMessage}
                    placeholder="Type your message..."
                />
                <button
                    className="px-3 py-1 rounded-r-md hover:border border-gray-500 transition duration-300 "
                    onClick={() => sendTextMessage(textMessage, user?._id, currentChat?._id, setTextMessage)}>
                    send
                </button>
            </div>

        </div >
    </>
    )
}
