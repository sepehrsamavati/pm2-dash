import config from "../config";
import type { ServicesType } from "../Services";
import { AccountType } from "../../../common/types/enums";
import { password as passwordUtils } from "../utils/crypto";
import type { User, UserInfoViewModel } from "../../../common/types/user";
import { OperationResult, OperationResultWithData } from "../../../common/models/OperationResult";
import { ICreateUserDTO, IEditUserDTO } from "../../../common/types/dto";

export default class UserApplication {
    private userRepository;

    constructor(container: ServicesType) {
        this.userRepository = container.userRepository;
    }

    async create(user: ICreateUserDTO) {
        const result = new OperationResult();

        const _user = await this.userRepository.get({ username: user.username });

        if (_user)
            return result.failed("usernameTaken");

        const hashedPassword = passwordUtils.encode(user.password);
        if (!hashedPassword)
            return result.failed("Couldn't hash password!");

        if (await this.userRepository.create({ ...user, isActive: true, password: hashedPassword }))
            result.succeeded();

        return result;
    }

    async createAdmin() {
        const result = new OperationResult();

        if (!config.adminPassword)
            return result.failed("No admin password is defined!");

        const usersCount = await this.userRepository.count();

        if (typeof usersCount === "number") {

            if (usersCount !== 0)
                return result.failed("Users count is not zero, can't create admin user!");

            const adminCreateRes = await this.create({
                username: "admin",
                password: config.adminPassword,
                type: AccountType.Admin,
                processPermissions: []
            });

            return adminCreateRes;

        } else {
            result.failed("Couldn't count users!");
        }

        return result;
    }

    async getAllViewModel() {
        const result = new OperationResultWithData<UserInfoViewModel[]>();

        const users = await this.userRepository.getAll();

        if (users)
            result.setData(users.map(user => ({
                id: user.id,
                username: user.username,
                isActive: user.isActive,
                type: user.type,
                processPermissions: user.processPermissions,
            }))).succeeded();

        return result;
    }

    async edit(user: IEditUserDTO) {
        const result = new OperationResult();

        const currentUser = await this.userRepository.get({ id: user.id });

        if (!currentUser)
            return result.failed("userNotFound");

        if (currentUser.type === AccountType.Admin)
            return result.failed("adminEditForbidden");

        const currentUsername = await this.userRepository.get({ username: user.username });

        if (currentUsername && currentUsername.id !== user.id)
            return result.failed("usernameTaken");

        if (await this.userRepository.update(user.id, {
            type: user.type,
            username: user.username,
            processPermissions: user.processPermissions,
        }))
            result.succeeded();

        return result;
    }

    async activate(id: number) {
        const result = new OperationResult();

        if (await this.userRepository.update(id, { isActive: true }))
            result.succeeded();

        return result;
    }

    async deactivate(id: number) {
        const result = new OperationResult();

        if (await this.userRepository.update(id, { isActive: false }))
            result.succeeded();

        return result;
    }

    async login(username: string, password: string) {
        const result = new OperationResultWithData<string>();

        const user = await this.userRepository.get({ username });

        if (!user)
            return result.failed("invalidCredential");

        if (passwordUtils.compare(password, user.password))
            result.setData(user.username).succeeded();
        else
            result.failed("invalidCredential");

        return result;
    }

    async getViewModelByUsername(username: string): Promise<UserInfoViewModel | null> {
        const user = await this.userRepository.get({ username });
        return user ? ({
            id: user.id,
            username: user.username,
            isActive: user.isActive,
            type: user.type,
            processPermissions: user.processPermissions,
        }) : null;
    }
}