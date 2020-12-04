import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { AppStateFacade } from "src/app/state/app/app.facade";
import { Columns, Config, DefaultConfig } from "ngx-easy-table";
import { BaseComponent } from "../base-component/base-component";
import { filter, takeUntil } from "rxjs/operators";
import { OrganisationStateFacade } from "../../state/organisation/organisation.facade";
import { DeleteModalComponent } from "../../modals/delete-modal/deleteModal.component"
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { ISoftware } from "src/app/interfaces/software.interface";
import { SoftwareAddModalComponent } from "src/app/modals/software-add-modal/softwareAddModal.component";

@Component({
    templateUrl: "software.page.html",
    styleUrls: ["software.page.scss"]
})
export class SoftwarePageComponent extends BaseComponent implements OnInit {

    @ViewChild("name") name: ElementRef;
    @ViewChild("description") description: ElementRef;
    @ViewChild("activeTpl", { static: true }) activeTpl: TemplateRef<unknown>;
    @ViewChild("actionTpl", { static: true }) actionTpl: TemplateRef<unknown>;

    public modalRef: BsModalRef;

    constructor(
        private appStateFacade: AppStateFacade,
        private organisationStateFacade: OrganisationStateFacade,
        private modalService: BsModalService
    ) {
        super();
        this.appStateFacade.setPageTitleLanguageKey("SOFTWARE.title");
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
            { key: "name", title: "Name" },
            { key: "description", title: "description" },
            { key: "action", title: "Actions", cellTemplate: this.actionTpl }
        ];
    }

    public configuration: Config;
    public columns: Columns[];

    public data = []

    delete(software: ISoftware): void {
        const initialState = { name };
        this.modalRef = this.modalService.show(DeleteModalComponent, {initialState, class: "modal-sm modal-dialog-centered", ignoreBackdropClick: true });
        this.modalRef.content.onClose.pipe(filter(x => !!x)).subscribe(() => {
            this.organisationStateFacade.deleteEmployee(software.id);
        })
    }

    view(software: ISoftware): void {
        // Todo: create modal for viewing employees
        console.log("software:", software);
    }

    add(): void {
        this.modalService.show(SoftwareAddModalComponent, {class: "modal-lg modal-dialog-centered", ignoreBackdropClick: true });
    }
}
