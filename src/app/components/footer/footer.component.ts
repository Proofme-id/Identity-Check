import { Component, Input } from "@angular/core";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { AppStateFacade } from "src/app/state/app/app.facade";

@Component({
    selector: "app-footer",
    templateUrl: "footer.component.html",
    styleUrls: ["footer.component.scss"]
})
export class FooterComponent {
    public isMenuCollapsed = true;
    public isAccountCollapsed = true;
    public isLanguageCollapsed = true;

    @Input()
    type: string;

    constructor(
        private router: Router,
        private appStateFacade: AppStateFacade,
        private translateService: TranslateService
    ) {

    }

    navigateToLogin(): void {
        this.isMenuCollapsed = true;
        this.router.navigate(["login"]);
    }

    navigateToRegistrate(): void {
        this.router.navigate(["registrate"]);
    }

    navigateToMainPage(): void {
        this.router.navigate([""]);
    }

    navigateToTerms(): void {
        this.router.navigate(["terms"]);
    }

    navigateToPrivacy(): void {
        this.router.navigate(["privacy"]);
    }

    navigateToFAQ(): void {
        this.router.navigate(["faq"]);
    }

    selectLanguage(language: string): void {
        this.appStateFacade.setLanguage(language);
        this.translateService.use(language);
    }
}
