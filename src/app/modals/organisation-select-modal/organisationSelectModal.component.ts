import { Component } from "@angular/core";
import { BsModalService } from "ngx-bootstrap/modal";
import { FormBuilder } from "@angular/forms";
import { OrganisationStateFacade } from "../../state/organisation/organisation.facade";

@Component({
    selector: "employee-invite-modal",
    templateUrl: "./organisationSelectModal.component.html",
    styleUrls: ["./organisationSelectModal.component.scss"]
})
export class OrganisationSelectModalComponent {

    myOrganisations$ = this.organisationStateFacade.myOrganisations$;

    constructor(
        private modalService: BsModalService,
        private formBuilder: FormBuilder,
        private organisationStateFacade: OrganisationStateFacade
    ) {

    }

    select(organisation: number): void {
        this.organisationStateFacade.updateActiveOrganisation(organisation);
        this.modalService.hide();
    }
}
