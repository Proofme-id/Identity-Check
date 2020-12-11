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
import { SoftwareStateFacade } from "src/app/state/software/software.facade";

@Component({
    templateUrl: "software.page.html",
    styleUrls: ["software.page.scss"]
})
export class SoftwarePageComponent extends BaseComponent implements OnInit {

    @ViewChild("name") name: ElementRef;
    @ViewChild("details.description") description: ElementRef;
    @ViewChild("actionTpl", { static: true }) actionTpl: TemplateRef<unknown>;

    public modalRef: BsModalRef;

    constructor(
        private appStateFacade: AppStateFacade,
        private organisationStateFacade: OrganisationStateFacade,
        private modalService: BsModalService,
        private softwareStateFacade: SoftwareStateFacade
    ) {
        super();
        this.appStateFacade.setPageTitleLanguageKey("SOFTWARE.title");
    }

    ngOnInit(): void {
        this.softwareStateFacade.setSoftwareList();
        this.softwareStateFacade.softwareList$.pipe(takeUntil(this.destroy$), filter(x => !!x)).subscribe((softwareList) => {
            this.data = softwareList;
            console.log("softwareList:", softwareList);
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

    public configuration: Config;
    public columns: Columns[];

    public data = []

    delete(software: ISoftware): void {
        const initialState = { name };
        this.modalRef = this.modalService.show(DeleteModalComponent, {initialState, class: "modal-sm modal-dialog-centered", ignoreBackdropClick: true });
        this.modalRef.content.onClose.pipe(filter(x => !!x)).subscribe(() => {
            this.softwareStateFacade.deleteSoftware(software.id);
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
