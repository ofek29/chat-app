import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useChat } from "../../context/chatContext"

export const AllUsersChats = () => {
    const { allUsers, createChat } = useChat();
    const { user } = useAuth();

    const [searchInput, setSearch] = useState('');

    const filteredUsers = allUsers.filter(user => user?.name.toLowerCase().includes(searchInput.toLowerCase()));

    return (
        <div
            className="w-[20%] text-lg rounded m-2 p-2 border-gray-500">
            <input
                className="w-full py-1 px-2 mb-4 bg-inherit border-[0.5px] border-gray-500 rounded-xl"
                type="text"
                value={searchInput}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => setSearch(event.target.value)}
                placeholder="Search for user" />

            {searchInput && filteredUsers.map((currUser, index) => {
                return (
                    <div
                        className="text-center mb-3 py-1 px-2 border border-gray-500 rounded-lg w-40"
                        key={index}
                        onClick={() => createChat(user?._id, currUser?._id)}
                    >
                        {currUser?.name}
                    </div>
                )
            })}
        </div>


    )
}
