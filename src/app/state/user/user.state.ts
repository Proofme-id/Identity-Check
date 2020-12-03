import { Action, Selector, State, StateContext } from "@ngxs/store";
import { HttpClient } from "@angular/common/http";
import { ConfigProvider } from "src/app/providers/config/configProvider";
import { LogoutAction } from "./actions/logout.action";
import { IJWTDecoded } from "src/app/interfaces/jwtDecoded.interface";
import { SetAccessTokenAction } from "./actions/set-access-token.action";
import jwt_decode from "jwt-decode";
import { UpdateUserAction } from "./actions/update-account";
import { tap } from "rxjs/operators";
import { catchError } from "rxjs/internal/operators/catchError";
import { Observable, throwError } from "rxjs";
import { RegistrateUserAction } from "./actions/registrate-user";
import { UserLoginAction } from "./actions/user-login";
import { Injectable } from "@angular/core";
import { FinishRegistrationAction } from "./actions/finish-registration";
import { ITokenResponse } from "src/app/interfaces/token-response.interface";
import { SetExternalInstructionStatus } from "./actions/set-external-instruction-status";
import { SetUsersList } from "./actions/set-users-list";
import { IUser } from "src/app/interfaces/user.interface";
import { UtilsProvider } from "src/app/providers/utils/utils";
import { UpdateUserAdminAction } from "./actions/update-user-admin";
import { FinishEnrollAction } from "./actions/finish-enroll";
import { SetActiveOrganisation } from "../organisation/actions/set-active-organisation";

export interface IUserState {
    access_token: string;
    refresh_token: string;
    jwtDecoded: IJWTDecoded;
    updateUserError: boolean;
    userLoginError: boolean;
    registratedEmail: string;
    registrationError: boolean;
    loginType: string;
    showExternalInstruction: boolean;
    usersList: IUser[];
    updateUserAdminError: boolean;
    updateUserAdminSuccess: boolean;
}

@State<IUserState>({
    name: "user",
    defaults: {
        access_token: null,
        refresh_token: null,
        jwtDecoded: null,
        registratedEmail: null,
        updateUserError: false,
        userLoginError: false,
        registrationError: false,
        loginType: null,
        showExternalInstruction: false,
        usersList: [],
        updateUserAdminError: false,
        updateUserAdminSuccess: false
    }
})
@Injectable()
export class UserState {

    @Selector()
    static accessToken(state: IUserState): string {
        return state.access_token;
    }

    @Selector()
    static refreshToken(state: IUserState): string {
        return state.refresh_token;
    }

    @Selector()
    static jwtDecoded(state: IUserState): IJWTDecoded {
        return state.jwtDecoded;
    }

    @Selector()
    static updateUserError(state: IUserState): boolean {
        return state.updateUserError;
    }

    @Selector()
    static userLoginError(state: IUserState): boolean {
        return state.userLoginError;
    }

    @Selector()
    static registratedEmail(state: IUserState): string {
        return state.registratedEmail;
    }

    @Selector()
    static registrationError(state: IUserState): boolean {
        return state.registrationError;
    }

    @Selector()
    static isAdmin(state: IUserState): boolean {
        return state.jwtDecoded.userPower === 1;
    }

    @Selector()
    static showExternalInstruction(state: IUserState): boolean {
        return state.showExternalInstruction;
    }

    @Selector()
    static usersList(state: IUserState): IUser[] {
        return state.usersList;
    }

    @Selector()
    static updateUserAdminError(state: IUserState): boolean {
        return state.updateUserAdminError;
    }

    @Selector()
    static updateUserAdminSuccess(state: IUserState): boolean {
        return state.updateUserAdminSuccess;
    }

    constructor(
        private http: HttpClient,
        private configProvider: ConfigProvider,
        private utilsProvider: UtilsProvider,
    ) {

    }

    @Action(SetAccessTokenAction)
    setAccessToken(ctx: StateContext<IUserState>, payload: SetAccessTokenAction): IUserState {
        const accessToken = payload.accessToken;
        const jwtDecoded: IJWTDecoded = jwt_decode(accessToken);
        ctx.dispatch(new SetActiveOrganisation(jwtDecoded.user_claims.custom_claims))
        return ctx.patchState({
            access_token: accessToken,
            jwtDecoded,
        });
    }

    @Action(LogoutAction)
    logoutAction(ctx: StateContext<IUserState>): IUserState {
        ctx.dispatch(new SetActiveOrganisation([]))
        return ctx.patchState({
            refresh_token: null,
            access_token: null
        });
    }

    @Action(UserLoginAction)
    userLoginAction(ctx: StateContext<IUserState>, payload: UserLoginAction): Observable<ITokenResponse> {
        console.log("userLoginAction");
        ctx.patchState({
            userLoginError: false
        });
        console.log("SENDING POST");
        return this.http.post(
            `${this.configProvider.config.backendUrl}/v1/auth/authemail`,
            {
                email: payload.email,
                password: payload.password
            }
        ).pipe(
            tap((response: ITokenResponse) => {
                const jwtDecoded: IJWTDecoded = jwt_decode(response.token);
                ctx.dispatch(new SetActiveOrganisation(jwtDecoded.user_claims.custom_claims))
                ctx.patchState({
                    userLoginError: false,
                    access_token: response.token,
                    jwtDecoded
                });
            }),
            catchError((error) => {
                ctx.patchState({
                    userLoginError: true
                });
                return throwError(error);
            })
        );
    }


