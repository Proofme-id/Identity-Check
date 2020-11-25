import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { AppStateFacade } from "src/app/state/app/app.facade";
import { Columns, Config, DefaultConfig } from "ngx-easy-table";
import { UtilsProvider } from "src/app/providers/utils/utils";
import { BaseComponent } from "../base-component/base-component";
import { takeUntil } from "rxjs/operators";
import { ToastrService } from "ngx-toastr";
import { OrganisationStateFacade } from "../../state/organisation/organisation.facade";

@Component({
    templateUrl: "organisations.page.html",
    styleUrls: ["organisations.page.scss"]
})
export class OrganisationsPageComponent extends BaseComponent implements OnInit {
    overviewForm: FormGroup;
    editRow: number;

    @ViewChild("name") name: ElementRef;
    @ViewChild("active") active: ElementRef;

    @ViewChild("nameTpl", { static: true }) nameTpl: TemplateRef<unknown>;
    @ViewChild("activeTpl", { static: true }) activeTpl: TemplateRef<unknown>;
    @ViewChild("actionTpl", { static: true }) actionTpl: TemplateRef<unknown>;

    constructor(
        private appStateFacade: AppStateFacade,
        private utilsProvider: UtilsProvider,
        private organisationStateFacade: OrganisationStateFacade,
        private toastr: ToastrService
    ) {
        super();
        this.appStateFacade.setPageTitleLanguageKey("HEADER.USERS");
    }

    ngOnInit(): void {
        this.organisationStateFacade.setOrganisationsList();
        this.organisationStateFacade.organisationsList$.pipe(takeUntil(this.destroy$)).subscribe((organisationList) => {
            this.data = organisationList;
        });

        this.configuration = { ...DefaultConfig };
        this.configuration.searchEnabled = false;
        this.columns = [
            { key: "id", title: "ID" },
            { key: "name", title: "name", cellTemplate: this.nameTpl},
            { key: "active", title: "Active", cellTemplate: this.activeTpl },
            { key: "action", title: "Actions", cellTemplate: this.actionTpl }
        ];
    }

    public configuration: Config;
    public columns: Columns[];

    public data = []

    edit(rowIndex: number): void {
        this.editRow = rowIndex;
    }
}
