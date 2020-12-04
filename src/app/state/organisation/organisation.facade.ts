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
import { AddSupplier } from "./actions/add-supplier";
import { DeleteSupplier } from "./actions/delete-supplier";
import { DeleteEmployee } from "./actions/delete-employee";
import { InviteEmployee } from "./actions/invite-employee";
import { SetHardwareList } from "./actions/set-hardware-list";
import { DeleteHardware } from "./actions/delete-hardware";
import { AddHardware } from "./actions/add-hardware";



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

    @Select(OrganisationState.hardwareList)
    hardwareList$: Observable<ISupplier[]>;

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

    AddSupplier(name: string, description: string): Observable<void> {
        return this.store.dispatch(new AddSupplier(name, description));
    }

    deleteSupplier(supplierId: number): Observable<void> {
        return this.store.dispatch(new DeleteSupplier(supplierId))
    }

    setHardwareList(): Observable<void> {
        return this.store.dispatch(new SetHardwareList());
    }

    AddHardware(name: string, description: string): Observable<void> {
        return this.store.dispatch(new AddHardware(name, description));
    }

    deleteHardware(hardwareId: number): Observable<void> {
        return this.store.dispatch(new DeleteHardware(hardwareId))
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
}
