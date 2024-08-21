import { User } from "./user";

export type ILoginDTO = {
    username: string;
    password: string;
};

export type ICreateUserDTO = User;

export type IEditUserDTO = ICreateUserDTO & {
    id: number;
};

export type IPM2TargetProcess = {
    pmId: "all" | (string & {});
}
