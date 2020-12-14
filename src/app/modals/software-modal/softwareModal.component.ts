import { Component, Input, OnInit } from "@angular/core";
import { BsModalService } from "ngx-bootstrap/modal";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { SoftwareStateFacade } from "src/app/state/software/software.facade";
import { IEmployee } from "src/app/interfaces/employee.interface";
import { ISoftware } from "src/app/interfaces/software.interface";

@Component({
    selector: "software-modal",
    templateUrl: "./softwareModal.component.html"
})
export class SoftwareModalComponent implements OnInit {

    public form: FormGroup;

    @Input()
    software: ISoftware;

    @Input()
    employeeList: IEmployee[];

    constructor(
        private modalService: BsModalService,
        private formBuilder: FormBuilder,
        private softwareStateFacade: SoftwareStateFacade
    ) {

    }

    ngOnInit(): void {
        console.log("Update software:", this.software);
        this.form = this.formBuilder.group({
            name: new FormControl(this.software ? this.software.name : null, Validators.required),
            description: new FormControl(this.software ? this.software.details.description : null, Validators.required),
            employeeId: new FormControl(this.software ? this.software.employeeId : null)
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
        this.softwareStateFacade.updateSoftware(this.software.id, name, description, employeeId);
        this.closeModal()
    }

    add(): void {
        const name: string = this.form.get("name").value;
        const description: string = this.form.get("description").value;
        const employeeId = this.form.get("employeeId").value;
        console.log("employeeId:", employeeId);
        this.softwareStateFacade.addSoftware(name, description, employeeId);
        this.closeModal();
    }

    closeModal(): void {
        this.modalService.hide();
    }
}
