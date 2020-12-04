import { Component } from "@angular/core";
import { BsModalService } from "ngx-bootstrap/modal";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { OrganisationStateFacade } from "../../state/organisation/organisation.facade";

@Component({
    selector: "hardware-add-modal",
    templateUrl: "./hardwareAddModal.component.html"
})
export class HardwareAddModalComponent {


    public addHardwareForm: FormGroup;

    constructor(
        private modalService: BsModalService,
        private formBuilder: FormBuilder,
        private organisationStateFacade: OrganisationStateFacade
    ) {
        this.addHardwareForm = this.formBuilder.group({
            name: new FormControl("", Validators.required),
            description: new FormControl("", Validators.required)
        });
    }

    add(): void {
        const name: string = this.addHardwareForm.get("name").value;
        const description: string = this.addHardwareForm.get("description").value;
        this.organisationStateFacade.AddHardware(name, description);
        this.closeModal()
    }

    closeModal(): void {
        this.modalService.hide();
    }
}
