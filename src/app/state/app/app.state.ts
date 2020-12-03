import { Action, Selector, State, StateContext } from "@ngxs/store";
import { SetPageTitleLanguageKeyAction } from "./actions/set-page-title-language-key.action";
import { SetBuildNumber } from "./actions/set-build-number.action";
import { SetLanguage } from "./actions/set-language.action";
import { SetAuthWsUrlAction } from "./actions/set-auth-ws-url";
import { HttpClient } from "@angular/common/http";
import { ConfigProvider } from "src/app/providers/config/configProvider";
import { Injectable } from "@angular/core";
import { IConfigResponse } from "src/app/interfaces/config-response.interface";
import { SendToastAction } from "./actions/toastMessage";
import { ToastMessage } from "../../interfaces/toastMessage.interface";

export interface IAppState {
    pageTitleLanguageKey: string;
    buildNumber: number;
    language: string;
    authWsUrl: string;
    emailEnabled: boolean;
    webRtcEnabled: boolean;
    backendUrlDown: boolean;
    message: ToastMessage;
}

@State<IAppState>({
    name: "app",
    defaults: {
        pageTitleLanguageKey: "",
        buildNumber: 0,
        language: "en",
        authWsUrl: null,
        webRtcEnabled: false,
        emailEnabled: false,
        backendUrlDown: false,
        message: null
    }
})
@Injectable()
export class AppState {
    @Selector()
    static backendUrlDown(state: IAppState): boolean {
        return state.backendUrlDown;
    }

    @Selector()
    static pageTitleLanguageKey(state: IAppState): string {
        return state.pageTitleLanguageKey;
    }

    @Selector()
    static buildNumber(state: IAppState): number {
        return state.buildNumber;
    }

    @Selector()
    static language(state: IAppState): string {
        return state.language;
    }

    @Selector()
    static authWsUrl(state: IAppState): string {
        return state.authWsUrl;
    }

    @Selector()
    static emailEnabled(state: IAppState): boolean {
        return state.emailEnabled;
    }

    @Selector()
    static webRtcEnabled(state: IAppState): boolean {
        return state.webRtcEnabled;
    }

    @Selector()
    static message(state: IAppState): ToastMessage {
        return state.message;
    }

    constructor(
        private http: HttpClient,
        private configProvider: ConfigProvider
    ) {}

    @Action(SetPageTitleLanguageKeyAction)
    setPageTitleLanguageKey(ctx: StateContext<IAppState>, payload: SetPageTitleLanguageKeyAction): void {
        ctx.patchState({
            pageTitleLanguageKey: payload.pageTitleLanguageKey
        });
    }

    @Action(SetBuildNumber)
    setBuildNumber(ctx: StateContext<IAppState>, payload: SetBuildNumber): void {
        ctx.patchState({
            buildNumber: payload.buildNumber
        });
    }

    @Action(SetLanguage)
    setLanguage(ctx: StateContext<IAppState>, payload: SetLanguage): void {
        ctx.patchState({
            language: payload.language
        });
    }

    @Action(SetAuthWsUrlAction)
    setAuthWsUrl(ctx: StateContext<IAppState>): void {
        this.http.get<IConfigResponse>(`${this.configProvider.config.backendUrl}/v1/config`).subscribe((config) => {
            ctx.patchState({
                backendUrlDown: false,
                authWsUrl: config.authWsUrl,
                emailEnabled: config.emailEnabled,
                webRtcEnabled: config.webRtcEnabled
            });
        }, (err) => {
            ctx.patchState({
                backendUrlDown: true
            })
            console.error(err);
        });
    }

    // send message
    @Action(SendToastAction)
    sendMessage(ctx: StateContext<IAppState>, payload: SendToastAction): void {
        ctx.patchState({
            message: payload.message
        });
    }
}
