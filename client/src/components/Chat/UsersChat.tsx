import { getRecipientUser } from "../../hooks/getRecipient";
import { UserChat } from "../../types/chat.types"
import { User } from "../../types/user.types"
import avatar from '../../assets/avatar1.svg';
import { useChat } from "../../context/chatContext";

type UsersChatProps = {
    chat: UserChat;
    user: User;
};

export const UsersChat: React.FC<UsersChatProps> = ({ chat, user }) => {
    const { recipientUser } = getRecipientUser(chat, user);
    const { onlineUsers } = useChat();

    const isOnline = onlineUsers?.some((user) => user?.userId === recipientUser?._id)

    return (
        <div className="w-[20%] min-w-[200px] border-b-[0.5px] border-gray-500 " >
            <div className="flex items-center gap-3 p-2 w-full">
                <img className="h-8 w-8 rounded-full" src={avatar} alt="avatar" />
                <div className="w-full truncate">
                    <p className="font-semibold">{recipientUser?.name}</p>
                    <div className="flex items-center justify-between gap-2">
                        <div className="text-gray-400 " >Text message</div>
                        <span className={isOnline ? "h-2 w-2 bg-green-500 rounded-full" : ""}></span>
                    </div>
                </div>

            </div>


            {/* <div className="flex gap-1 p-1">
                <div>senDate</div>
                <div>1M</div>
                <span>online-status</span>
            </div> */}
        </div >
    )
}
