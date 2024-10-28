import { createContext, useContext, useEffect, useState } from "react";
import { baseUrl, getFromApi } from "../utils/services";
import { User } from "./AuthContext";

type UserChat = {
    _id: string,
    members: Array<Object>
};

type ChatsError = {
    error: boolean
    response: Response,

} | null;


type Props = {
    children: React.ReactNode,
    user: User
};

interface ChatContextType {
    userChats: UserChat | null;
    isUserChatsLoading: boolean;
    userChatsError: ChatsError | null;
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

const ChatProvider = ({ children, user }: Props) => {
    const [userChats, setUserChats] = useState(null);
    const [isUserChatsLoading, setIsUserChatsLoading] = useState(false);
    const [userChatsError, setUserChatsError] = useState(null);

    const getUserChats = async () => {
        console.log(user, user?._id);

        if (user?._id) {
            setIsUserChatsLoading(true);
            setUserChatsError(null);

            const response = await getFromApi(`${baseUrl}/chats/${user?._id}`);
            setIsUserChatsLoading(false);
            if (response.error) {
                console.log('error loading chat', response.error);
                return setUserChatsError(response); //todo check returns
            }
            console.log(userChats);

            setUserChats(response);
        }
    }
    useEffect(() => {
        console.log('getting chat useEffect');

        getUserChats();
    }, [])

    return (
        <ChatContext.Provider
            value={{
                userChats,
                isUserChatsLoading,
                userChatsError,

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