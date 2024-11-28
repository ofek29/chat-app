import { createContext } from "react";
import { LoginInfo, RegisterInfo, User, UserError } from "../../types/user.types";

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

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
