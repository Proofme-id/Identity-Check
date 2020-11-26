import { Component } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';
import { AppStateFacade } from "src/app/state/app/app.facade";
import { UserStateFacade } from 'src/app/state/user/user.facade';
import { BaseComponent } from '../base-component/base-component';

@Component({
    templateUrl: "overview.page.html",
    styleUrls: ["overview.page.scss"]
})
export class OverviewPageComponent extends BaseComponent {
    overviewForm: FormGroup;
    constructor(
        private router: Router,
        private appStateFacade: AppStateFacade,
        private test:FormBuilder,
        private userStateFacade: UserStateFacade,
        private translateService: TranslateService
    ) {
        super();
        this.appStateFacade.setPageTitleLanguageKey("HEADER.OVERVIEW");
        this.overviewForm = this.test.group({
            text: new FormControl("", Validators.required),
            text1: new FormControl("", Validators.required),
            datum1: new FormControl("", Validators.required),
            tijd1: new FormControl("", Validators.required),
            opmerking: new FormControl(""),
        });

        this.userStateFacade.jwtDecoded$.pipe(takeUntil(this.destroy$)).subscribe(jwt => {
            this.appStateFacade.setLanguage(jwt.lang);
            this.translateService.use(jwt.lang);
        });
    }
}
