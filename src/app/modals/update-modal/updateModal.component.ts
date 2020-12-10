import { Component, Input } from "@angular/core";
import { BsModalService } from "ngx-bootstrap/modal";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { LabelStateFacade } from "src/app/state/label/label.facade";
import { ILabel } from "src/app/interfaces/label.interface";
import { OnInit } from "@angular/core";

@Component({
    selector: "update-modal",
    templateUrl: "./updateModal.component.html"
})
export class LabelUpdateModalComponent implements OnInit {

    public updateLabelForm: FormGroup;

    @Input()
    label: ILabel;

    constructor(
        private modalService: BsModalService,
        private formBuilder: FormBuilder,
        private labelStateFacade: LabelStateFacade
    ) {
        
    }

    ngOnInit(): void {
        this.updateLabelForm = this.formBuilder.group({
            title: new FormControl(this.label.title, Validators.required),
            description: new FormControl(this.label.description, Validators.required),
            color: new FormControl(this.label.color,Validators.required)
        });
    }

    update(): void {
        const title: string = this.updateLabelForm.get("title").value;
        const description: string = this.updateLabelForm.get("description").value;
        const color: string = this.updateLabelForm.get("color").value;
        this.labelStateFacade.updateLabel(title, description, color, this.label.id);
        this.closeModal()
    }

    closeModal(): void {
        this.modalService.hide();
    }
}
