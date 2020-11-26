export class RegistrateUserAction {
    static readonly type = "[User] RegistrateUserAction";

    constructor(public email: string, public password: string, public currentLang: string) {}
}
