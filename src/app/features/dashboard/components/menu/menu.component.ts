import { Component } from "@angular/core";
import { UserStateFacade } from "src/app/state/user/user.facade";
import { OrganisationStateFacade } from "../../../../state/organisation/organisation.facade";

@Component({
    selector: "app-menu",
    templateUrl: "menu.component.html",
    styleUrls: ["menu.component.scss"],
})
export class MenuComponent {

    isAdmin$ = this.userStateFacade.isAdmin$;
    isOrganisationAdmin$ = this.organisationStateFacade.isOrganisationAdmin$;

    constructor(
        private userStateFacade: UserStateFacade,
        private organisationStateFacade: OrganisationStateFacade
    ) {

    }
}
