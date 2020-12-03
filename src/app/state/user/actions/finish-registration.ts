export class FinishRegistrationAction {
    static readonly type = "[User] FinishRegistrationAction";

    constructor(public username: string, public termsAndPrivacyAccepted: string, public newsLetter: string, public lang: string) {}
}
