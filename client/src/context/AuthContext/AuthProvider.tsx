import { useState, useEffect, useCallback } from "react";
import { LoginInfo, RegisterInfo, User, UserError } from "../../types/user.types";
import { fetchFromApi, baseUrl } from "../../utils/services";
import { AuthContext } from "./AuthContext";

type Props = {
    children: React.ReactNode
};

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
    }, []);

    const updateLoginInfo = useCallback((name: string, value: string) => {
        setLoginInfo((prev) => ({
            ...prev, [name]: value
        }));
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
