import { Component } from "@angular/core";
import { BsModalService } from "ngx-bootstrap/modal";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { OrganisationStateFacade } from "../../state/organisation/organisation.facade";

@Component({
    selector: "employee-invite-modal",
    templateUrl: "./employeeInviteModal.component.html"
})
export class EmployeeInviteModalComponent {

    public inviteForm: FormGroup;

    constructor(
        private modalService: BsModalService,
        private formBuilder: FormBuilder,
        private organisationStateFacade: OrganisationStateFacade
    ) {
        this.inviteForm = this.formBuilder.group({
            name: new FormControl("", Validators.required),
            email: new FormControl("", Validators.required)
        });
    }

    invite(): void {
        const name: string = this.inviteForm.get("name").value;
        const email: string = this.inviteForm.get("email").value;
        this.organisationStateFacade.inviteEmployee(name, email);
        this.closeModal()
    }

    closeModal(): void {
        this.modalService.hide();
    }
}
