export enum AccountType {
    /** Ful access - Can create/edit users */
    Admin = 1,

    /** Full access to do operation on processes */
    Manager = 2,

    /** Process permissions required */
    Member = 3,
}

export enum Permission {
    ViewProcess = 2,
    RestartProcess = 3,
    StopProcess = 4,
    DeleteProcess = 5,
    FlushProcess = 6,
    ResetProcess = 7,
    GetOutputLog = 8,
    GetErrorLog = 9,
}

export enum ClientServerInitHello {
    ClientKey = "repeat-after-me",
    ServerKey = "here-you-go"
}

export enum ExitCode {
    OK = 0,
    FatalError = 1,
    ConfigError = 100,
}
