import { createContext } from "react";
import { User } from "../../types/user.types";
import { ChatsError, Message, OnlineUsers, UserChat } from "../../types/chat.types";

interface ChatContextType {
    userChats: UserChat[] | null;
    isUserChatsLoading: boolean;
    userChatsError: ChatsError | null;
    currentChat: UserChat | null;
    updateCurrentChat: (chat: UserChat) => void;
    messages: Message[] | null;
    isMessagesLoading: boolean;
    messagesError: ChatsError | null;
    createChat: (firstId: string | undefined, secondId: string | undefined) => void;
    allUsers: User[];
    sendTextMessage: (textMessage: string, sender: string | undefined, chatId: string | undefined, setTextMessage: React.Dispatch<React.SetStateAction<string>>) => void;
    onlineUsers: OnlineUsers | undefined;
    newMessage: Message | null;
    updateLastMessage: Message | null;
};

export const ChatContext = createContext<ChatContextType | undefined>(undefined);

