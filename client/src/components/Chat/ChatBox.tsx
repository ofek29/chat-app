import { useRef, useState } from "react";
import { useAuth } from "../../context/AuthContext/useAuth"
import { useChat } from "../../context/ChatContext/useChat";
import { GetRecipientUser } from "../../hooks/getRecipient";
import { LoadingSpinner } from "../ui/LoadingSpinner";

import dayjs from "dayjs";
import calendar from "dayjs/plugin/calendar";
dayjs.extend(calendar);


export const ChatBox = () => {
    const { user } = useAuth();
    const { currentChat, messages, isMessagesLoading, sendTextMessage } = useChat();
    const { recipientUser } = GetRecipientUser(currentChat, user);
    const [textMessage, setTextMessage] = useState<string>('');

    //auto scroll to bottom of chat box
    const chatBoxRef = useRef<HTMLDivElement | null>(null);
    const setChatBoxRef = (element: HTMLDivElement | null) => {
        chatBoxRef.current = element;
        if (chatBoxRef.current) {
            chatBoxRef.current.scrollTo(0, chatBoxRef.current.scrollHeight);
        }
    };

    if (!recipientUser || !currentChat) return (
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

    const formatDate = (sentDate: string) => {
        const messageDate = dayjs(sentDate);
        const today = dayjs();

        if (messageDate.isSame(dayjs(), 'day')) {
            return `Today ${messageDate.format('HH:mm')}`;
        } else if (messageDate.isAfter(today.subtract(10, 'day'))) {
            return messageDate.format('DD:MM HH:mm');
        } else {
            return messageDate.format('DD/MM/YYYY HH:mm');
        }
    };

    return (<>
        <div className="w-[50%] min-w-[300px] h-full ">
            <div className="text-2xl font-semibold shadow-lg text-center rounded-t-md  h-10">
                {recipientUser?.name}
            </div>
            <div className="h-[calc(100%-7rem)] overflow-scroll scroll-smooth flex flex-col"
                ref={setChatBoxRef}>
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
