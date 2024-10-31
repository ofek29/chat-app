import { useAuth } from "../../context/AuthContext"
import { useChat } from "../../context/chatContext";
import { getRecipientUser } from "../../hooks/getRecipient";

export const ChatBox = () => {
    const { user } = useAuth();
    const { currentChat, messages, isMessagesLoading } = useChat();
    const { recipientUser } = getRecipientUser(currentChat, user);

    if (!recipientUser) return (
        <p>
            Select chat...
        </p>
    )
    if (isMessagesLoading) return <p>Loading messages...</p>

    return (
        <div>
            <div>{recipientUser?.name}</div>
            <div >
                {messages && messages.map((message, index) => <div key={index}>
                    <div>{message.content}</div>
                    <div>{message.createdAt}</div>
                </div>)}

            </div>

        </div>
    )
}
