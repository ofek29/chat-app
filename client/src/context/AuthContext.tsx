import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { baseUrl, fetchFromApi } from "../utils/services";

type UserContextType = {
    user: User | undefined,
    registerInfo: FormInfo | undefined,
    registerError: RegisterError | null,
    updateRegisterInfo: (name: string, value: string) => void,
    registerUser: (e: React.FormEvent<HTMLFormElement>) => void,
    // loginUser: (email: string, password: string) => void,
    isRegisterLoading: boolean,
};

type User = {
    name: string,
    email: string,
    token: string
} | undefined;

export type FormInfo = {
    name: string,
    email: string,
    password: string
};

type RegisterError = {
    error: boolean,
    response: string,
    message?: string
} | null;

type Props = { children: React.ReactNode };


export const UserContext = createContext<UserContextType | undefined>(undefined);//{} as UserContextType


export const AuthContextProvider = ({ children }: Props) => {
    const [user, setUser] = useState<User>();
    const [registerError, setRegisterError] = useState<RegisterError>(null);
    const [isRegisterLoading, setIsRegisterLoading] = useState(false);
    const [registerInfo, setRegisterInfo] = useState<FormInfo>({
        name: '',
        email: '',
        password: '',
    });

    const updateRegisterInfo = useCallback((name: string, value: string) => {
        setRegisterInfo((prev) => ({
            ...prev, [name]: value
        }));
        // setRegisterInfo({ ...registerInfo, [name]: value });
    }, []);



    const registerUser = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsRegisterLoading(true);
        setRegisterError(null);
        console.log(registerInfo);


        const response = await fetchFromApi(`${baseUrl}/users/register`, JSON.stringify(registerInfo));
        setIsRegisterLoading(false);

        if (response.error) {
            console.log(response, response.error, response.message);

            return setRegisterError(response)
        }
        localStorage.setItem('user', JSON.stringify(response));
        setUser(response);
    }, [registerInfo]);

    // const loginUser = (name: string, email: string) => { };


    return (
        <UserContext.Provider
            value={{
                user,
                registerInfo,
                registerError,
                isRegisterLoading,
                updateRegisterInfo,
                registerUser,
                // loginUser,

            }}
        >
            {children}
        </UserContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthContextProvider');
    }
    return context;
}
