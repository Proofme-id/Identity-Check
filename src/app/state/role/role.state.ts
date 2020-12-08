import { Action, Selector, State, StateContext, Store } from "@ngxs/store";
import { HttpClient } from "@angular/common/http";
import { ConfigProvider } from "src/app/providers/config/configProvider";
import { tap } from "rxjs/operators";
import { catchError } from "rxjs/internal/operators/catchError";
import { Observable, throwError } from "rxjs";
import { Injectable } from "@angular/core";
import { IRole } from "../../interfaces/role.interface";
import { SetRoleList } from "./actions/set-role-list";
import { AddRole } from "./actions/add-role";
import { DeleteRole } from "./actions/delete-role";
import { SendToastAction } from "../app/actions/toastMessage";
import { IDeleteResponse } from "src/app/interfaces/delete-response.interface";
import { OrganisationState } from "../organisation/organisation.state";



export interface IRoleState {
    roleList: IRole[];
}

@State<IRoleState>({
    name: "role",
    defaults: {
        roleList: null,
    }
})
@Injectable()
export class RoleState {

    
    @Selector()
    static roleList(state: IRoleState): IRole[] {
        return state.roleList;
    }


    constructor(
        private http: HttpClient,
        private configProvider: ConfigProvider,
        private store: Store
    ) {

    }

    @Action(SetRoleList)
    setRoleList(ctx: StateContext<IRoleState>): Observable<IRole[]> {
        const organisation = this.store.selectSnapshot(OrganisationState.activeOrganisation)
        return this.http.get(
            `${this.configProvider.config.backendUrl}/v1/role/all/${organisation}`,
        ).pipe(
            tap((roleList: IRole[]) => {
                for (const role of roleList) {
                    if (roleList.find(x => x.id === role.reportsTo)) {
                        role.reportsToName = roleList.find(x => x.id === role.reportsTo).title;
                    }
                }
                ctx.patchState({
                    roleList
                });
            }),
            catchError((error) => {
                return throwError(error);
            })
        );
    }
    
    @Action(AddRole)
    addRole(ctx: StateContext<IRoleState>, payload: AddRole): Observable<IRole> {
        try {
            return this.http.post(
                `${this.configProvider.config.backendUrl}/v1/role`,
                {
                    title: payload.title,
                    reportsTo: payload.reportsTo,
                    details: {
                        description: payload.description
                    },
                    organisationId: this.store.selectSnapshot(OrganisationState.activeOrganisation)
                }
            ).pipe(
                tap((data: IRole) => {
                    if (ctx.getState().roleList.find(x => x.id === data.reportsTo)) {
                        data.reportsToName = ctx.getState().roleList.find(x => x.id === data.reportsTo).title;
                    }
                    console.log(data);
                    ctx.patchState({
                        roleList: [...ctx.getState().roleList, data ]
                    });
                    ctx.dispatch(new SendToastAction({ type:"SUCCESS", message: `Added role ${data.title}` }));
                }),
                catchError((error) => {
                    console.log("error:", error)
                    if (error.error.error && error.error.error === "DUPLICATE") {
                        ctx.dispatch(new SendToastAction({ type:"ERROR", message: error.error.error }));
                    } else {
                        ctx.dispatch(new SendToastAction({ type:"ERROR", message: "Something went wrong" }));
                    }
                    return throwError(error);
                })
            )
        } catch (error) {
            console.log(error);
        }
    }

    @Action(DeleteRole)
    deleteRole(ctx: StateContext<IRoleState>, payload: DeleteRole): Observable<IDeleteResponse> {
        try {
            return this.http.delete(
                `${this.configProvider.config.backendUrl}/v1/role/${payload.roleId}`,
            ).pipe(
                tap(() => {
                    const roleList: IRole[] = ctx.getState().roleList.filter(x => x.id !== payload.roleId);
                    ctx.patchState({
                        roleList
                    });
                    ctx.dispatch(new SendToastAction({ type: "SUCCESS", message: `Deleted role ${payload.roleId}`}));
                }),
                catchError((error) => {
                    ctx.dispatch(new SendToastAction({ type:"ERROR", message: "Something went wrong" }));
                    return throwError(error);
                })
            )
        } catch (error) {
            console.log(error);
        }
    }
}
