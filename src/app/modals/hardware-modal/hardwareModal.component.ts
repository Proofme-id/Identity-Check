import { Component, Input, OnInit } from "@angular/core";
import { BsModalService } from "ngx-bootstrap/modal";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { HardwareStateFacade } from "src/app/state/hardware/hardware.facade";
import { IEmployee } from "src/app/interfaces/employee.interface";
import { IHardware } from "src/app/interfaces/hardware.interface";

@Component({
    selector: "hardware-modal",
    templateUrl: "./hardwareModal.component.html"
})
export class HardwareModalComponent implements OnInit {

    public form: FormGroup;

    @Input()
    hardware: IHardware;

    @Input()
    employeeList: IEmployee[];

    constructor(
        private modalService: BsModalService,
        private formBuilder: FormBuilder,
        private hardwareStateFacade: HardwareStateFacade
    ) {

    }

    ngOnInit(): void {
        console.log("Update hardware:", this.hardware);
        this.form = this.formBuilder.group({
            name: new FormControl(this.hardware ? this.hardware.name : null, Validators.required),
            description: new FormControl(this.hardware ? this.hardware.details.description : null, Validators.required),
            serialnumber: new FormControl(this.hardware ? this.hardware.details.serialnumber : null, Validators.required),
            employeeId: new FormControl(this.hardware ? this.hardware.employeeId : null)
        });
    }

    update(): void {
        const name: string = this.form.get("name").value;
        const description: string = this.form.get("description").value;
        let employeeId = this.form.get("employeeId").value;
        if (employeeId) {
            employeeId = parseInt(employeeId, 10);
        }
        console.log("employeeId", employeeId);
        this.hardwareStateFacade.updateHardware(this.hardware.id, name, description, employeeId);
        this.closeModal()
    }

    add(): void {
        const name: string = this.form.get("name").value;
        const description: string = this.form.get("description").value;
        const serialnumber: string = this.form.get("serialnumber").value;
        const employeeId = this.form.get("employeeId").value;
        this.hardwareStateFacade.addHardware(name, description, serialnumber, employeeId);
        this.closeModal()
    }

    closeModal(): void {
        this.modalService.hide();
    }
}
