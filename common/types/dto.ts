import { User } from "./user";

export type ILoginDTO = {
    username: string;
    password: string;
};

export type ICreateUserDTO = Omit<User, 'isActive'>;

export type IEditUserDTO = Omit<ICreateUserDTO, 'password'> & {
    id: number;
};

export type IPM2TargetProcess = {
    pmId: "all" | (string & {});
}
