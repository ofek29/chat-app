export type UserChat = {
    _id: string,
    members: string[],
    createdAt: string;
    updatedAt: string;
};

export type Message = {
    _id: string;
    chatId: string;
    content: string;
    createdAt: string;
    senderId: string;
    updatedAt: string;
}