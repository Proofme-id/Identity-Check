import { Component, OnInit } from "@angular/core";
import { AppStateFacade } from "src/app/state/app/app.facade";
import { FormGroup, FormBuilder, FormControl } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
import { LanguageProvider} from "../../providers/language/languageProvider";
import { ToastrService } from "ngx-toastr";
import { first, takeUntil } from "rxjs/operators";
import { UserStateFacade } from "src/app/state/user/user.facade";
import { UtilsProvider } from "src/app/providers/utils/utils";
import { BaseComponent } from '../base-component/base-component';

@Component({
    templateUrl: "profile.page.html",
    styleUrls: ["profile.page.scss"]
})
export class ProfilePageComponent extends BaseComponent implements OnInit {
    profileForm: FormGroup;
    selectLanguage = new FormControl();
    language$ = this.appStateFacade.language$;
    languages = [];

    jwtDecoded$ = this.userStateFacade.jwtDecoded$;

    constructor(
        private appStateFacade: AppStateFacade,
        private formBuilder: FormBuilder,
        private toastr: ToastrService,
        private translateService: TranslateService,
        private languageProvider: LanguageProvider,
        private userStateFacade: UserStateFacade,
        private utilsProvider: UtilsProvider
    ) {
        super(); 
        this.appStateFacade.setPageTitleLanguageKey("HEADER.PROFILE");

        this.profileForm = this.formBuilder.group({
            username: new FormControl(""),
            email: new FormControl({value: "", disabled: true}),
            role: new FormControl({value: "", disabled: true})
        });

        this.languages = this.languageProvider.getLanguages();
        this.selectLanguage.valueChanges.subscribe(value => {
            this.appStateFacade.setLanguage(value);
            this.translateService.use(value);
        });
    }

    ngOnInit(): void {
        this.userStateFacade.jwtDecoded$.subscribe((jwtDecoded) => {
            if (jwtDecoded) {
                this.profileForm.controls.username.setValue(jwtDecoded.user_claims ? jwtDecoded.user_claims.username : null);
                this.profileForm.controls.email.setValue(jwtDecoded.user_claims.email);
                this.profileForm.controls.role.setValue(this.utilsProvider.convertUserPowerToRoleName(jwtDecoded.userPower));
            }
        });
    }

    updateProfile(): void {
        const username = this.profileForm.get("username").value;
        const language = this.selectLanguage.value;
        this.userStateFacade.updateAccount(username, language).subscribe(() => {
            // Success
            this.toastr.success("Updated profile");
        }, () => {
            // Fail
            this.userStateFacade.updateUserError$.pipe(first()).subscribe(error => {
                if (error) {
                    console.error(error);
                    this.toastr.error("Could not update profile: " + this.profileForm.controls.email.value);
                }
            });
        });
    }
}
