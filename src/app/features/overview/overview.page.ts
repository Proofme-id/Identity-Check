import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, FormControl } from "@angular/forms";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { AppStateFacade } from "src/app/state/app/app.facade";
import { UserStateFacade } from "src/app/state/user/user.facade";
import { BaseComponent } from "../base-component/base-component";
import { ToastrService } from "ngx-toastr";
import { UtilsProvider } from "src/app/providers/utils/utils";

@Component({
    templateUrl: "overview.page.html",
    styleUrls: ["overview.page.scss"]
})
export class OverviewPageComponent extends BaseComponent implements OnInit {
    overviewForm: FormGroup;
    editRow: number;

    jwtDecoded$ = this.userStateFacade.jwtDecoded$;

    constructor(
        private router: Router,
        private appStateFacade: AppStateFacade,
        private formBuilder: FormBuilder,
        private userStateFacade: UserStateFacade,
        private translateService: TranslateService,
        private toastr: ToastrService,
        private utilsProvider: UtilsProvider
    ) {
        super();
        this.appStateFacade.setPageTitleLanguageKey("HEADER.OVERVIEW");

        this.overviewForm = this.formBuilder.group({
            username: new FormControl({ value: "", disabled: true }),
            email: new FormControl({ value: "", disabled: true }),
            role: new FormControl({ value: "", disabled: true })
        });
    }
    ngOnInit(): void {
        this.userStateFacade.jwtDecoded$.subscribe((jwtDecoded) => {
            if (jwtDecoded) {
                this.overviewForm.controls.username.setValue(jwtDecoded.user_claims ? jwtDecoded.user_claims.username : null);
                this.overviewForm.controls.email.setValue(jwtDecoded.user_claims.email);
                this.overviewForm.controls.role.setValue(this.utilsProvider.convertUserPowerToRoleName(jwtDecoded.userPower));
            }
        })
    }
}

