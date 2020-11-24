import { Injectable } from "@angular/core";
import { CanActivate } from "@angular/router";
import { take } from "rxjs/operators";
import { OrganisationStateFacade } from "../state/organisation/organisation.facade";

@Injectable()
export class IsOrganisationAdminGuard implements CanActivate {
    constructor(
        private organisationStateFacade: OrganisationStateFacade
    ) {}

    async canActivate(): Promise<boolean> {
        return await this.organisationStateFacade.isOrganisationAdmin$.pipe(take(1)).toPromise();
    }
}
