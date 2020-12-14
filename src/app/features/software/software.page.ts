import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { AppStateFacade } from "src/app/state/app/app.facade";
import { Columns, Config, DefaultConfig } from "ngx-easy-table";
import { BaseComponent } from "../base-component/base-component";
import { filter, takeUntil } from "rxjs/operators";
import { OrganisationStateFacade } from "../../state/organisation/organisation.facade";
import { DeleteModalComponent } from "../../modals/delete-modal/deleteModal.component"
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { ISoftware } from "src/app/interfaces/software.interface";
import { SoftwareStateFacade } from "src/app/state/software/software.facade";
import { SoftwareModalComponent } from "src/app/modals/software-modal/softwareModal.component";
import { IEmployee } from "src/app/interfaces/employee.interface";

@Component({
    templateUrl: "software.page.html",
    styleUrls: ["software.page.scss"]
})
export class SoftwarePageComponent extends BaseComponent implements OnInit {

    @ViewChild("name") name: ElementRef;
    @ViewChild("details.description") description: ElementRef;
    @ViewChild("actionTpl", { static: true }) actionTpl: TemplateRef<unknown>;

    modalRef: BsModalRef;
    configuration: Config;
    columns: Columns[];
    data = []
    employeeList: IEmployee[];

    constructor(
        private appStateFacade: AppStateFacade,
        private organisationStateFacade: OrganisationStateFacade,
        private modalService: BsModalService,
        private softwareStateFacade: SoftwareStateFacade,
    ) {
        super();
        this.organisationStateFacade.employeesList$
        this.appStateFacade.setPageTitleLanguageKey("SOFTWARE.title");
    }

    ngOnInit(): void {
        this.softwareStateFacade.setSoftwareList();
        this.softwareStateFacade.softwareList$.pipe(takeUntil(this.destroy$), filter(x => !!x)).subscribe((softwareList) => {
            this.data = softwareList;
            console.log("softwareList:", softwareList);
        });

        this.organisationStateFacade.setEmployeesList();
        this.organisationStateFacade.employeesList$.pipe(takeUntil(this.destroy$), filter(x => !!x)).subscribe((employeeList) => {
            console.log("employeeList:", employeeList);
            this.employeeList = employeeList;
        });

        this.configuration = { ...DefaultConfig };
        this.configuration.searchEnabled = false;
        this.columns = [
            { key: "id", title: "ID" },
            { key: "name", title: "Name" },
            { key: "details.description", title: "description" },
            { key: "action", title: "Actions", cellTemplate: this.actionTpl }
        ];
    }

    delete(software: ISoftware): void {
        const initialState = { name: software.name };
        this.modalRef = this.modalService.show(DeleteModalComponent, {initialState, class: "modal-sm modal-dialog-centered", ignoreBackdropClick: true });
        this.modalRef.content.onClose.pipe(filter(x => !!x)).subscribe(() => {
            this.softwareStateFacade.deleteSoftware(software.id);
        })
    }

    openModal(software: ISoftware): void {
        console.log("software:", software);
        const initialState = { software, employeeList: this.employeeList }
        this.modalService.show(SoftwareModalComponent, {initialState, class: "modal-lg modal-dialog-centered", ignoreBackdropClick: true });
    }
}
