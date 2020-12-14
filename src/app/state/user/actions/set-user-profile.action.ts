export class SetUserProfileAction {
    static readonly type = "[User] SetUserProfileAction";

    constructor(public organisationId: number) {}
}
