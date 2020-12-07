import { Component } from "@angular/core";
import { BsModalService } from "ngx-bootstrap/modal";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { ProjectStateFacade } from "src/app/state/projects/project.facade";

@Component({
    selector: "project-add-modal",
    templateUrl: "./projectAddModal.component.html"
})
export class ProjectAddModalComponent {

    public addProjectForm: FormGroup;

    constructor(
        private modalService: BsModalService,
        private formBuilder: FormBuilder,
        private projectStateFacade: ProjectStateFacade
    ) {
        this.addProjectForm = this.formBuilder.group({
            name: new FormControl("", Validators.required),
            description: new FormControl("", Validators.required)
        });
    }

    add(): void {
        const name: string = this.addProjectForm.get("name").value;
        const description: string = this.addProjectForm.get("description").value;
        this.projectStateFacade.addProject(name, description);
        this.closeModal()
    }

    closeModal(): void {
        this.modalService.hide();
    }
}
