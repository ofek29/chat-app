import { GetRecipientUser } from "../../hooks/getRecipient";
import { Message, UserChat } from "../../types/chat.types"
import { User } from "../../types/user.types"
import avatar from '../../assets/avatar1.svg';
import { useChat } from "../../context/ChatContext/useChat";
import { GetLastMessage } from "../../hooks/getLastMessage";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useEffect, useState } from "react";
dayjs.extend(relativeTime);

type UsersChatProps = {
    chat: UserChat;
    user: User;
};

export const UsersChat: React.FC<UsersChatProps> = ({ chat, user }) => {
    const { recipientUser } = GetRecipientUser(chat, user);
    const { onlineUsers, updateLastMessage } = useChat();
    const [lastMessage, setLastMessage] = useState<Message | null>(null);

    // Update last message with db last message
    const last = GetLastMessage(chat);
    useEffect(() => {
        setLastMessage(last);
    }, [last]);

    // Update last message with new message from socket
    useEffect(() => {
        if (updateLastMessage && updateLastMessage.chatId === chat._id) {
            setLastMessage(updateLastMessage);
        }
    }, [updateLastMessage, chat]);

    // update online status from socket
    const isOnline = onlineUsers?.some((user) => user?.userId === recipientUser?._id)

    // get better timestamps for messages
    const getTime = () => {
        const timeDiff = dayjs(lastMessage?.createdAt).diff(new Date(Date.now()), 'days');
        if (timeDiff <= - 3) {
            return dayjs(lastMessage?.createdAt).format('DD/MM/YY');
        }
        return dayjs(lastMessage?.createdAt).fromNow(true);
    }
    return (
        <div className="w-[20%] min-w-[300px] border-b-[0.5px] border-gray-500 " >
            <div className="flex items-center gap-3 p-2 w-full">
                <img className="h-8 w-8 rounded-full" src={avatar} alt="avatar" />
                <div className="w-full truncate">
                    <div className="flex items-center justify-between gap-2">
                        <p className="font-semibold">{recipientUser?.name}</p>
                        <span className={isOnline ? "h-2 w-2 bg-green-500 rounded-full" : ""}></span>
                    </div>
                    <div className="font-light text-gray-300 flex items-center justify-between gap-2">
                        <div className=" truncate " >{lastMessage?.content}</div>
                        {lastMessage?.content &&
                            <div>{getTime()}</div>}
                    </div>
                </div>
            </div>
        </div >
    )
}
