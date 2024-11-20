import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { baseUrl, fetchFromApi } from "../utils/services";
import { User } from "../types/user.types";



type RegisterInfo = {
    name: string,
    email: string,
    password: string
};

type LoginInfo = {
    email: string,
    password: string
};

type UserError = {
    error: boolean,
    response: string,
    message?: string
} | null;

type Props = {
    children: React.ReactNode
};

interface AuthContextType {
    user: User | null;

    registerInfo: RegisterInfo | undefined;
    registerError: UserError | null;
    updateRegisterInfo(name: string, value: string): void;
    registerUser(e: React.FormEvent<HTMLFormElement>): void;
    isRegisterLoading: boolean;

    loginInfo: LoginInfo | undefined;
    loginError: UserError | null;
    updateLoginInfo(name: string, value: string): void;
    loginUser(e: React.FormEvent<HTMLFormElement>): void;
    isLoginLoading: boolean;

    logoutUser(): void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: Props) => {
    const [user, setUser] = useState<User | null>(null);
    const [registerError, setRegisterError] = useState<UserError>(null);
    const [isRegisterLoading, setIsRegisterLoading] = useState<boolean>(false);
    const [loginError, setLoginError] = useState<UserError>(null);
    const [isLoginLoading, setIsLoginLoading] = useState<boolean>(false);
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
            return setLoginError(response)
        }
        localStorage.setItem('user', JSON.stringify(response));
        setUser(response);
    }, [loginInfo]);

    const logoutUser = useCallback(() => {
        localStorage.removeItem('user');
        setUser(null);
    }, []);


    return (
        <AuthContext.Provider
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
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthContextProvider');
    }
    return context;
}

