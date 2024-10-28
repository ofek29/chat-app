import { useChat } from "../context/chatContext";

export const Chat = () => {

    const { userChats, isUserChatsLoading, userChatsError } = useChat();
    console.log(userChats);

    if (userChats) {

        let leng = Object.keys(userChats).length;
        if (leng < 1) {

        }
    }
    // console.log('userChats:', userChats);

    return (
        <div>
            {userChats && (
                <div>
                    <div>list</div>
                    <div>Chatbox</div>



                </div>
            )}
        </div>
    )
}
