import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Select, Store } from "@ngxs/store";
import { AppState } from "./app.state";
import { SetPageTitleLanguageKeyAction } from "./actions/set-page-title-language-key.action";
import { SetBuildNumber } from "./actions/set-build-number.action";
import { SetLanguage } from "./actions/set-language.action";
import { SetAuthWsUrlAction } from "./actions/set-auth-ws-url";
import { IToastMessage } from "../../interfaces/toastMessage.interface";

@Injectable()
export class AppStateFacade {
    @Select(AppState.backendUrlDown)
    backendUrlDown$: Observable<boolean>;

    @Select(AppState.pageTitleLanguageKey)
    pageTitleLanguageKey$: Observable<string>;

    @Select(AppState.buildNumber)
    buildNumber$: Observable<number>;

    @Select(AppState.language)
    language$: Observable<string>;

    @Select(AppState.authWsUrl)
    authWsUrl$: Observable<string>;

    @Select(AppState.emailEnabled)
    emailEnabled$: Observable<boolean>;

    @Select(AppState.webRtcEnabled)
    webRtcEnabled$: Observable<boolean>;

    @Select(AppState.message)
    message$: Observable<IToastMessage>;

    constructor(
        private store: Store
    ) {}

    setPageTitleLanguageKey(pageTitle: string): Observable<void> {
        return this.store.dispatch(new SetPageTitleLanguageKeyAction(pageTitle));
    }

    setBuildNumber(buildNumber: number): Observable<void> {
        return this.store.dispatch(new SetBuildNumber(buildNumber));
    }

    setLanguage(language: string): Observable<void> {
        return this.store.dispatch(new SetLanguage(language));
    }

    setAuthWsUrl(): Observable<void> {
        return this.store.dispatch(new SetAuthWsUrlAction());
    }
}
