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
        <div>
            <div className="flex gap-1 p-1 ">
                <div><img className="h-10 w-10" src={avatar} alt="avatar" /></div>
                <div>{recipientUser?.name}</div>
                <div>Text message</div>
            </div>
            <div className="flex gap-1 p-1">
                <div>sendate</div>
                <div>1</div>
                <span>online status</span>
            </div>
        </div>
    )
}
