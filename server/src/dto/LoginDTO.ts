import { Expose, Type } from "class-transformer";
import { ILoginDTO } from "../../../common/types/dto";
import { IsDefined, IsLowercase, IsString, MaxLength, MinLength } from "class-validator";

export default class LoginDTO implements ILoginDTO {
    @Expose()
    @Type(() => String)
    @IsString()
    @IsDefined()
    @IsLowercase()
    @MinLength(1)
    @MaxLength(100)
    username!: string;

    @Expose()
    @Type(() => String)
    @IsString()
    @IsDefined()
    @MinLength(1)
    @MaxLength(100)
    password!: string;
}