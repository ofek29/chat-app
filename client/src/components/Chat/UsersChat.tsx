import { getRecipientUser } from "../../hooks/getRecipient";
import { UserChat } from "../../types/chat.types"
import { User } from "../../types/user.types"
import avatar from '../../assets/avatar1.svg';
import { useChat } from "../../context/ChatContext";
import { getLastMessage } from "../../hooks/getLastMessage";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

type UsersChatProps = {
    chat: UserChat;
    user: User;
};

export const UsersChat: React.FC<UsersChatProps> = ({ chat, user }) => {
    const { recipientUser } = getRecipientUser(chat, user);
    const { onlineUsers } = useChat();
    const { lastMessage } = getLastMessage(chat);

    const isOnline = onlineUsers?.some((user) => user?.userId === recipientUser?._id)

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
