import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { AppStateFacade } from "src/app/state/app/app.facade";
import { Columns, Config, DefaultConfig } from "ngx-easy-table";
import { BaseComponent } from "../base-component/base-component";
import { filter, takeUntil } from "rxjs/operators";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { DeleteModalComponent } from "src/app/modals/delete-modal/deleteModal.component";
import { IHardware } from "src/app/interfaces/hardware.interface";
import { HardwareStateFacade } from "src/app/state/hardware/hardware.facade";
import { IEmployee } from "src/app/interfaces/employee.interface";
import { OrganisationStateFacade } from "src/app/state/organisation/organisation.facade";
import { HardwareModalComponent } from "src/app/modals/hardware-modal/hardwareModal.component";

@Component({
    templateUrl: "hardware.page.html",
    styleUrls: ["hardware.page.scss"]
})

export class HardwarePageComponent extends BaseComponent implements OnInit {

    @ViewChild("id") id: ElementRef;
    @ViewChild("name") name: ElementRef;
    @ViewChild("description") description: ElementRef;
    @ViewChild("serialnumber") serialnumber: ElementRef;
    @ViewChild("actionTpl", { static: true }) actionTpl: TemplateRef<unknown>;

    modalRef: BsModalRef;
    configuration: Config;
    columns: Columns[];
    data = []
    employeeList: IEmployee[];

    constructor(
        private appStateFacade: AppStateFacade,
        private modalService: BsModalService,
        private hardwareStateFacade: HardwareStateFacade,
        private organisationStateFacade: OrganisationStateFacade
    ) {
        super();
        this.appStateFacade.setPageTitleLanguageKey("HARDWARE.title");
    }

    ngOnInit(): void {
        this.hardwareStateFacade.setHardwareList();
        this.hardwareStateFacade.hardwareList$.pipe(takeUntil(this.destroy$), filter(x => !!x)).subscribe((hardwareList) => {
            this.data = hardwareList;
        });

        this.organisationStateFacade.setEmployeesList();
        this.organisationStateFacade.employeesList$.pipe(takeUntil(this.destroy$), filter(x => !!x)).subscribe((employeeList) => {
            console.log("employeeList:", employeeList);
            this.employeeList = employeeList;
        });
        
        this.configuration = { ...DefaultConfig };
        this.configuration.searchEnabled = false;
        this.columns = [
            { key: "name", title: "Name" },
            { key: "details.description", title: "Description" },
            { key: "details.serialnumber", title: "Serialnumber" },
            { key: "action", title: "Actions", cellTemplate: this.actionTpl }
        ];
    }

    delete(hardware: IHardware): void {
        const initialState = { name: hardware.name };
        this.modalRef = this.modalService.show(DeleteModalComponent, {initialState, class: "modal-sm modal-dialog-centered", ignoreBackdropClick: true });
        this.modalRef.content.onClose.pipe(filter(x => !!x)).subscribe(() => {
            this.hardwareStateFacade.deleteHardware(hardware.id);
        })
    }

    openModal(hardware: IHardware): void {
        console.log("hardware:", hardware);
        const initialState = { hardware, employeeList: this.employeeList }
        this.modalService.show(HardwareModalComponent, {initialState, class: "modal-lg modal-dialog-centered", ignoreBackdropClick: true });
    }
}
