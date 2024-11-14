import { useEffect, useState } from "react";
import { useChat } from "../context/ChatContext";
import { baseUrl, getFromApi } from "../utils/services";
import { Message, UserChat } from "../types/chat.types";

export const getLastMessage = (chat: UserChat) => {
    const { newMessage } = useChat();
    const [lastMessage, setLastMessage] = useState<Message | null>(null);

    useEffect(() => {
        const getMessage = async () => {
            const response = await getFromApi(`${baseUrl}/messages/${chat?._id}`);
            if (response.error) {
                return console.log('Error getting message', response);
            }
            const message: Message = response[response?.length - 1];
            setLastMessage(message);
        }
        getMessage();
    }, [newMessage]);

    return { lastMessage };
};