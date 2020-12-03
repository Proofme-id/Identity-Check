import { Action, Selector, State, StateContext } from "@ngxs/store";
import { HttpClient } from "@angular/common/http";
import { ConfigProvider } from "src/app/providers/config/configProvider";
import { tap } from "rxjs/operators";
import { catchError } from "rxjs/internal/operators/catchError";
import { Observable, throwError } from "rxjs";
import { Injectable } from "@angular/core";
import { UtilsProvider } from "src/app/providers/utils/utils";
import { ICustomClaims } from "../../interfaces/customClaims.interface";
import { IEmployee } from "../../interfaces/employee.interface";
import { SetEmployeesList } from "./actions/set-employees-list";
import { SetOrganisationsList } from "./actions/set-organisations-list";
import { SetShowOrganisationSelector } from "./actions/show-organisation-selector";
import { SetActiveOrganisation } from "./actions/set-active-organisation";
import { UpdateActiveOrganisation } from "./actions/update-active-organisation";
import { IOrganisation } from "../../interfaces/organisation.interface";
import { SetMyOrganisations } from "./actions/set-my-organisations";
import { DeleteEmployee } from "./actions/delete-employee";
import { SendToastAction } from "../app/actions/toastMessage";
import { ToastMessage } from "../../interfaces/toastMessage.interface";
import { IDeleteResponse } from "../../interfaces/delete-response.interface";
import { InviteEmployee } from "./actions/invite-employee";


export interface IOrganisationState {
    customClaims: ICustomClaims[];
    myOrganisations: IEmployee[];
    activeOrganisation: number;
    activeEmployee: number;
    activeUserPower: number;
    updateUserError: boolean;
    updateEmployeeAdminError: boolean;
    updateEmployeeAdminSuccess: boolean;

    showOrganisationSelector: boolean;

    employeesList: IEmployee[];
    organisationsList: IOrganisation[];
}

@State<IOrganisationState>({
    name: "organisation",
    defaults: {
        customClaims: [],
        myOrganisations: [],
        activeOrganisation: null,
        activeEmployee: null,
        activeUserPower: null,
        updateUserError: false,
        updateEmployeeAdminError: false,
        updateEmployeeAdminSuccess: false,
        showOrganisationSelector: false,
        employeesList: null,
        organisationsList: null
    }
})
@Injectable()
export class OrganisationState {

    @Selector()
    static customClaims(state: IOrganisationState): ICustomClaims[] {
        return state.customClaims;
    }

    @Selector()
    static employeesList(state: IOrganisationState): IEmployee[] {
        return state.employeesList;
    }

    @Selector()
    static organisationsList(state: IOrganisationState): IOrganisation[] {
        return state.organisationsList;
    }

    @Selector()
    static activeOrganisation(state: IOrganisationState): number {
        return state.activeOrganisation;
    }

    @Selector()
    static activeEmployee(state: IOrganisationState): number {
        return state.activeEmployee;
    }

    @Selector()
    static updateUserError(state: IOrganisationState): boolean {
        return state.updateUserError;
    }

    @Selector()
    static isOrganisationAdmin(state: IOrganisationState): boolean {
        return state.activeUserPower === 1;
    }

    @Selector()
    static updateEmployeeAdminError(state: IOrganisationState): boolean {
        return state.updateEmployeeAdminError;
    }

    @Selector()
    static updateEmployeeAdminSuccess(state: IOrganisationState): boolean {
        return state.updateEmployeeAdminSuccess;
    }

    @Selector()
    static myOrganisations(state: IOrganisationState): IEmployee[] {
        return state.myOrganisations;
    }

    @Selector()
    static showOrganisationSelector(state: IOrganisationState): boolean {
        return state.showOrganisationSelector;
    }

    constructor(
        private http: HttpClient,
        private configProvider: ConfigProvider,
        private utilsProvider: UtilsProvider,
    ) {

    }

    @Action(SetActiveOrganisation)
    setActiveOrganisation(ctx: StateContext<IOrganisationState>, payload: SetActiveOrganisation): IOrganisationState {
        if(payload.customClaims.length == 0) {
            console.log("Cleared active organisation")
            return ctx.patchState( {
                customClaims: [],
                activeOrganisation: null,
                activeEmployee: null,
                activeUserPower: null,
                showOrganisationSelector: false
            })
        } else if(payload.customClaims.length == 1) {
            console.log("Set default active organisation")
            return ctx.patchState( {
                customClaims: payload.customClaims,
                activeOrganisation: payload.customClaims[0].organisation,
                activeEmployee: payload.customClaims[0].employee,
                activeUserPower: payload.customClaims[0].userPower,
                showOrganisationSelector: false
            })
        } else if (ctx.getState().customClaims != payload.customClaims || ctx.getState().activeOrganisation === null){
            console.log("Set active organisation selector")
            ctx.dispatch(new SetMyOrganisations());
            return ctx.patchState( {
                customClaims: payload.customClaims,
                showOrganisationSelector: true
            })
        }
    }

