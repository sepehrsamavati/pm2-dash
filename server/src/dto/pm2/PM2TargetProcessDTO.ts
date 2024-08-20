import { Expose, Type } from "class-transformer";
import type { IPM2TargetProcess } from "../../../../common/types/dto";
import { IsString, IsDefined, MinLength, MaxLength } from "class-validator";

export default class PM2TargetProcessDTO implements IPM2TargetProcess {
    @Expose()
    @Type(() => String)
    @IsString()
    @IsDefined()
    @MinLength(1)
    @MaxLength(100)
    pmId!: "all" | (string & {}); 
}