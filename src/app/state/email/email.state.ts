import { State, StateContext, Action, Selector } from "@ngxs/store";
import { SendEmailAction } from "./actions/send-email";
import { HttpClient } from "@angular/common/http";
import { ConfigProvider } from "src/app/providers/config/configProvider";
import { Injectable } from "@angular/core";

export interface IEmailState {
    emailSendSuccess: boolean;
    emailSendFailure: boolean;
}

@State<IEmailState>({
    name: "email",
    defaults: {
        emailSendSuccess: false,
        emailSendFailure: false
    }
})
@Injectable()
export class EmailState {

    @Selector()
    static emailSendSuccess(state: IEmailState): boolean {
        return state.emailSendSuccess;
    }

    @Selector()
    static emailSendFailure(state: IEmailState): boolean {
        return state.emailSendFailure;
    }

    constructor(
        private http: HttpClient,
        private configProvider: ConfigProvider
    ) {}

    @Action(SendEmailAction)
    setAuthWsUrl(ctx: StateContext<IEmailState>, payload: SendEmailAction): void {
        ctx.patchState({
            emailSendSuccess: false,
            emailSendFailure: false
        });
        this.http.post<void>(`${this.configProvider.config.backendUrl}/v1/email/contact`, {
            email: payload.email,
            name: payload.name,
            message: payload.message,
            language: payload.language,
            captchaToken: payload.captchaToken
        }).subscribe(() => {
            ctx.patchState({
                emailSendSuccess: true
            });
        }, (err) => {
            ctx.patchState({
                emailSendFailure: true
            });
            console.error(err);
        });
    }
}
