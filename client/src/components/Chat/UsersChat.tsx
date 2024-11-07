import { getRecipientUser } from "../../hooks/getRecipient";
import { UserChat } from "../../types/chat.types"
import { User } from "../../types/user.types"
import avatar from '../../assets/avatar1.svg';

type UsersChatProps = {
    chat: UserChat;
    user: User;
};

export const UsersChat: React.FC<UsersChatProps> = ({ chat, user }) => {
    const { recipientUser } = getRecipientUser(chat, user);

    return (
        <div className="w-[20%] min-w-[200px] border-b-[0.5px] border-gray-500" >
            <div className="flex items-center gap-3 p-2 ">
                <img className="h-10 w-10 rounded-full" src={avatar} alt="avatar" />
                <div>
                    <p className="font-semibold">{recipientUser?.name}</p>
                    <div className="text-gray-400 truncate" >Text message</div>
                </div>
            </div>
            {/* <div className="flex gap-1 p-1">
                <div>senDate</div>
                <div>1M</div>
                <span>online-status</span>
            </div> */}
        </div>
    )
}
