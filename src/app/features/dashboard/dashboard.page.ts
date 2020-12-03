import { Component } from "@angular/core";
import { UserStateFacade } from "../../state/user/user.facade";
import { OrganisationStateFacade } from "../../state/organisation/organisation.facade";

@Component({
    templateUrl: "dashboard.page.html",
    styleUrls: ["dashboard.page.scss"]
})
export class DashboardPageComponent {

    isAdmin$ = this.userStateFacade.isAdmin$;
    isOrganisationAdmin$ = this.organisationStateFacade.isOrganisationAdmin$;

    constructor(
        private userStateFacade: UserStateFacade,
        private organisationStateFacade: OrganisationStateFacade
    ) {

    }

}