    @Action(UpdateUserAction)
    updateUser(ctx: StateContext<IUserState>, payload: UpdateUserAction): Observable<ITokenResponse> {
        const userId = ctx.getState().jwtDecoded.userId;
        ctx.patchState({
            updateUserError: false
        });
        return this.http.patch(
            `${this.configProvider.config.backendUrl}/v1/user/${userId}`,
            {
                username: payload.username,
                language: payload.language
            }
        ).pipe(
            tap((response: ITokenResponse) => {
                const jwtDecoded: IJWTDecoded = jwt_decode(response.token);
                ctx.dispatch(new SetActiveOrganisation(jwtDecoded.user_claims.custom_claims));
                ctx.patchState({
                    updateUserError: false,
                    access_token: response.token,
                    jwtDecoded
                });
            }),
            catchError((error) => {
                ctx.patchState({
                    updateUserError: true
                });
                return throwError(error);
            })
        );
    }

    @Action(RegistrateUserAction)
    registrateUser(ctx: StateContext<IUserState>, payload: RegistrateUserAction): Observable<unknown> {
        ctx.patchState({
            registrationError: false,
            registratedEmail: null
        });
        return this.http.post(
            `${this.configProvider.config.backendUrl}/v1/user/registrate`,
            {
                email: payload.email,
                password: payload.password,
                language: payload.currentLang
            }
        ).pipe(
            tap(() => {
                ctx.patchState({
                    registratedEmail: payload.email
                });
            }),
            catchError((error) => {
                ctx.patchState({
                    registrationError: true
                });
                return throwError(error);
            })
        );
    }

    @Action(FinishRegistrationAction)
    finishRegistration(ctx: StateContext<IUserState>, payload: FinishRegistrationAction): Observable<ITokenResponse> {
        ctx.patchState({
            registrationError: false,
        });
        return this.http.post(
            `${this.configProvider.config.backendUrl}/v1/user/finishRegistration`,
            {
                username: payload.username,
                termsAndPrivacyAccepted: payload.termsAndPrivacyAccepted,
                newsLetterAccepted: payload.newsLetter,
                language: payload.lang
            }
        ).pipe(
            tap((response: ITokenResponse) => {
                const jwtDecoded: IJWTDecoded = jwt_decode(response.token);
                ctx.dispatch(new SetActiveOrganisation(jwtDecoded.user_claims.custom_claims))
                ctx.patchState({
                    updateUserError: false,
                    access_token: response.token,
                    jwtDecoded
                });
            }),
            catchError((error) => {
                ctx.patchState({
                    registrationError: true
                });
                return throwError(error);
            })
        ); 
    }

    @Action(FinishEnrollAction)
    finishEnroll(ctx: StateContext<IUserState>, payload: FinishEnrollAction): Observable<ITokenResponse> {
        ctx.patchState({
            registrationError: false,
        });
        return this.http.post(
            `${this.configProvider.config.backendUrl}/v1/organisation`,
                payload.enroll
        ).pipe(
            tap((response: ITokenResponse) => {
                const jwtDecoded: IJWTDecoded = jwt_decode(response.token);
                ctx.dispatch(new SetActiveOrganisation(jwtDecoded.user_claims.custom_claims))
                ctx.patchState({
                    updateUserError: false,
                    access_token: response.token,
                    jwtDecoded
                });
            }),
            catchError((error) => {
                ctx.patchState({
                    registrationError: true
                });
                return throwError(error);
            })
        );
    }

    @Action(SetExternalInstructionStatus)
    setExternalInstructionStatus(ctx: StateContext<IUserState>, payload: SetExternalInstructionStatus): IUserState {
        return ctx.patchState({
            showExternalInstruction: payload.status
        });
    }

    @Action(SetUsersList)
    setUsersList(ctx: StateContext<IUserState>): Observable<IUser[]> {
        return this.http.get(
            `${this.configProvider.config.backendUrl}/v1/user/all`,
        ).pipe(
            tap((usersList: IUser[]) => {
                for (const user of usersList) {
                    user.userPower = this.utilsProvider.convertUserPowerToRoleName(user.userPower);
                }
                ctx.patchState({
                    usersList
                });
            }),
            catchError((error) => {
                return throwError(error);
            })
        );
    }

    @Action(UpdateUserAdminAction)
    updateUserAdminAction(ctx: StateContext<IUserState>, payload: UpdateUserAdminAction): Observable<ITokenResponse> {
        ctx.patchState({
            updateUserAdminError: null,
            updateUserAdminSuccess: null
        });
        return this.http.patch(
            `${this.configProvider.config.backendUrl}/v1/user/admin/${payload.user.id}`,
            { 
                ...payload.user
            }
        ).pipe(
            tap((token: ITokenResponse) => {
                ctx.patchState({
                    updateUserAdminSuccess: true
                });
                if (token) {
                    const accessToken = token.token;
                    if (accessToken) {
                        const jwtDecoded: IJWTDecoded = jwt_decode(accessToken);
                        ctx.dispatch(new SetActiveOrganisation(jwtDecoded.user_claims.custom_claims))
                        return ctx.patchState({
                            access_token: accessToken,
                            jwtDecoded,
                        });
                    }
                }
            }),
            catchError((error) => {
                ctx.patchState({
                    updateUserAdminError: true
                });
                return throwError(error);
            })
        );
    }
}
