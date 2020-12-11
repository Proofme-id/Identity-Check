import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { AppStateFacade } from "src/app/state/app/app.facade";
import { Columns, Config, DefaultConfig } from "ngx-easy-table";
import { BaseComponent } from "../base-component/base-component";
import { filter, takeUntil } from "rxjs/operators";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { HardwareAddModalComponent } from "../../modals/hardware-add-modal/hardwareAddModal.component";
import { DeleteModalComponent } from "src/app/modals/delete-modal/deleteModal.component";
import { IHardware } from "src/app/interfaces/hardware.interface";
import { HardwareStateFacade } from "src/app/state/hardware/hardware.facade";

@Component({
    templateUrl: "hardware.page.html",
    styleUrls: ["hardware.page.scss"]
})

export class HardwarePageComponent extends BaseComponent implements OnInit {

    @ViewChild("id") id: ElementRef;
    @ViewChild("name") name: ElementRef;
    @ViewChild("description") description: ElementRef;

    @ViewChild("nameTpl", { static: true }) nameTpl: TemplateRef<unknown>;
    @ViewChild("idTpl", { static: true }) idTpl: TemplateRef<unknown>;
    @ViewChild("descriptionTpl", {static: true }) descriptionTpl: TemplateRef<unknown>;
    @ViewChild("actionTpl", { static: true }) actionTpl: TemplateRef<unknown>;

    public modalRef: BsModalRef;

    constructor(
        private appStateFacade: AppStateFacade,
        private modalService: BsModalService,
        private hardwareStateFacade: HardwareStateFacade
    ) {
        super();
        this.appStateFacade.setPageTitleLanguageKey("HARDWARE.title");
    }

    ngOnInit(): void {
        this.hardwareStateFacade.setHardwareList();
        this.hardwareStateFacade.hardwareList$.pipe(takeUntil(this.destroy$), filter(x => !!x)).subscribe((hardwareList) => {
            this.data = hardwareList;
        });
        
        this.configuration = { ...DefaultConfig };
        this.configuration.searchEnabled = false;
        this.columns = [
            { key: "name", title: "Name" },
            { key: "details.description", title: "Description"},
            { key: "action", title: "Actions", cellTemplate: this.actionTpl }
        ];
    }

    public configuration: Config;
    public columns: Columns[];

    public data = []

    delete(hardware: IHardware): void {
        const initialState = { name: hardware.name };
        this.modalRef = this.modalService.show(DeleteModalComponent, {initialState, class: "modal-sm modal-dialog-centered", ignoreBackdropClick: true });
        this.modalRef.content.onClose.pipe(filter(x => !!x)).subscribe(() => {
            this.hardwareStateFacade.deleteHardware(hardware.id);
        })
    }

    view(hardware: IHardware): void {
        console.log("hardware ", hardware);
    }

    add(): void {
        this.modalService.show(HardwareAddModalComponent, {class: "modal-lg modal-dialog-centered", ignoreBackdropClick: true });
    }
}
