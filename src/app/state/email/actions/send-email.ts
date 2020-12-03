export class SendEmailAction {
    static readonly type = "[App] SendEmailAction";

    constructor(public email: string, public name: string, public message: string, public language: string, public captchaToken: string) {}
}
