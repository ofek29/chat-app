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

    useEffect(() => {
        const user = localStorage.getItem('user');

        if (user) {
            setUser(JSON.parse(user));
        }
    }, []);

    const registerUser = useCallback(async (registerInfo: RegisterInfo) => {
        console.log(registerInfo);

        setIsRegisterLoading(true);
        setRegisterError(null);

        const response = await fetchFromApi(`${baseUrl}/users/register`, JSON.stringify(registerInfo));
        setIsRegisterLoading(false);

        if (response.error) {
            return setRegisterError(response)
        }
        localStorage.setItem('user', JSON.stringify(response));
        setUser(response);
    }, []);

    const loginUser = useCallback(async (loginInfo: LoginInfo) => {

        setIsLoginLoading(true);
        setLoginError(null);

        const response = await fetchFromApi(`${baseUrl}/users/login`, JSON.stringify(loginInfo));
        setIsLoginLoading(false);

        if (response.error) {
            return setLoginError(response)
        }
        localStorage.setItem('user', JSON.stringify(response));
        setUser(response);
    }, []);

    const logoutUser = useCallback(() => {
        localStorage.removeItem('user');
        setUser(null);
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                registerError,
                isRegisterLoading,
                registerUser,
                logoutUser,
                loginError,
                isLoginLoading,
                loginUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}
