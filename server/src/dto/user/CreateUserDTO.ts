import { Expose, Type } from "class-transformer";
import { ICreateUserDTO } from "../../../../common/types/dto";
import { IsArray, IsDefined, IsEnum, IsInt, IsLowercase, IsString, MaxLength, MinLength, ValidateNested } from "class-validator";
import { AccountType, Permission } from "../../../../common/types/enums";
import { UserProcessPermission } from "../../../../common/types/user";

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
    @IsEnum(Permission,{ each: true })
    permissions!: Permission[];
}

export default class CreateUserDTO implements ICreateUserDTO {
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

    @Expose()
    @Type(() => Number)
    @IsInt()
    @IsEnum(AccountType)
    type!: AccountType;

    isActive!: boolean;

    @Expose()
    @Type(() => UserProcessPermissionDTO)
    @IsArray()
    @IsDefined({ each: true })
    @ValidateNested({ each: true })
    processPermissions!: UserProcessPermission[];
}