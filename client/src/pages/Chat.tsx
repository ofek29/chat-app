import { AllUsersChats } from "../components/Chat/AllUsersChats";
import { ChatBox } from "../components/Chat/ChatBox";
import { UsersChat } from "../components/Chat/UsersChat";
import { useAuth } from "../context/AuthContext/useAuth";
import { useChat } from "../context/ChatContext/useChat";

export const Chat = () => {
    const { userChats, isUserChatsLoading, updateCurrentChat } = useChat();
    const { user } = useAuth();
    return (
        <div className="bg-[#131313] h-[calc(100vh-4rem)]  flex justify-center items-center ">
            {!userChats ? null : (
                <div
                    className="bg-[#1f2329] h-[75%] w-[80%] p-4 gap-2 border border-gray-600 flex flex-row justify-between text-white rounded-xl">

                    <AllUsersChats />
                    <div>
                        {isUserChatsLoading && <p>Loading chats...</p>}
                        {userChats?.map((chat, index) => {
                            return (
                                <div
                                    key={index}
                                    onClick={() => updateCurrentChat(chat)}
                                >
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