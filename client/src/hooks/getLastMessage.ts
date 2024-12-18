import { useEffect, useState } from "react";
import { useChat } from "../context/ChatContext/useChat";
import { baseUrl, getFromApi } from "../utils/services";
import { Message, UserChat } from "../types/chat.types";

export const GetLastMessage = (chat: UserChat) => {
    const { newMessage } = useChat();
    const [lastMessage, setLastMessage] = useState<Message | null>(null);

    useEffect(() => {
        const getMessage = async () => {
            const response = await getFromApi(`${baseUrl}/messages/${chat?._id}?limit=1&sortOrder=-1`);
            if (response.error) {
                return console.log('Error getting message', response);
            }
            setLastMessage(response[0]);
        }
        getMessage();
    }, [newMessage, chat]);

    return lastMessage;
};