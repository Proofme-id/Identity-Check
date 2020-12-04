import { Component } from "@angular/core";
import { BsModalService } from "ngx-bootstrap/modal";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { OrganisationStateFacade } from "../../state/organisation/organisation.facade";

@Component({
    selector: "software-add-modal",
    templateUrl: "./softwareAddModal.component.html"
})
export class SoftwareAddModalComponent {

    public form: FormGroup;

    constructor(
        private modalService: BsModalService,
        private formBuilder: FormBuilder,
        private organisationStateFacade: OrganisationStateFacade
    ) {
        this.form = this.formBuilder.group({
            name: new FormControl("", Validators.required),
            description: new FormControl("", Validators.required)
        });
    }

    add(): void {
        const name: string = this.form.get("name").value;
        const description: string = this.form.get("description").value;
        this.organisationStateFacade.inviteEmployee(name, description);
        this.closeModal()
    }

    closeModal(): void {
        this.modalService.hide();
    }
}
