import { Component } from "@angular/core";
import { BsModalService } from "ngx-bootstrap/modal";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";

@Component({
    selector: "supplier-add-modal",
    templateUrl: "./supplierAddModal.component.html"
})
export class SupplierAddModalComponent {

    public addForm: FormGroup;

    constructor(
        private modalService: BsModalService,
        private formBuilder: FormBuilder,
        private toastr: ToastrService
    ) {
        this.addForm = this.formBuilder.group({
            id: new FormControl("", Validators.required),
            name: new FormControl("", Validators.required)
        });
    }

    add(): void {
        const addData = {
            id: this.addForm.get("id").value,
            name: this.addForm.get("name").value
        }
        console.log("add: ", addData);
        this.toastr.success(addData.name + " added");
        this.closeModal()
    }

    closeModal(): void {
        this.modalService.hide();
    }
}
