import { ChatBox } from "../components/Chat/ChatBox";
import { UsersChat } from "../components/Chat/UsersChat";
import { useAuth } from "../context/AuthContext";
import { useChat } from "../context/chatContext";

export const Chat = () => {
    const { userChats, isUserChatsLoading, updateCurrentChat } = useChat();
    const { user } = useAuth();
    return (
        <div className="flex justify-center  ">
            {!userChats ? null : (
                <div className="flex flex-row gap-2 ">
                    <div className="border-4 ">
                        {isUserChatsLoading && <p>Loading chats...</p>}
                        {userChats?.map((chat, index) => {
                            return (
                                <div
                                    className="border"
                                    onClick={() => updateCurrentChat(chat)} key={index}>
                                    <UsersChat chat={chat} user={user} />
                                </div>
                            )
                        })}
                    </div>

                    <div className="">
                        <ChatBox />
                    </div>
                </div >
            )}
        </div >
    )
}