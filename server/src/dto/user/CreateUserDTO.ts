import { Expose, Type } from "class-transformer";
import { ICreateUserDTO } from "../../../../common/types/dto";
import { UserProcessPermission } from "../../../../common/types/user";
import { AccountType, Permission } from "../../../../common/types/enums";
import { IsArray, IsBoolean, IsDefined, IsEnum, IsInt, IsLowercase, IsString, MaxLength, MinLength, ValidateNested } from "class-validator";

class UserProcessPermissionDTO implements UserProcessPermission {
    @Expose()
    @Type(() => String)
    @IsString()
    @IsDefined()
    @IsLowercase()
    @MinLength(1)
    @MaxLength(100)
    processName!: string;

    @Expose()
    @Type(() => Number)
    @IsArray()
    @IsInt({ each: true })
    @IsEnum(Permission, { each: true })
    permissions!: Permission[];
}

export class UpsertUserDTO {
    @Expose()
    @Type(() => String)
    @IsString()
    @IsDefined()
    @IsLowercase()
    @MinLength(1)
    @MaxLength(100)
    username!: string;

    @Expose()
    @Type(() => Number)
    @IsInt()
    @IsEnum(AccountType)
    type!: AccountType;

    @Expose()
    @Type(() => UserProcessPermissionDTO)
    @IsArray()
    @IsDefined({ each: true })
    @ValidateNested({ each: true })
    processPermissions!: UserProcessPermission[];
}

export default class CreateUserDTO extends UpsertUserDTO implements ICreateUserDTO {
    @Expose()
    @Type(() => String)
    @IsString()
    @IsDefined()
    @MinLength(1)
    @MaxLength(100)
    password!: string;
}