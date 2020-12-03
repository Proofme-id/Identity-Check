export class UpdateUserAction {
    static readonly type = "[User] UpdateUserAction";

    constructor(public username: string, public language: string) {}
}
