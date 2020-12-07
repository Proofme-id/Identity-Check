import { Action, Selector, State, StateContext, Store } from "@ngxs/store";
import { HttpClient } from "@angular/common/http";
import { ConfigProvider } from "src/app/providers/config/configProvider";
import { tap } from "rxjs/operators";
import { catchError } from "rxjs/internal/operators/catchError";
import { Observable, throwError } from "rxjs";
import { Injectable } from "@angular/core";
import { SendToastAction } from "../app/actions/toastMessage";
import { IDeleteResponse } from "../../interfaces/delete-response.interface";
import { ITeam } from "src/app/interfaces/team.interface";
import { SetTeamList } from "./actions/set-team-list";
import { DeleteTeam } from "./actions/delete-team";
import { AddTeam } from "./actions/add-team";
import { OrganisationState } from "../organisation/organisation.state";


export interface IOrganisationState {
    
    teamList: ITeam[];
}

@State<IOrganisationState>({
    name: "team",
    defaults: {
       
        teamList: null
    }
})
@Injectable()
export class TeamState {

    @Selector()
    static teamList(state: IOrganisationState): ITeam[] {
        return state.teamList;
    }

    constructor(
        private http: HttpClient,
        private configProvider: ConfigProvider,
        private store: Store
    ) {

    }

    @Action(SetTeamList)
    SetTeamList(ctx: StateContext<IOrganisationState>): Observable<ITeam[]> {
        const organisation: number = this.store.selectSnapshot(OrganisationState.activeOrganisation)
        return this.http.get(
            `${this.configProvider.config.backendUrl}/v1/team/all/${organisation}`,
        ).pipe(
            tap((teamList: ITeam[]) => {
                ctx.patchState({
                    teamList
                });
            }),
            catchError((error) => {
                return throwError(error);
            })
        );
    }

    @Action(AddTeam)
    AddTeam(ctx: StateContext<IOrganisationState>, payload: AddTeam): Observable<ITeam> {
        try {
            return this.http.post(
                `${this.configProvider.config.backendUrl}/v1/team`,
                {
                    name: payload.name,
                    details: {
                        description: payload.description
                    },
                    organisationId: this.store.selectSnapshot(OrganisationState.activeOrganisation)
                }
            ).pipe(
                tap((data: ITeam) => {
                    console.log(data);
                    ctx.patchState({
                        teamList: [...ctx.getState().teamList, data ]
                    });
                    ctx.dispatch(new SendToastAction({ type:"SUCCESS", message: `Added team ${data.name}` }));
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

    @Action(DeleteTeam)
    deleteTeam(ctx: StateContext<IOrganisationState>, payload: DeleteTeam): Observable<IDeleteResponse> {
        try {
            return this.http.delete(
                `${this.configProvider.config.backendUrl}/v1/team/${payload.teamId}`,
            ).pipe(
                tap(() => {
                    const teamList: ITeam[] = ctx.getState().teamList.filter(x => x.id !== payload.teamId);
                    ctx.patchState({
                        teamList
                    });
                    ctx.dispatch(new SendToastAction({ type: "SUCCESS", message: `Deleted team ${payload.teamId}`}));
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
