import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { baseUrl, fetchFromApi, getFromApi } from "../utils/services";
import { User } from "../types/user.types";
import { UserChat } from "../types/chat.types";
import { io, Socket } from "socket.io-client";

type OnlineUsers = {
    userId: string,
    socketId: string,
}

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
    createChat: (firstId: string | undefined, secondId: string | undefined) => void;
    allUsers: User[];

    sendTextMessage: (textMessage: string, sender: string | undefined, chatId: string | undefined, setTextMessage: React.Dispatch<React.SetStateAction<string>>) => void;
    onlineUsers: OnlineUsers[];
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

const ChatProvider = ({ children, user }: Props) => {
    const [userChats, setUserChats] = useState<UserChat[] | null>(null);
    const [isUserChatsLoading, setIsUserChatsLoading] = useState(false);
    const [userChatsError, setUserChatsError] = useState(null);
    const [currentChat, setCurrentChat] = useState<UserChat | null>(null);
    const [messages, setMessages] = useState<Message[] | null>(null);
    const [isMessagesLoading, setIsMessagesLoading] = useState(false);
    const [messagesError, setMessagesError] = useState<ChatsError | null>(null);

    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [socket, setSocket] = useState<Socket | null>(null);
    const [onlineUsers, setOnlineUsers] = useState<OnlineUsers[]>([]);

    const [sendMessageError, setSendMessageError] = useState<ChatsError>(null);
    const [newMessage, setNewMessage] = useState<Message | null>(null);

    // connect to socket
    useEffect(() => {
        const newSocket = io('http://localhost:3020');
        setSocket(newSocket);
        return () => {
            newSocket.disconnect();
        };
    }, [user]);

    // update all online users
    useEffect(() => {
        if (socket === null) return;
        if (user) {
            socket.emit('addNewUser', user?._id);
        }
        socket.on('getOnlineUsers', (res) => {
            setOnlineUsers(res);
        })
        return () => {
            socket.off('getOnlineUsers');
        };
    }, [socket]);

    // socket send message
    useEffect(() => {
        if (socket === null) return;
        const recipientId = currentChat?.members.find((id) => id !== user?._id);
        socket.emit('sendMessage', { ...newMessage, recipientId });
    }, [newMessage]);

    // socket receive message
    useEffect(() => {
        if (socket === null) return;
        socket.on('receiveMessage', (message) => {
            if (currentChat?._id !== message.chatId) return;
            setMessages((prev) => {
                if (prev === null) {
                    return null;
                }
                return [...prev, message];
            });
        });
        return () => {
            socket.off('receiveMessage');
        };
    }, [socket, currentChat]);


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


    // all users. potential chats
    useEffect(() => {
        const getAllUsers = async () => {
            const response = await getFromApi(`${baseUrl}/users`);
            if (response.error) {
                return console.log('error loading all users', response);
            }

            const filterAllUsers = response.filter((curr: { _id: string | undefined; }) => {
                let isChat = false;
                if (user?._id === curr._id) return false;

                if (userChats) {
                    isChat = userChats?.some((chat) => {
                        return chat.members[0] === curr._id || chat.members[1] === curr._id;
                    })
                }
                return !isChat;
            });
            setAllUsers(filterAllUsers);
        }
        getAllUsers();
    }, [userChats]);

    // create new chat
    const createChat = useCallback(async (firstId: string | undefined, secondId: string | undefined) => {
        const response = await fetchFromApi(`${baseUrl}/chats`, JSON.stringify({ firstId, secondId }));
        if (response.error) {
            return console.log('Error creating chat', response);
        }
        setUserChats((prev) => {
            if (prev === null) {
                return null;
            }
            return [...prev, response];
        });
    }, []);

    // update user click on chat
    const updateCurrentChat = useCallback((chat: UserChat) => {
        console.log('updateCurrentChat', chat);

        setCurrentChat(chat);
    }, []);

    // send message (update database)
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
                createChat,
                allUsers,
                sendTextMessage,
                onlineUsers,
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