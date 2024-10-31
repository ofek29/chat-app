import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { baseUrl, fetchFromApi, getFromApi } from "../utils/services";
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

    sendTextMessage: (textMessage: string, sender: string | undefined, chatId: string | undefined, setTextMessage: React.Dispatch<React.SetStateAction<string>>) => void;
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

const ChatProvider = ({ children, user }: Props) => {
    const [userChats, setUserChats] = useState(null);
    const [isUserChatsLoading, setIsUserChatsLoading] = useState(false);
    const [userChatsError, setUserChatsError] = useState(null);
    const [currentChat, setCurrentChat] = useState<UserChat | null>(null);
    const [messages, setMessages] = useState<Message[] | null>(null);
    const [isMessagesLoading, setIsMessagesLoading] = useState(false);
    const [messagesError, setMessagesError] = useState<ChatsError | null>(null);

    const [sendMessageError, setSendMessageError] = useState<ChatsError>(null);
    const [newMessage, setNewMessage] = useState(null);
    console.log(messages);


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

    const sendTextMessage = useCallback(
        async (textMessage: string, sender: string | undefined, chatId: string | undefined, setTextMessage: React.Dispatch<React.SetStateAction<string>>) => {
            if (!textMessage) {
                return console.log('you must type a text message');
            }
            const response = await fetchFromApi(`${baseUrl}/messages`, JSON.stringify({
                content: textMessage,
                senderId: sender,
                chatId: chatId
            }))
            if (response.error) {
                return setSendMessageError(response);
            }
            console.log(response, ' res');

            setNewMessage(response);
            setMessages((prev: Message[] | null) => {
                if (prev === null) {
                    return null;
                }
                return [...prev, response];
            });
            setTextMessage('');
        }, [],)


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
                sendTextMessage,
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