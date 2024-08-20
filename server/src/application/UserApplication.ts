import config from "../config";
import type { ServicesType } from "../Services";
import type { User, UserViewModel } from "../../../common/types/user";
import { password as passwordUtils } from "../utils/crypto";
import { AccountType, Permission } from "../../../common/types/enums";
import { OperationResult, OperationResultWithData } from "../../../common/models/OperationResult";

export default class UserApplication {
    private userRepository;

    constructor(container: ServicesType) {
        this.userRepository = container.userRepository;
    }

    async create(user: User) {
        const result = new OperationResult();

        if (await this.userRepository.create(user))
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

            const hashedPassword = passwordUtils.encode(config.adminPassword);
            if (!hashedPassword)
                return result.failed("Couldn't hash password!");

            const adminCreateRes = await this.userRepository.create({
                username: "admin",
                isActive: true,
                password: hashedPassword,
                type: AccountType.Admin,
                processPermissions: []
            });

            if (adminCreateRes)
                result.succeeded();
            else
                result.failed("Create admin failed");

        } else {
            result.failed("Couldn't count users!");
        }

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

    async getViewModelByUsername(username: string): Promise<UserViewModel | null> {
        const user = await this.userRepository.get({ username });
        return user ? ({
            username: user.username,
            isActive: user.isActive,
            type: user.type,
            processPermissions: user.processPermissions,
        }) : null;
    }
}