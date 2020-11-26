import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { LanguageProvider } from "../../providers/language/languageProvider";
import { TranslateService } from "@ngx-translate/core";
import { ConfigProvider } from "src/app/providers/config/configProvider";
import { BaseComponent } from "../base-component/base-component";
import { load, ReCaptchaInstance } from "recaptcha-v3";
import { EmailStateFacade } from "src/app/state/email/email.facade";
import { filter, take, takeUntil } from "rxjs/operators";
import { ToastrService } from "ngx-toastr";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { AppStateFacade } from 'src/app/state/app/app.facade';

@Component({
    templateUrl: "main.page.html",
    styleUrls: ["main.page.scss"]
})
export class MainPageComponent extends BaseComponent implements OnInit {
    contactForm: FormGroup;
    languages = [];
    recaptcha: ReCaptchaInstance;
    contactEmail: string;
    language$ = this.appStateFacade.language$;

    constructor(
        private router: Router,
        private languageProvider: LanguageProvider,
        private configProvider: ConfigProvider,
        private emailStateFacade: EmailStateFacade,
        private toastrService: ToastrService,
        private translateService: TranslateService,
        private formBuilder: FormBuilder,
        private appStateFacade: AppStateFacade
    ) {
        super();

        this.contactForm = this.formBuilder.group({
            name: new FormControl("", Validators.required),
            email: new FormControl("", Validators.required),
            message: new FormControl("", Validators.required)
        });
    }

    async ngOnInit(): Promise<void> {
        const config = await this.configProvider.getConfig();
        this.languages = this.languageProvider.getLanguages();

        // Captcha
        this.recaptcha = await load(config.captchaSiteKey);

        this.emailStateFacade.emailSendSuccess$.pipe(takeUntil(this.destroy$), filter(x => !!x)).subscribe(() => {
            this.toastrService.success("Email send!");
            this.contactForm.reset();
        });

        this.emailStateFacade.emailSendFailure$.pipe(takeUntil(this.destroy$), filter(x => !!x)).subscribe(() => {
            this.toastrService.error("Email not send!");
        });
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

    async sendEmail(): Promise<void> {
        const token = await this.recaptcha.execute("submit");

        console.log(token);
        const name = this.contactForm.get("name").value;
        const email = this.contactForm.get("email").value;
        const message = this.contactForm.get("message").value;
        const language = await this.language$.pipe(take(1)).toPromise().then(result => {
            return result;
        });
    
        console.log('Send mail in: ' + language);

        this.emailStateFacade.sendEmail(email, name, message, language, token);
    }
}
