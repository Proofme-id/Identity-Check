import { Component } from "@angular/core";
import { BsModalService } from "ngx-bootstrap/modal";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { LabelStateFacade } from "src/app/state/label/label.facade";

@Component({
    selector: "label-add-modal",
    templateUrl: "./labelAddModal.component.html"
})
export class LabelAddModalComponent {

    public addLabelForm: FormGroup;

    constructor(
        private modalService: BsModalService,
        private formBuilder: FormBuilder,
        private labelStateFacade: LabelStateFacade
    ) {
        this.addLabelForm = this.formBuilder.group({
            title: new FormControl("", Validators.required),
            description: new FormControl("", Validators.required),
            color: new FormControl("",Validators.required)
        });
    }

    add(): void {
        const title: string = this.addLabelForm.get("title").value;
        const description: string = this.addLabelForm.get("description").value;
        const color: string = this.addLabelForm.get("color").value;
        this.labelStateFacade.addLabel(title, description, color);
        this.closeModal()
    }

    closeModal(): void {
        this.modalService.hide();
    }
}
