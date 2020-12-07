import { Component } from "@angular/core";
import { BsModalService } from "ngx-bootstrap/modal";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { TeamStateFacade } from "src/app/state/teams/team.facade";

@Component({
    selector: "team-add-modal",
    templateUrl: "./teamAddModal.component.html"
})
export class TeamAddModalComponent {

    public addTeamForm: FormGroup;

    constructor(
        private modalService: BsModalService,
        private formBuilder: FormBuilder,
        private teamStateFacade: TeamStateFacade
    ) {
        this.addTeamForm = this.formBuilder.group({
            name: new FormControl("", Validators.required),
            description: new FormControl("", Validators.required)
        });
    }

    add(): void {
        const name: string = this.addTeamForm.get("name").value;
        const description: string = this.addTeamForm.get("description").value;
        this.teamStateFacade.addTeam(name, description);
        this.closeModal()
    }

    closeModal(): void {
        this.modalService.hide();
    }
}
