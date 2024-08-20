import { User } from "./user";

export type ILoginDTO = {
    username: string;
    password: string;
};

export type ICreateUserDTO = User;
