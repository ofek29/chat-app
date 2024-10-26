import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { baseUrl, fetchFromApi } from "../utils/services";

type UserContextType = {
    user: User | undefined,

    registerInfo: RegisterInfo | undefined,
    registerError: RegisterError | null,
    updateRegisterInfo: (name: string, value: string) => void,
    registerUser: (e: React.FormEvent<HTMLFormElement>) => void,
    isRegisterLoading: boolean,

    loginInfo: LoginInfo | undefined,
    loginError: RegisterError | null,
    updateLoginInfo: (name: string, value: string) => void,
    loginUser: (e: React.FormEvent<HTMLFormElement>) => void,
    isLoginLoading: boolean,

    logoutUser: () => void,
};

type User = {
    name: string,
    email: string,
    token: string
} | undefined;

type RegisterInfo = {
    name: string,
    email: string,
    password: string
};

type LoginInfo = {
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

    const [user, setUser] = useState<User | undefined>(undefined);
    const [registerError, setRegisterError] = useState<RegisterError>(null);
    const [isRegisterLoading, setIsRegisterLoading] = useState(false);
    const [loginError, setLoginError] = useState<RegisterError>(null);
    const [isLoginLoading, setIsLoginLoading] = useState(false);
    const [registerInfo, setRegisterInfo] = useState<RegisterInfo>({
        name: '',
        email: '',
        password: '',
    });
    const [loginInfo, setLoginInfo] = useState<LoginInfo>({
        email: '',
        password: '',
    });

    useEffect(() => {
        const user = localStorage.getItem('user');
        if (user) {
            setUser(JSON.parse(user));
        }
    }, []);

    const updateRegisterInfo = useCallback((name: string, value: string) => {
        setRegisterInfo((prev) => ({
            ...prev, [name]: value
        }));
        // setRegisterInfo({ ...registerInfo, [name]: value });
    }, []);

    const updateLoginInfo = useCallback((name: string, value: string) => {
        setLoginInfo((prev) => ({
            ...prev, [name]: value
        }));
        // setLoginInfo({ ...loginInfo, [name]: value });
    }, []);

    console.log('reg info:', registerInfo);
    console.log('log info', loginInfo);

    console.log('user:', user);

    const registerUser = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsRegisterLoading(true);
        setRegisterError(null);

        const response = await fetchFromApi(`${baseUrl}/users/register`, JSON.stringify(registerInfo));
        setIsRegisterLoading(false);

        if (response.error) {
            return setRegisterError(response)
        }
        localStorage.setItem('user', JSON.stringify(response));
        setUser(response);
    }, [registerInfo]);

    const loginUser = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setIsLoginLoading(true);
        setLoginError(null);

        const response = await fetchFromApi(`${baseUrl}/users/login`, JSON.stringify(loginInfo));
        setIsLoginLoading(false);

        if (response.error) {
            console.log(response, response.error, response.message);
            return setLoginError(response)
        }
        localStorage.setItem('user', JSON.stringify(response));
        setUser(response);
        // setLoginInfo({ email: '', password: '' });
        // setLoginError(null);
        // setMessage('Logged in successfully');
        // navigate('/dashboard');
        // navigate('/dashboard');
        // navigate('/');   
    }, [loginInfo]);

    const logoutUser = useCallback(() => {
        localStorage.removeItem('user');
        setUser(undefined);
    }, []);


    return (
        <UserContext.Provider
            value={{
                user,
                registerInfo,
                registerError,
                isRegisterLoading,
                updateRegisterInfo,
                registerUser,
                logoutUser,
                loginInfo,
                loginError,
                isLoginLoading,
                updateLoginInfo,
                loginUser,
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
