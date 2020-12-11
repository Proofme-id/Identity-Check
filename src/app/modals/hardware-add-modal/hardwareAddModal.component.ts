import { Component } from "@angular/core";
import { BsModalService } from "ngx-bootstrap/modal";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { HardwareStateFacade } from "src/app/state/hardware/hardware.facade";

@Component({
    selector: "hardware-add-modal",
    templateUrl: "./hardwareAddModal.component.html"
})
export class HardwareAddModalComponent {

    public addHardwareForm: FormGroup;

    constructor(
        private modalService: BsModalService,
        private formBuilder: FormBuilder,
        private hardwareStateFacade: HardwareStateFacade
    ) {
        this.addHardwareForm = this.formBuilder.group({
            name: new FormControl("", Validators.required),
            description: new FormControl("", Validators.required),
            serialnumber: new FormControl("", Validators.required)
        });
    }

    add(): void {
        const name: string = this.addHardwareForm.get("name").value;
        const description: string = this.addHardwareForm.get("description").value;
        const serialnumber: string = this.addHardwareForm.get("serialnumber").value;
        this.hardwareStateFacade.addHardware(name, description, serialnumber);
        this.closeModal()
    }

    closeModal(): void {
        this.modalService.hide();
    }
}
