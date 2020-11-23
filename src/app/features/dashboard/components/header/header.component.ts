import { Component } from "@angular/core";
import { AppStateFacade } from "src/app/state/app/app.facade";
import { UserStateFacade } from "src/app/state/user/user.facade";

@Component({
    selector: "app-header",
    templateUrl: "header.component.html",
    styleUrls: ["header.component.scss"]
})
export class HeaderComponent {

    pageTitleLanguageKey$ = this.appStateFacade.pageTitleLanguageKey$;
    jwtDecoded$ = this.userStateFacade.jwtDecoded$;

    constructor(
        private userStateFacade: UserStateFacade,
        private appStateFacade: AppStateFacade
    ) {

    }
}
