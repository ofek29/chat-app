import { AllUsersChats } from "../components/Chat/AllUsersChats";
import { ChatBox } from "../components/Chat/ChatBox";
import { UsersChat } from "../components/Chat/UsersChat";
import { useAuth } from "../context/AuthContext";
import { useChat } from "../context/chatContext";

export const Chat = () => {
    const { userChats, isUserChatsLoading, updateCurrentChat } = useChat();
    const { user } = useAuth();
    return (
        <div className="bg-[#192339] h-[calc(100vh-4rem)] flex justify-center ">

            <div className="flex justify-center h-[500px] w-[800px] border border-red-600 ">
                {!userChats ? null : (
                    <div className="flex flex-row gap-2  text-white">
                        <div>
                            <AllUsersChats />
                        </div>
                        <div className="border-2 h-auto max-h-fit ">
                            {isUserChatsLoading && <p>Loading chats...</p>}
                            {userChats?.map((chat, index) => {
                                return (
                                    <div
                                        className="border"
                                        onClick={() => updateCurrentChat(chat)}
                                        key={index}>
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
        </div>
    )
}