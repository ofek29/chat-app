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

// export type OnlineUsers = {
//     [key: string]: string[];
//     // userId: string,
//     // socketId: string,
// }
export type OnlineUsers = Map<string, string[]>

export type ChatsError = {
    error: boolean
    response: Response,

} | null;

