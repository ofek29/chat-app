export type User = {
    _id?: string,
    name: string,
    email: string,
    token: string
} | null;

export type RegisterInfo = {
    name: string,
    email: string,
    password: string
};

export type LoginInfo = {
    email: string,
    password: string
};

export type UserError = {
    error: boolean,
    response: string,
    message?: string
} | null;

