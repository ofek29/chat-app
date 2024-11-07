import { AllUsersChats } from "../components/Chat/AllUsersChats";
import { ChatBox } from "../components/Chat/ChatBox";
import { UsersChat } from "../components/Chat/UsersChat";
import { useAuth } from "../context/AuthContext";
import { useChat } from "../context/chatContext";

export const Chat = () => {
    const { userChats, isUserChatsLoading, updateCurrentChat } = useChat();
    const { user } = useAuth();
    return (
        <div className="bg-[#0c1821] h-[calc(100vh-4rem)]  flex justify-center items-center ">
            {!userChats ? null : (
                <div
                    className="bg-[#1b2a41] h-[75%] w-[80%] p-4 gap-2 border border-gray-600 flex flex-row justify-between text-white rounded-xl">
                    <div className="w-[20%] border-r">
                        <AllUsersChats />
                    </div>
                    <div className="w-[30%] border-r ">
                        {isUserChatsLoading && <p>Loading chats...</p>}
                        {userChats?.map((chat, index) => {
                            return (
                                <div
                                    onClick={() => updateCurrentChat(chat)}
                                    key={index}>
                                    <UsersChat chat={chat} user={user} />
                                </div>
                            )
                        })}
                    </div>

                    <ChatBox />

                </div >

            )}

        </div>
    )
}