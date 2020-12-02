import { Component } from "@angular/core";
import { BsModalService } from "ngx-bootstrap/modal";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";

@Component({
    selector: "employee-invite-modal",
    templateUrl: "./employeeInviteModal.component.html"
})
export class EmployeeInviteModalComponent {

    public inviteForm: FormGroup;

    constructor(
        private modalService: BsModalService,
        private formBuilder: FormBuilder,
        private toastr: ToastrService
    ) {
        this.inviteForm = this.formBuilder.group({
            name: new FormControl("", Validators.required),
            email: new FormControl("", Validators.required)
        });
    }

    invite() {
        const inviteData = {
            name: this.inviteForm.get("name").value,
            email: this.inviteForm.get("email").value
        }
        console.log("Invite: ", inviteData);
        this.toastr.success(inviteData.name + " invited");
        this.closeModal()
    }

    closeModal(): void {
        this.modalService.hide();
    }
}
