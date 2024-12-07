import { useCallback, useEffect, useState } from "react";
import { baseUrl, fetchFromApi, getFromApi } from "../../utils/services";
import { User } from "../../types/user.types";
import { ChatsError, Message, OnlineUsers, UserChat } from "../../types/chat.types";
import { io, Socket } from "socket.io-client";
import { ChatContext } from "./ChatContext";

type Props = {
    children: React.ReactNode,
    user: User
};

export const ChatProvider = ({ children, user }: Props) => {
    const [userChats, setUserChats] = useState<UserChat[] | null>(null);
    const [newChat, setNewChat] = useState<UserChat | null>(null);
    const [isUserChatsLoading, setIsUserChatsLoading] = useState(true);
    const [userChatsError, setUserChatsError] = useState(null);
    const [currentChat, setCurrentChat] = useState<UserChat | null>(null);
    const [messages, setMessages] = useState<Message[] | null>(null);
    // const [hasMoreMessages, setHasMoreMessages] = useState(true);
    const [isMessagesLoading, setIsMessagesLoading] = useState(true);
    const [messagesError, setMessagesError] = useState<ChatsError | null>(null);
    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [socket, setSocket] = useState<Socket | null>(null);
    const [onlineUsers, setOnlineUsers] = useState<OnlineUsers | undefined>(undefined);
    // const [sendMessageError, setSendMessageError] = useState<ChatsError>(null);
    const [newMessage, setNewMessage] = useState<Message | null>(null);
    const [updateLastMessage, setUpdateLastMessage] = useState<Message | null>(null);

    // reset app when user logs out
    useEffect(() => {
        if (!user) {
            setUserChats(null);
            setCurrentChat(null);
            setMessages(null);
        }
    }, [user]);

    // connect to socket
    useEffect(() => {
        const port = import.meta.env.VITE_SOCKET_PORT || 3020;
        const newSocket = io(`http://localhost:${port}`);
        setSocket(newSocket);
        return () => {
            newSocket.disconnect();
        };
    }, [user]);

    // update all online users connected socket
    useEffect(() => {
        if (socket === null) return;
        if (user) {
            socket.emit('addNewUser', user?._id);
        }
        socket.on('getOnlineUsers', (res) => {
            const onlineMap: OnlineUsers = new Map(JSON.parse(res));
            setOnlineUsers(onlineMap);
        })
        return () => {
            socket.off('getOnlineUsers');
        };
    }, [socket, user]);

    // socket send message
    useEffect(() => {
        if (socket === null) return;
        const recipientId = currentChat?.members.find((id) => id !== user?._id);
        socket.emit('sendMessage', { ...newMessage, recipientId });
    }, [newMessage]);


    // socket receive message (also update last message)
    useEffect(() => {
        if (socket === null) return;
        socket.on('receiveMessage', (message) => {
            setUpdateLastMessage(message);
            if (currentChat?._id !== message.chatId) return;
            setMessages((prev) => {
                if (prev === null) return null;
                return [...prev, message];
            });
        });
        return () => {
            socket.off('receiveMessage');
        };
    }, [socket, currentChat]);

    // socket send user chats when new chat opened
    useEffect(() => {
        if (socket === null) return;
        const recipientId = newChat?.members.find((id) => id !== user?._id);
        socket.emit('sendNewUserChat', newChat, recipientId);
    }, [newChat, socket, user?._id]);

    // socket get and update user chats when new open chat opened
    useEffect(() => {
        if (socket === null) return;
        socket.on('getNewUserChat', (newChat) => {
            const isChatExist = userChats?.find((chat) => chat._id === newChat._id);
            if (isChatExist) { return; }
            setUserChats((prev) => {
                if (prev === null) {
                    return null;
                }
                return [...prev, newChat];
            });
        });
        return () => {
            socket.off('getNewUserChat');
        };
    }, [socket]);

    // get from api all open chat for current user
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

    // get all messages for current chat
    useEffect(() => {
        const getMessages = async () => {
            if (user?._id) {
                if (!currentChat) return;
                setIsMessagesLoading(true);
                setMessagesError(null);
                const response = await getFromApi(`${baseUrl}/messages/${currentChat?._id}`);

                if (response.error) {
                    console.log('error loading Messages', response.error);
                    return setMessagesError(response);
                }
                setMessages(response);
                setIsMessagesLoading(false);
            }
        }
        getMessages();
    }, [currentChat, user?._id]);

    // // get all messages for current chat
    // useEffect(() => {
    //     getMessages();
    // }, [currentChat, user]);

    // const getMessages = async () => {

    //     if (user?._id) {
    //         if (!hasMoreMessages || isMessagesLoading) return;
    //         setIsMessagesLoading(true);
    //         setMessagesError(null);

    //         const response = await getFromApi(`${baseUrl}/messages/${currentChat?._id}`);
    //         if (response.error) {
    //             console.log('error loading Messages', response.error);
    //             return setMessagesError(response);
    //         }

    //         if (response.length === 0) {
    //             setHasMoreMessages(false);
    //             return; //??
    //         } else {
    //             setMessages((prev) => {
    //                 if (prev === null) return null;
    //                 return [...prev, response];
    //             });
    //         }
    //         setIsMessagesLoading(false);

    //     }
    // }

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
    }, [user, userChats]);

    // create new chat
    const createChat = useCallback(async (firstId: string | undefined, secondId: string | undefined) => {
        const response = await fetchFromApi(`${baseUrl}/chats`, JSON.stringify({ firstId, secondId }));
        if (response.error) {
            return console.log('Error creating chat', response);
        }
        setNewChat(response);
        setUserChats((prev) => {
            if (prev === null) {
                return null;
            }
            return [...prev, response];
        });
    }, []);

    // update user click on chat
    const updateCurrentChat = useCallback((chat: UserChat) => {
        if (user) setCurrentChat(chat);
    }, [user]);

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
                return console.log('Error sending message', response);
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
                newMessage,
                updateLastMessage
            }}
        >
            {children}
        </ChatContext.Provider>
    )
}