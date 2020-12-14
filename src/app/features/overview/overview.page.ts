import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { Columns, Config, DefaultConfig } from "ngx-easy-table";
import { filter, takeUntil } from "rxjs/operators";
import { AppStateFacade } from "src/app/state/app/app.facade";
import { UserStateFacade } from "src/app/state/user/user.facade";
import { BaseComponent } from "../base-component/base-component";

@Component({
    templateUrl: "overview.page.html",
    styleUrls: ["overview.page.scss"]
})
export class OverviewPageComponent extends BaseComponent implements OnInit {
    @ViewChild("id") id: ElementRef;
    @ViewChild("name") name: ElementRef;
    @ViewChild("description") description: ElementRef;

    overviewForm: FormGroup;
    editRow: number;
    configurationHardware: Config;
    columnsHardware: Columns[];
    dataHardware = []
    configurationSoftware: Config;
    columnsSofware: Columns[];
    dataSoftware = []

    jwtDecoded$ = this.userStateFacade.jwtDecoded$;

    constructor(
        private appStateFacade: AppStateFacade,
        private userStateFacade: UserStateFacade
    ) {
        super();
        this.appStateFacade.setPageTitleLanguageKey("HEADER.OVERVIEW");
    }
    ngOnInit(): void {
        this.userStateFacade.userProfile$.pipe(takeUntil(this.destroy$), filter(x => !!x)).subscribe((userProfile) => {
            this.dataHardware = userProfile.hardware;
            this.dataSoftware = userProfile.software;
        })
        this.configurationHardware = { ...DefaultConfig };
        this.configurationHardware.searchEnabled = false;
        this.columnsHardware = [
            { key: "name", title: "Name" },
            { key: "details.serialnumber", title: "Serialnumber" }
        ];
        this.configurationSoftware = { ...DefaultConfig };
        this.configurationSoftware.searchEnabled = false;
        this.columnsSofware = [
            { key: "name", title: "Name" },
            { key: "details.description", title: "description" }
        ];

    }
}