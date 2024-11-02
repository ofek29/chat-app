import { useAuth } from "../../context/AuthContext";
import { useChat } from "../../context/chatContext"

export const AllUsersChats = () => {
    const { allUsers, createChat } = useChat();
    const { user } = useAuth();

    return (
        <div>
            <div>
                {allUsers && allUsers.map((currUser, index) => {
                    return (
                        <div key={index} onClick={() => createChat(user?._id, currUser?._id)}>
                            {currUser?.name}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
