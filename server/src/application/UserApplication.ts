import config from "../config";
import { password } from "../utils/crypto";
import type { ServicesType } from "../Services";
import type { User } from "../../../common/types/user";
import { AccountType } from "../../../common/types/enums";
import { OperationResult } from "../../../common/models/OperationResult";

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

            const hashedPassword = password.encode(config.adminPassword);
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
}