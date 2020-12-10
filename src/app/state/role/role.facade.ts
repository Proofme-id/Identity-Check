import { Injectable } from "@angular/core";
import { Select, Store } from "@ngxs/store";
import { Observable } from "rxjs";
import { IRole } from "src/app/interfaces/role.interface";
import { SetRoleList } from "./actions/set-role-list";
import { AddRole } from "./actions/add-role";
import { DeleteRole } from "./actions/delete-role";
import { RoleState } from "./role.state";
import { UpdateRole } from "./actions/update-role";


@Injectable({
    providedIn: "root"
})
export class RoleStateFacade {

    @Select(RoleState.roleList)
    roleList$: Observable<IRole[]>;

    constructor(private store: Store) {}

   
    setRoleList(): Observable<void> {
        return this.store.dispatch(new SetRoleList());
    }

    addRole(title: string, reportsTo: number, description: string): Observable<void> {
        return this.store.dispatch(new AddRole(title, reportsTo, description));
    }

    updateRole(id: number, title: string, reportsTo: number, description: string): Observable<void> {
        return this.store.dispatch(new UpdateRole(id, title, reportsTo, description));
    }

    deleteRole(roleId: number): Observable<void> {
        return this.store.dispatch(new DeleteRole(roleId))
    }
}