    @Action(UpdateActiveOrganisation)
    updateActiveOrganisation(ctx: StateContext<IOrganisationState>, payload: UpdateActiveOrganisation): IOrganisationState {
        const organisations = ctx.getState().customClaims;
        const selection = organisations.find(obj => {
            return obj.organisation === payload.selection
        })
        if(selection) {
            return ctx.patchState( {
                activeOrganisation: selection.organisation,
                activeEmployee: selection.employee,
                activeUserPower: selection.userPower,
                showOrganisationSelector: false
            })
        }
    }

    @Action(SetShowOrganisationSelector)
    setShowOrganisationSelector(ctx: StateContext<IOrganisationState>, payload: SetShowOrganisationSelector): IOrganisationState {
        ctx.dispatch(new SetMyOrganisations());
        return ctx.patchState({
            showOrganisationSelector: payload.status
        });
    }

    @Action(SetMyOrganisations)
    setMyOrganisations(ctx: StateContext<IOrganisationState>): Observable<IEmployee[]> {
        return this.http.get(
            `${this.configProvider.config.backendUrl}/v1/organisation`,
        ).pipe(
            tap((myOrganisations: IEmployee[]) => {
                console.log("myOrganisations: ", myOrganisations)
                ctx.patchState({
                    myOrganisations
                });
            }),
            catchError((error) => {
                return throwError(error);
            })
        );
    }

    @Action(DeleteEmployee)
    deleteEmployee(ctx: StateContext<IOrganisationState>, payload: DeleteEmployee): Observable<IDeleteResponse> {
        try {
            return this.http.delete(
                `${this.configProvider.config.backendUrl}/v1/employee/${payload.employeeId}`,
            ).pipe(
                tap((data: IDeleteResponse) => {
                    if ((data.message) && data.message === "OK") {
                        const employeesList: IEmployee[] = ctx.getState().employeesList.filter(x => x.id !== payload.employeeId);
                        ctx.patchState({
                            employeesList
                        });
                        ctx.dispatch(new SendToastAction(new ToastMessage("SUCCESS", `Deleted employee ${payload.employeeId}` )));
                    } else {
                        ctx.dispatch(new SendToastAction(new ToastMessage("ERROR", `Can not delete employee ${payload.employeeId}`)));
                    }
                }),
                catchError((error) => {
                    ctx.dispatch(new SendToastAction(new ToastMessage("ERROR", "Something went wrong")));
                    return throwError(error);
                })
            )
        } catch (error) {
            console.log(error);
        }
    }

    @Action(InviteEmployee)
    inviteEmployee(ctx: StateContext<IOrganisationState>, payload: InviteEmployee): Observable<IEmployee> {
        try {
            return this.http.post(
                `${this.configProvider.config.backendUrl}/v1/employee/invite`,
                {
                    email: payload.email,
                    name: payload.name,
                    organisationId: ctx.getState().activeOrganisation
                }
            ).pipe(
                tap((data: IEmployee) => {
                    console.log(data);
                    ctx.patchState({
                        employeesList: [...ctx.getState().employeesList, data ]
                    });
                    ctx.dispatch(new SendToastAction(new ToastMessage("SUCCESS", `Added employee ${data.name}` )));
                }),
                catchError((error) => {
                    console.log("error:", error)
                    if (error.error.error && error.error.error === "DUPLICATE") {
                        ctx.dispatch(new SendToastAction(new ToastMessage("ERROR", error.error.error )));
                    } else {
                        ctx.dispatch(new SendToastAction(new ToastMessage("ERROR", "Something went wrong")));
                    }
                    return throwError(error);
                })
            )
        } catch (error) {
            console.log(error);
        }
    }


    @Action(SetEmployeesList)
    setEmployeeList(ctx: StateContext<IOrganisationState>): Observable<IEmployee[]> {
        const organisation: number = ctx.getState().activeOrganisation;
        return this.http.get(
            `${this.configProvider.config.backendUrl}/v1/employee/all/${organisation}`,
        ).pipe(
            tap((employeesList: IEmployee[]) => {
                for (const employee of employeesList) {
                    employee.userPowerName = this.utilsProvider.convertUserPowerToRoleName(employee.userPower);
                }
                ctx.patchState({
                    employeesList
                });
            }),
            catchError((error) => {
                return throwError(error);
            })
        );
    }

    @Action(SetOrganisationsList)
    setOrganisationsList(ctx: StateContext<IOrganisationState>): Observable<IOrganisation[]> {
        return this.http.get(
            `${this.configProvider.config.backendUrl}/v1/organisation/all`,
        ).pipe(
            tap((organisationsList: IOrganisation[]) => {
                ctx.patchState({
                    organisationsList
                });
            }),
            catchError((error) => {
                return throwError(error);
            })
        );
    }
}
