import { Injectable } from "@angular/core";
import { Store, Select } from "@ngxs/store";
import { Observable } from "rxjs";
import { IJWTDecoded } from "src/app/interfaces/jwtDecoded.interface";
import { IUser } from "src/app/interfaces/user.interface";
import { FinishRegistrationAction } from "./actions/finish-registration";
import { LogoutAction } from "./actions/logout.action";
import { RefreshAction } from "./actions/refresh.action";
import { RegistrateUserAction } from "./actions/registrate-user";
import { SetAccessTokenAction } from "./actions/set-access-token.action";
import { SetExternalInstructionStatus } from "./actions/set-external-instruction-status";
import { SetUsersList } from "./actions/set-users-list";
import { UpdateUserAction } from "./actions/update-account";
import { UpdateUserAdminAction } from "./actions/update-user-admin";
import { UserLoginAction } from "./actions/user-login";
import { UserState } from "./user.state";
import { IEnroll } from "../../interfaces/enroll.interface";
import { FinishEnrollAction } from "./actions/finish-enroll";

@Injectable({
    providedIn: "root"
})
export class UserStateFacade {
    @Select(UserState.isAdmin)
    isAdmin$: Observable<boolean>;

    @Select(UserState.accessToken)
    accessToken$: Observable<string>;

    @Select(UserState.jwtDecoded)
    jwtDecoded$: Observable<IJWTDecoded>;

    @Select(UserState.updateUserError)
    updateUserError$: Observable<boolean>;

    @Select(UserState.userLoginError)
    userLoginError$: Observable<boolean>;

    @Select(UserState.registrationError)
    registrationError$: Observable<boolean>;

    @Select(UserState.registratedEmail)
    registratedEmail$: Observable<string>;

    @Select(UserState.showExternalInstruction)
    showExternalInstruction$: Observable<boolean>;

    @Select(UserState.usersList)
    usersList$: Observable<IUser[]>;

    @Select(UserState.updateUserAdminError)
    updateUserAdminError$: Observable<boolean>;

    @Select(UserState.updateUserAdminSuccess)
    updateUserAdminSuccess$: Observable<boolean>;

    constructor(private store: Store) {}

    logout(): Observable<void> {
        return this.store.dispatch(new LogoutAction());
    }

    refresh(): Observable<void> {
        return this.store.dispatch(new RefreshAction());
    }

    setAccessToken(token: string): Observable<void> {
        return this.store.dispatch(new SetAccessTokenAction(token));
    }

    updateAccount(username: string, language: string): Observable<void> {
        return this.store.dispatch(new UpdateUserAction(username, language));
    }

    registrate(email: string, password: string, currentLang: string): Observable<void> {
        return this.store.dispatch(new RegistrateUserAction(email, password, currentLang));
    }

    userLogin(email: string, password: string): Observable<void> {
        return this.store.dispatch(new UserLoginAction(email, password));
    }

    finishRegistration(username: string, termsAndPrivacyAccepted: string, newsLetter: string, language: string): Observable<void> {
        return this.store.dispatch(new FinishRegistrationAction(username, termsAndPrivacyAccepted, newsLetter, language));
    }

    finishEnroll(enroll: IEnroll): Observable<void> {
        return  this.store.dispatch(new FinishEnrollAction(enroll));
    }

    setShowExternalInstruction(status: boolean): Observable<void> {
        return this.store.dispatch(new SetExternalInstructionStatus(status));
    }

    setUsersList(): Observable<void> {
        return this.store.dispatch(new SetUsersList());
    }

    updateUserAdmin(user: IUser): Observable<void> {
        return this.store.dispatch(new UpdateUserAdminAction(user));
    }
}
