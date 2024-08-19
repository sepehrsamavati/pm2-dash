import type { ServicesType } from "../Services";
import type { User } from "../../../common/types/user";
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
}