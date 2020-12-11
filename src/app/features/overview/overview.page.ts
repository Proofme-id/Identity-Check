import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { Columns, Config, DefaultConfig } from "ngx-easy-table";
import { filter, takeUntil } from "rxjs/operators";
import { AppStateFacade } from "src/app/state/app/app.facade";
import { UserStateFacade } from "src/app/state/user/user.facade";
import { BaseComponent } from "../base-component/base-component";
import { HardwareStateFacade } from "src/app/state/hardware/hardware.facade";
import { SoftwareStateFacade } from "src/app/state/software/software.facade";

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

    jwtDecoded$ = this.userStateFacade.jwtDecoded$;

    constructor(
        private appStateFacade: AppStateFacade,
        private userStateFacade: UserStateFacade,
        private hardwareStateFacade: HardwareStateFacade,
        private softwareStateFacade: SoftwareStateFacade
    ) {
        super();
        this.appStateFacade.setPageTitleLanguageKey("HEADER.OVERVIEW");
    }
    ngOnInit(): void {

        this.hardwareStateFacade.setHardwareList();
        this.hardwareStateFacade.hardwareList$.pipe(takeUntil(this.destroy$), filter(x => !!x)).subscribe((hardwareList) => {
            this.dataHardware = hardwareList;
        });

        this.configurationHardware = { ...DefaultConfig };
        this.configurationHardware.searchEnabled = false;
        this.columnsHardware = [
            { key: "name", title: "Name" },
            { key: "details.serialnumber", title: "Serialnumber" }
        ];

        this.softwareStateFacade.setSoftwareList();
        this.softwareStateFacade.softwareList$.pipe(takeUntil(this.destroy$), filter(x => !!x)).subscribe((softwareList) => {
            this.dataSoftware = softwareList;
            console.log("softwareList:", softwareList);
        });

        this.configurationSoftware = { ...DefaultConfig };
        this.configurationSoftware.searchEnabled = false;
        this.columnsSofware = [
            { key: "name", title: "Name" },
            { key: "details.description", title: "description" }
        ];

    }
    public configurationHardware: Config;
    public columnsHardware: Columns[];
    public dataHardware = []

    public configurationSoftware: Config;
    public columnsSofware: Columns[];
    public dataSoftware = []

}



