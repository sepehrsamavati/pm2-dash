import { UpsertUserDTO } from "./CreateUserDTO";
import { Expose, Type } from "class-transformer";
import { IsDefined, IsInt, Min } from "class-validator";
import { IEditUserDTO } from "../../../../common/types/dto";

export default class EditUserDTO extends UpsertUserDTO implements IEditUserDTO {
    @Expose()
    @Type(() => Number)
    @IsInt()
    @IsDefined()
    @Min(1)
    id!: number;
}