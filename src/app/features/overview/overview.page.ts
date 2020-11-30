import { Component, ElementRef, OnInit, TemplateRef, ViewChild  } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { Columns, Config, DefaultConfig } from "ngx-easy-table";
import { TranslateService } from "@ngx-translate/core";
import { takeUntil } from "rxjs/operators";
import { AppStateFacade } from "src/app/state/app/app.facade";
import { UserStateFacade } from "src/app/state/user/user.facade";
import { BaseComponent } from "../base-component/base-component";

@Component({
    templateUrl: "overview.page.html",
    styleUrls: ["overview.page.scss"]
})
export class OverviewPageComponent extends BaseComponent implements OnInit {
    overviewForm: FormGroup;
    editRow: number;

    @ViewChild("email") email: ElementRef;

    @ViewChild("emailTpl", { static: true }) emailTpl: TemplateRef<unknown>;
    @ViewChild("actionTpl", { static: true }) actionTpl: TemplateRef<unknown>;

    constructor(
        private router: Router,
        private appStateFacade: AppStateFacade,
        private test:FormBuilder,
        private userStateFacade: UserStateFacade,
        private translateService: TranslateService
    ) {
        super();
        this.appStateFacade.setPageTitleLanguageKey("HEADER.OVERVIEW");
        this.userStateFacade.setUsersList();
        this.userStateFacade.jwtDecoded$.pipe(takeUntil(this.destroy$)).subscribe(jwt => {
            this.appStateFacade.setLanguage(jwt.lang);
            this.translateService.use(jwt.lang);
        });
        this.userStateFacade.usersList$.pipe(takeUntil(this.destroy$)).subscribe((usersList) => {
            this.data = usersList;
            console.log("data:", this.data);
        });
    }
    ngOnInit(): void {
        this.configuration = { ...DefaultConfig };
        this.configuration.searchEnabled = false;
        this.columns = [
            { key: "email", title: "Email", cellTemplate: this.emailTpl },
            { key: "action", title: "Actions", cellTemplate: this.actionTpl }
        ];
    }

    edit(rowIndex: number): void {
        this.editRow = rowIndex;
    }

    public configuration: Config;
    public columns: Columns[];
    public data = []

    update(): void {
        const user = this.data.find(x => x.email === this.email.nativeElement.value);
        // this.userStateFacade.updateUserAdmin({
        //     id: user.id,
        //     email: this.email.nativeElement.value,
        //     username: this.username.nativeElement.value,
        //     userPower: this.userPower.nativeElement.value,
        //     active: this.active.nativeElement.value,
        // });
        // const sub = this.userStateFacade.updateUserAdminSuccess$.pipe(skip(1), takeUntil(this.destroy$)).subscribe((success) => {
        //     if (success) {
        //         sub.unsubscribe();
                this.data = [
                    ...this.data.map((obj, index) => {
                        if (index === this.editRow) {
                            return {
                                email: this.email.nativeElement.value,
                            };
                        }
                        return obj;
                    }),
                ];
                this.editRow = -1;
            }
    //     });
    // }
}
