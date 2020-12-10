import { Component, Input } from "@angular/core";
import { BsModalService } from "ngx-bootstrap/modal";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { LabelStateFacade } from "src/app/state/label/label.facade";
import { ILabel } from "src/app/interfaces/label.interface";
import { OnInit } from "@angular/core";

@Component({
    selector: "label-modal",
    templateUrl: "./labelModal.component.html"
})
export class LabelModalComponent implements OnInit {

    public form: FormGroup;

    @Input()
    label: ILabel;

    constructor(
        private modalService: BsModalService,
        private formBuilder: FormBuilder,
        private labelStateFacade: LabelStateFacade
    ) {
        
    }

    ngOnInit(): void {
        this.form = this.formBuilder.group({
            title: new FormControl(this.label ? this.label.title : null, Validators.required),
            description: new FormControl(this.label ? this.label.description : null, Validators.required),
            color: new FormControl(this.label ? this.label.color : null, Validators.required)
        });
    }

    update(): void {
        const title: string = this.form.get("title").value;
        const description: string = this.form.get("description").value;
        const color: string = this.form.get("color").value;
        this.labelStateFacade.updateLabel(title, description, color, this.label.id);
        this.closeModal()
    }

    closeModal(): void {
        this.modalService.hide();
    }
    
    add(): void {
        const title: string = this.form.get("title").value;
        const description: string = this.form.get("description").value;
        const color: string = this.form.get("color").value;
        this.labelStateFacade.addLabel(title, description, color);
        this.closeModal()
    }
}
