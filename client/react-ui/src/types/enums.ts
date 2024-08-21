export enum AccountType {
    /** Ful access - Can create/edit users */
    Admin = 1,

    /** Full access to do operation on processes */
    Manager = 2,

    /** Process permissions required */
    Member = 3,
}