import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { AppStateFacade } from "src/app/state/app/app.facade";
import { Columns, Config, DefaultConfig } from "ngx-easy-table";
import { BaseComponent } from "../base-component/base-component";
import { filter, takeUntil } from "rxjs/operators";
import { OrganisationStateFacade } from "../../state/organisation/organisation.facade";
import { ToastrService } from "ngx-toastr";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { SupplierAddModalComponent } from "../../modals/supplier-add-modal/supplierAddModal.component";
import { DeleteModalComponent } from "src/app/modals/delete-modal/deleteModal.component";
import { ISupplier } from "src/app/interfaces/supplier.interface";

@Component({
    templateUrl: "suppliers.page.html",
    styleUrls: ["suppliers.page.scss"]
})

export class SuppliersPageComponent extends BaseComponent implements OnInit {

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
        private organisationStateFacade: OrganisationStateFacade,
        private toastr: ToastrService,
        private modalService: BsModalService
    ) {
        super();
        this.appStateFacade.setPageTitleLanguageKey("SUPPLIER.title");
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
            { key: "name", title: "Name" },
            { key: "details.description", title: "Description"},
            { key: "action", title: "Actions", cellTemplate: this.actionTpl }
        ];
    }

    public configuration: Config;
    public columns: Columns[];

    public data = []
    
    delete(supplier: ISupplier): void {
        const initialState = { name };
        this.modalRef = this.modalService.show(DeleteModalComponent, {initialState, class: "modal-sm modal-dialog-centered", ignoreBackdropClick: true });
        this.modalRef.content.onClose.pipe(filter(x => !!x)).subscribe(() => {
            this.organisationStateFacade.deleteSupplier(supplier.id);
        })
    }

    view(supplier: ISupplier): void {
        console.log("supplier ", supplier);
    }

    add(): void {
        this.modalService.show(SupplierAddModalComponent, {class: "modal-lg modal-dialog-centered", ignoreBackdropClick: true });
    }
}
