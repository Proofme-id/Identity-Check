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
import { ISupplier } from "src/app/interfaces/supplier.interface";
import { SetSupplierList } from "./actions/set-supplier-list";

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

    @Select(OrganisationState.supplierList)
    supplierList$: Observable<ISupplier[]>;

    @Select(OrganisationState.organisationsList)
    organisationsList$: Observable<IOrganisation[]>;

    @Select(OrganisationState.showOrganisationSelector)
    showOrganisationSelector$: Observable<boolean>;

    @Select(OrganisationState.myOrganisations)
    myOrganisations$: Observable<IEmployee[]>

    constructor(private store: Store) {}

    setEmployeesList(): Observable<void> {
        return this.store.dispatch(new SetEmployeesList());
    }
    setSupplierList(): Observable<void> {
        return this.store.dispatch(new SetSupplierList());
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
}
