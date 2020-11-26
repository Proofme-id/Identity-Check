import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Select, Store } from "@ngxs/store";
import { SendEmailAction } from "./actions/send-email";
import { EmailState } from "./email.state";

@Injectable()
export class EmailStateFacade {

    @Select(EmailState.emailSendFailure)
    emailSendFailure$: Observable<boolean>;

    @Select(EmailState.emailSendSuccess)
    emailSendSuccess$: Observable<boolean>;

    constructor(
        private store: Store
    ) {}

    sendEmail(email: string, name: string, message: string, language: string, captchaToken: string): Observable<void> {
        return this.store.dispatch(new SendEmailAction(email, name, message, language, captchaToken));
    }
}
