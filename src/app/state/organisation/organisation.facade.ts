import { Injectable } from "@angular/core";
import { Select, Store } from "@ngxs/store";
import { Observable } from "rxjs";
import { SetEmployeesList } from "./actions/set-employees-list";
import { OrganisationState } from "./organisation.state";
import { IEmployee } from "../../interfaces/employee.interface";
import { SetOrganisationsList } from "./actions/set-organisations-list";
import { ICustomClaims } from "../../interfaces/customClaims.interface";
import { UpdateActiveOrganisation } from "./actions/update-active-organisation";
import { IOrganisation } from "../../interfaces/organisation.interface";
import { SetShowOrganisationSelector } from "./actions/show-organisation-selector";
import { DeleteEmployee } from "./actions/delete-employee";
import { InviteEmployee } from "./actions/invite-employee";
import { SetActiveOrganisation } from "./actions/set-active-organisation";




@Injectable({
    providedIn: "root"
})
export class OrganisationStateFacade {
    @Select(OrganisationState.customClaims)
    customClaims$: Observable<ICustomClaims[]>;

    @Select(OrganisationState.isOrganisationAdmin)
    isOrganisationAdmin$: Observable<boolean>;

    @Select(OrganisationState.employeesList)
    employeesList$: Observable<IEmployee[]>;

    @Select(OrganisationState.organisationsList)
    organisationsList$: Observable<IOrganisation[]>;

    @Select(OrganisationState.showOrganisationSelector)
    showOrganisationSelector$: Observable<boolean>;

    @Select(OrganisationState.myOrganisations)
    myOrganisations$: Observable<IEmployee[]>

    @Select(OrganisationState.activeOrganisation)
    activeOrganisation$: Observable<number>

    constructor(private store: Store) {}

    setEmployeesList(): Observable<void> {
        return this.store.dispatch(new SetEmployeesList());
    }
    
    setOrganisationsList(): Observable<void> {
        return this.store.dispatch(new SetOrganisationsList());
    }

    updateActiveOrganisation(selection: number): Observable<void> {
        return this.store.dispatch(new UpdateActiveOrganisation(selection));
    }

    showOrganisationSelector(show: boolean): Observable<void> {
        return this.store.dispatch(new SetShowOrganisationSelector(show));
    }

    deleteEmployee(employeeId: number): Observable<void> {
        return this.store.dispatch(new DeleteEmployee(employeeId))
    }

    inviteEmployee(name: string, email: string): Observable<void> {
        return this.store.dispatch(new InviteEmployee(name, email));
    }

    setActiveOrganisation(customClaims: ICustomClaims[]): Observable<void> {
        return this.store.dispatch(new SetActiveOrganisation(customClaims));
    }
}
