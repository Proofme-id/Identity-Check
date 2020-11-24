import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { AppStateFacade } from "src/app/state/app/app.facade";
import { Columns, Config, DefaultConfig } from "ngx-easy-table";
import { BaseComponent } from "../base-component/base-component";
import { filter, skip, takeUntil } from "rxjs/operators";
import { OrganisationStateFacade } from "../../state/organisation/organisation.facade";
import { UtilsProvider } from "src/app/providers/utils/utils";
import { UserStateFacade } from "src/app/state/user/user.facade";

@Component({
    templateUrl: "employees.page.html",
    styleUrls: ["employees.page.scss"]
})
export class EmployeesPageComponent extends BaseComponent implements OnInit {
    overviewForm: FormGroup;
    editRow: number;

    @ViewChild("email") email: ElementRef;
    @ViewChild("publicKey") publicKey: ElementRef;
    @ViewChild("username") username: ElementRef;
    @ViewChild("userPower") userPower: ElementRef;
    @ViewChild("active") active: ElementRef;

    @ViewChild("nameTpl", { static: true }) nameTpl: TemplateRef<unknown>;
    @ViewChild("publicKeyTpl", { static: true }) publicKeyTpl: TemplateRef<unknown>;
    @ViewChild("usernameTpl", { static: true }) usernameTpl: TemplateRef<unknown>;
    @ViewChild("userPowerTpl", { static: true }) userPowerTpl: TemplateRef<unknown>;
    @ViewChild("activeTpl", { static: true }) activeTpl: TemplateRef<unknown>;
    @ViewChild("actionTpl", { static: true }) actionTpl: TemplateRef<unknown>;

    constructor(
        private appStateFacade: AppStateFacade,
        private organisationStateFacade: OrganisationStateFacade,
        private utilsProvider: UtilsProvider,
        private userStateFacade: UserStateFacade
    ) {
        super();
        this.appStateFacade.setPageTitleLanguageKey("HEADER.USERS");
    }

    ngOnInit(): void {
        this.organisationStateFacade.setEmployeesList();
        this.organisationStateFacade.employeesList$.pipe(takeUntil(this.destroy$), filter(x => !!x)).subscribe((employeesList) => {
            this.data = employeesList;
            console.log("employeesList:", employeesList);
        });

        this.configuration = { ...DefaultConfig };
        this.configuration.searchEnabled = false;
        this.columns = [
            { key: "id", title: "ID" },
            { key: "name", title: "Name", cellTemplate: this.nameTpl },
            { key: "publicKey", title: "Publickey" },
            { key: "username", title: "Username", cellTemplate: this.usernameTpl },
            { key: "userPower", title: "User Power", cellTemplate: this.userPowerTpl },
            { key: "active", title: "Active", cellTemplate: this.activeTpl },
            { key: "action", title: "Actions", cellTemplate: this.actionTpl }
        ];

        // this.userStateFacade.updateUserAdminError$.pipe(skip(1), filter(x => x !== null), takeUntil(this.destroy$)).subscribe((error) => {
        //     console.log("updateUserAdminError:", error);
        //     if (error) {
        //         console.log("show error!");
        //         this.toastr.error("Error updating user");
        //     }
        // });
        // this.userStateFacade.updateUserAdminSuccess$.pipe(skip(1), filter(x => x !== null), takeUntil(this.destroy$)).subscribe((success) => {
        //     if (success) {
        //         this.toastr.success("Successfully updated user");
        //     }
        // });
    }

    public configuration: Config;
    public columns: Columns[];

    public data = []

    edit(rowIndex: number): void {
        this.editRow = rowIndex;
    }

    update(): void {
        const user = this.data.find(x => x.email === this.email.nativeElement.value);
        this.userStateFacade.updateUserAdmin({
            id: user.id,
            email: this.email.nativeElement.value,
            username: this.username.nativeElement.value,
            userPower: this.userPower.nativeElement.value,
            active: this.active.nativeElement.value,
        });
        const sub = this.userStateFacade.updateUserAdminSuccess$.pipe(skip(1), takeUntil(this.destroy$)).subscribe((success) => {
            if (success) {
                sub.unsubscribe();
                this.data = [
                    ...this.data.map((obj, index) => {
                        if (index === this.editRow) {
                            return {
                                email: this.email.nativeElement.value,
                                username: this.username.nativeElement.value,
                                userPower: this.utilsProvider.convertUserPowerToRoleName(this.userPower.nativeElement.value),
                                active: this.active.nativeElement.value,
                            };
                        }
                        return obj;
                    }),
                ];
                this.editRow = -1;
            }
        });
    }
}
