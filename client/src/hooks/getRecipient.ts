import { useEffect, useState } from "react";
import { UserChat } from "../types/chat.types";
import { User } from "../types/user.types";
import { getFromApi, baseUrl } from "../utils/services";

type RecipientUser = {
    _id: string,
    email: string,
    name: string,
    password: string,
    createdAt: string,
    updatedAt: string,
}

export const GetRecipientUser = (chat: UserChat | null, user: User) => {
    const [recipientUser, setRecipientUser] = useState<RecipientUser | null>(null);
    const [error, setError] = useState(null);
    const recipientId = chat?.members.find((id) => id !== user?._id);
    useEffect(() => {
        const getUser = async () => {
            if (!recipientId) return null;

            const response = await getFromApi(`${baseUrl}/users/find/${recipientId}`);
            if (response.error) {
                return setError(response);
            }
            setRecipientUser(response);
        }
        getUser();
    }, [recipientId]);
    return { recipientUser, error };

}   