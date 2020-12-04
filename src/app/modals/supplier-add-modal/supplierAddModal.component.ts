import { Component } from "@angular/core";
import { BsModalService } from "ngx-bootstrap/modal";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { OrganisationStateFacade } from "../../state/organisation/organisation.facade";
import { SupplierStateFacade } from "src/app/state/supplier/supplier.facade";

@Component({
    selector: "supplier-add-modal",
    templateUrl: "./supplierAddModal.component.html"
})
export class SupplierAddModalComponent {


    public addForm: FormGroup;

    constructor(
        private modalService: BsModalService,
        private formBuilder: FormBuilder,
        private organisationStateFacade: OrganisationStateFacade,
        private supplierStateFacade: SupplierStateFacade
    ) {
        this.addForm = this.formBuilder.group({
            name: new FormControl("", Validators.required),
            description: new FormControl("", Validators.required)
        });
    }

    add(): void {
        const name: string = this.addForm.get("name").value;
        const description: string = this.addForm.get("description").value;
        this.supplierStateFacade.addSupplier(name, description);
        this.closeModal()
    }

    closeModal(): void {
        this.modalService.hide();
    }
}
