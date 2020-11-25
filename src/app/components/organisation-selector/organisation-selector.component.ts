import { Component } from "@angular/core";
import { OrganisationStateFacade } from "../../state/organisation/organisation.facade";

@Component({
    // tslint:disable-next-line: component-selector
    selector: "organisation-selector",
    templateUrl: "organisation-selector.component.html",
    styleUrls: ["organisation-selector.component.scss"]
})
export class OrganisationSelectorComponent {
    showOrganisationSelector$ = this.organisationStateFacade.showOrganisationSelector$;

    constructor(
        private organisationStateFacade: OrganisationStateFacade
    ) {

    }

    update(selection: number): void {
        this.organisationStateFacade.updateActiveOrganisation(selection);
    }

}
