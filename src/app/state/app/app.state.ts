import { Action, Selector, State, StateContext } from "@ngxs/store";
import { SetPageTitleLanguageKeyAction } from "./actions/set-page-title-language-key.action";
import { SetBuildNumber } from "./actions/set-build-number.action";
import { SetLanguage } from "./actions/set-language.action";
import { SetAuthWsUrlAction } from "./actions/set-auth-ws-url";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { SendToastAction } from "./actions/toastMessage";
import { IToastMessage } from "../../interfaces/toastMessage.interface";
import { SetExternalInstructionStatus } from "./actions/set-external-instruction-status";

export interface IAppState {
    pageTitleLanguageKey: string;
    buildNumber: number;
    language: string;
    authWsUrl: string;
    webRtcEnabled: boolean;
    message: IToastMessage;
    showExternalInstruction: boolean;
}

@State<IAppState>({
    name: "app",
    defaults: {
        pageTitleLanguageKey: "",
        buildNumber: 0,
        language: "en",
        authWsUrl: "wss://auth.proofme.id",
        webRtcEnabled: true,
        message: null,
        showExternalInstruction: false,
    }
})
@Injectable()
export class AppState {

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
    static webRtcEnabled(state: IAppState): boolean {
        return state.webRtcEnabled;
    }

    @Selector()
    static message(state: IAppState): IToastMessage {
        return state.message;
    }

    @Selector()
    static showExternalInstruction(state: IAppState): boolean {
        return state.showExternalInstruction;
    }


    constructor(
        private http: HttpClient,
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
        ctx.patchState({
            authWsUrl: "wss://auth.proofme.id",
            webRtcEnabled: true
        });
    }

    // send message
    @Action(SendToastAction)
    sendMessage(ctx: StateContext<IAppState>, payload: SendToastAction): void {
        ctx.patchState({
            message: payload.message
        });
    }

    @Action(SetExternalInstructionStatus)
    setExternalInstructionStatus(ctx: StateContext<IAppState>, payload: SetExternalInstructionStatus): IAppState {
        console.log("setExternalInstructionStatus:", payload.status);
        return ctx.patchState({
            showExternalInstruction: payload.status
        });
    }
}
