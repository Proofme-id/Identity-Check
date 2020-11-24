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
import { IOrganisation } from "../../interfaces/organisation.interface";
import { SetShowOrganisationSelector } from "./actions/show-organisation-selector";
import { SetActiveOrganisation } from "./actions/set-active-organisation";
import { UpdateActiveOrganisation } from "./actions/update-active-organisation";


export interface IOrganisationState {
    customClaims: ICustomClaims[],
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
        activeOrganisation: 1,
        activeEmployee: null,
        activeUserPower: 100,
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
        return state.activeUserPower === 10;
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
            return ctx.patchState( {
                customClaims: payload.customClaims,
                showOrganisationSelector: true
            })
        }
    }

    @Action(UpdateActiveOrganisation)
    updateActiveOrganisation(ctx: StateContext<IOrganisationState>, payload: UpdateActiveOrganisation): IOrganisationState {
        const organisations = ctx.getState().customClaims;
        console.log("Active organisation: " + organisations[payload.selection].organisation)
        console.log("Active employee: " + organisations[payload.selection].employee)
        console.log("Active userPower: " + organisations[payload.selection].userPower)
        return ctx.patchState( {
            activeOrganisation: organisations[payload.selection].organisation,
            activeEmployee: organisations[payload.selection].employee,
            activeUserPower: organisations[payload.selection].userPower,
            showOrganisationSelector: false
        })
    }

    @Action(SetShowOrganisationSelector)
    setShowOrganisationSelector(ctx: StateContext<IOrganisationState>, payload: SetShowOrganisationSelector): IOrganisationState {
        return ctx.patchState({
            showOrganisationSelector: payload.status
        });
    }


    @Action(SetEmployeesList)
    setEmployeeList(ctx: StateContext<IOrganisationState>): Observable<IEmployee[]> {
        const organisation: number = ctx.getState().activeOrganisation;
        return this.http.get(
            `${this.configProvider.config.backendUrl}/v1/employee/${organisation}`,
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
            `${this.configProvider.config.backendUrl}/v1/organisation`,
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



    // @Action(UpdateUserAction)
    // updateUser(ctx: StateContext<IOrganisationState>, payload: UpdateUserAction): Observable<ITokenResponse> {
    //     const userId = ctx.getState().jwtDecoded.userId;
    //     ctx.patchState({
    //         updateUserError: false
    //     });
    //     return this.http.patch(
    //         `${this.configProvider.config.backendUrl}/v1/user/${userId}`,
    //         {
    //             username: payload.username
    //         }
    //     ).pipe(
    //         tap((response: ITokenResponse) => {
    //             const jwtDecoded: IJWTDecoded = jwt_decode(response.token);
    //             ctx.patchState({
    //                 updateUserError: false,
    //                 access_token: response.token,
    //                 jwtDecoded
    //             });
    //         }),
    //         catchError((error) => {
    //             ctx.patchState({
    //                 updateUserError: true
    //             });
    //             return throwError(error);
    //         })
    //     );
    // }

    // @Action(SetUsersList)
    // setUsersList(ctx: StateContext<IOrganisationState>): Observable<IUser[]> {
    //     return this.http.get(
    //         `${this.configProvider.config.backendUrl}/v1/user/list`,
    //     ).pipe(
    //         tap((usersList: IUser[]) => {
    //             for (const user of usersList) {
    //                 user.userPower = this.utilsProvider.convertUserPowerToRoleName(user.userPower);
    //             }
    //             ctx.patchState({
    //                 usersList
    //             });
    //         }),
    //         catchError((error) => {
    //             return throwError(error);
    //         })
    //     );
    // }

    // @Action(UpdateUserAdminAction)
    // updateUserAdminAction(ctx: StateContext<IOrganisationState>, payload: UpdateUserAdminAction): Observable<ITokenResponse> {
    //     ctx.patchState({
    //         updateUserAdminError: null,
    //         updateUserAdminSuccess: null
    //     });
    //     return this.http.patch(
    //         `${this.configProvider.config.backendUrl}/v1/user/admin/${payload.user.id}`,
    //         {
    //             ...payload.user
    //         }
    //     ).pipe(
    //         tap((token: ITokenResponse) => {
    //             ctx.patchState({
    //                 updateUserAdminSuccess: true
    //             });
    //             if (token) {
    //                 const accessToken = token.token;
    //                 if (accessToken) {
    //                     const jwtDecoded: IJWTDecoded = jwt_decode(accessToken);
    //                     return ctx.patchState({
    //                         access_token: accessToken,
    //                         jwtDecoded,
    //                     });
    //                 }
    //             }
    //         }),
    //         catchError((error) => {
    //             ctx.patchState({
    //                 updateUserAdminError: true
    //             });
    //             return throwError(error);
    //         })
    //     );
    // }
}
