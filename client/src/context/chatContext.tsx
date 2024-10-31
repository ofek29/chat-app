import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { baseUrl, getFromApi } from "../utils/services";
import { User } from "../types/user.types";
import { UserChat } from "../types/chat.types";

type Message = {
    _id: string;
    chatId: string;
    content: string;
    createdAt: string;
    senderId: string;
    updatedAt: string;
}


type ChatsError = {
    error: boolean
    response: Response,

} | null;


type Props = {
    children: React.ReactNode,
    user: User
};

interface ChatContextType {
    userChats: UserChat[] | null;
    isUserChatsLoading: boolean;
    userChatsError: ChatsError | null;
    currentChat: UserChat | null;
    updateCurrentChat: (chat: UserChat) => void;

    messages: Message[] | null;
    isMessagesLoading: boolean;
    messagesError: ChatsError | null;
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

const ChatProvider = ({ children, user }: Props) => {
    const [userChats, setUserChats] = useState(null);
    const [isUserChatsLoading, setIsUserChatsLoading] = useState(false);
    const [userChatsError, setUserChatsError] = useState(null);
    const [currentChat, setCurrentChat] = useState<UserChat | null>(null);
    const [messages, setMessages] = useState(null);
    const [isMessagesLoading, setIsMessagesLoading] = useState(false);
    const [messagesError, setMessagesError] = useState(null);

    useEffect(() => {
        const getUserChats = async () => {

            if (user?._id) {
                setIsUserChatsLoading(true);
                setUserChatsError(null);

                const response = await getFromApi(`${baseUrl}/chats/${user?._id}`);
                setIsUserChatsLoading(false);
                if (response.error) {
                    console.log('error loading chat', response.error);
                    return setUserChatsError(response); //todo check returns
                }

                setUserChats(response);
            }
        }
        getUserChats();
    }, [user]);

    useEffect(() => {
        const getMessages = async () => {
            if (user?._id) {
                setIsMessagesLoading(true);
                setMessagesError(null);

                const response = await getFromApi(`${baseUrl}/messages/${currentChat?._id}`);
                setIsMessagesLoading(false);
                if (response.error) {
                    console.log('error loading Messages', response.error);
                    return setMessagesError(response);
                }

                setMessages(response);
            }
        }
        getMessages();
    }, [currentChat]);

    const updateCurrentChat = useCallback((chat: UserChat) => {
        setCurrentChat(chat);
    }, []);

    return (
        <ChatContext.Provider
            value={{
                userChats,
                isUserChatsLoading,
                userChatsError,
                currentChat,
                updateCurrentChat,
                messages,
                isMessagesLoading,
                messagesError,
            }}
        >
            {children}
        </ChatContext.Provider>
    )
}

export const useChat = () => {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error('useChat must be used within an ChatContextProvider');
    }
    return context;
}

export default ChatProvider;