import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { AppStateFacade } from "src/app/state/app/app.facade";
import { Columns, Config, DefaultConfig } from "ngx-easy-table";
import { BaseComponent } from "../base-component/base-component";
import { filter, takeUntil } from "rxjs/operators";
import { OrganisationStateFacade } from "../../state/organisation/organisation.facade";
import { ToastrService } from "ngx-toastr";
// import { DeleteModalComponent } from "../../modals/delete-modal/deleteModal.component"
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { SupplierAddModalComponent } from "../../modals/supplier-add-modal/supplierAddModal.component";
import { DeleteModalComponent } from "src/app/modals/delete-modal/deleteModal.component";


@Component({
    templateUrl: "suppliers.page.html",
    styleUrls: ["suppliers.page.scss"]
})

export class SuppliersPageComponent extends BaseComponent implements OnInit {

    @ViewChild("id") id: ElementRef;
    @ViewChild("name") name: ElementRef;

    @ViewChild("nameTpl", { static: true }) NameTpl: TemplateRef<unknown>;
    @ViewChild("idTpl", { static: true }) activeTpl: TemplateRef<unknown>;
    @ViewChild("actionTpl", { static: true }) actionTpl: TemplateRef<unknown>;

    public modalRef: BsModalRef;

    constructor(
        private appStateFacade: AppStateFacade,
        private organisationStateFacade: OrganisationStateFacade,
        private toastr: ToastrService,
        private modalService: BsModalService
    ) {
        super();
        this.appStateFacade.setPageTitleLanguageKey("Supplier.title");
    }

    ngOnInit(): void {
        this.organisationStateFacade.setSupplierList();
        this.organisationStateFacade.supplierList$.pipe(takeUntil(this.destroy$), filter(x => !!x)).subscribe((supplierList) => {
            this.data = supplierList;
            console.log("supplierList:", supplierList);
        });

        this.configuration = { ...DefaultConfig };
        this.configuration.searchEnabled = false;
        this.columns = [
            { key: "id", title: "ID" },
            { key: "name", title: "Name" },
            { key: "action", title: "Actions", cellTemplate: this.actionTpl }
        ];
    }

    public configuration: Config;
    public columns: Columns[];

    public data = []
    
    delete(name: string, id: number): void {
        const initialState = { name };
        this.modalRef = this.modalService.show(DeleteModalComponent, {initialState, class: "modal-sm modal-dialog-centered", ignoreBackdropClick: true });
        this.modalRef.content.onClose.subscribe((result) => {
            console.log("Delete record: ", result);
            console.log("Name: ", name);
            console.log("Id: ", id);
            // Todo: Add action!
        })
    }

    view(name: string, id: number): void {
        console.log("id ", id);
        console.log("name: ", name);
    }

    add(): void {
        this.modalService.show(SupplierAddModalComponent, {class: "modal-lg modal-dialog-centered", ignoreBackdropClick: true });
    }
}
