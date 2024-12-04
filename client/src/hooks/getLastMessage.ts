import { useEffect, useState } from "react";
import { useChat } from "../context/ChatContext/useChat";
import { baseUrl, getFromApi } from "../utils/services";
import { Message, UserChat } from "../types/chat.types";

export const GetLastMessage = (chat: UserChat) => {
    // const { newMessage, messages } = useChat();
    const [lastMessage, setLastMessage] = useState<Message | null>(null);

    useEffect(() => {
        const getMessage = async () => {
            console.log('caling lastMessage');

            const response = await getFromApi(`${baseUrl}/messages/${chat?._id}?limit=1&sortOrder=-1`);
            if (response.error) {
                return console.log('Error getting message', response);
            }
            const message: Message = response[response?.length - 1];
            setLastMessage(message);
        }
        getMessage();
    }, []);

    return lastMessage;
};