import { ChatBox } from "../components/Chat/ChatBox";
import { UsersChat } from "../components/Chat/UsersChat";
import { useAuth } from "../context/AuthContext";
import { useChat } from "../context/chatContext";

export const Chat = () => {
    const { userChats, isUserChatsLoading, updateCurrentChat } = useChat();
    const { user } = useAuth();
    return (
        <div>
            {!userChats ? null : (
                <div className="flex flex-row items-center gap-2 border-4 border-red-200">
                    <div className="border-4 border-red-500">
                        {isUserChatsLoading && <p>Loading chats...</p>}
                        {userChats?.map((chat, index) => {
                            return (
                                <div onClick={() => updateCurrentChat(chat)} key={index}>
                                    <UsersChat chat={chat} user={user} />
                                </div>
                            )
                        })}
                    </div>

                    <div className="border-4 border-red-700">
                        <ChatBox />
                    </div>
                </div >
            )}
        </div >
    )
}