import { useAuth } from "../../context/AuthContext";
import { useChat } from "../../context/chatContext"

export const AllUsersChats = () => {
    const { allUsers, createChat } = useChat();
    const { user } = useAuth();

    return (
        <div>
            <div
                className="w-11/12 bg-[#5E6673] text-lg font-medium rounded m-2 p-2 border border-gray-400">

                <p className="mb-2 border-b-2 border-gray-400">Send new chat:</p>
                {allUsers && allUsers.map((currUser, index) => {
                    return (
                        <div className="text-center mb-1 py-1 px-2 border rounded-lg" key={index} onClick={() => createChat(user?._id, currUser?._id)}>
                            {currUser?.name}
                        </div>
                    )
                })}
            </div>

        </div>
    )
}
