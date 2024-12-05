import { createContext } from "react";
import { LoginInfo, RegisterInfo, User, UserError } from "../../types/user.types";

interface AuthContextType {
    user: User | null;
    registerError: UserError | null;
    registerUser(registerInfo: RegisterInfo): void;
    isRegisterLoading: boolean;
    loginError: UserError | null;
    loginUser(loginInfo: LoginInfo): void;
    isLoginLoading: boolean;
    logoutUser(): void;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
