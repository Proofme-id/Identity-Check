import { Action, Selector, State, StateContext, Store } from "@ngxs/store";
import { HttpClient } from "@angular/common/http";
import { ConfigProvider } from "src/app/providers/config/configProvider";
import { tap } from "rxjs/operators";
import { catchError } from "rxjs/internal/operators/catchError";
import { Observable, throwError } from "rxjs";
import { Injectable } from "@angular/core";
import { SendToastAction } from "../app/actions/toastMessage";
import { IDeleteResponse } from "../../interfaces/delete-response.interface";
import { IProject } from "src/app/interfaces/project.interface";
import { SetProjectList } from "./actions/set-project-list";
import { DeleteProject } from "./actions/delete-project";
import { AddProject } from "./actions/add-project";
import { OrganisationState } from "../organisation/organisation.state";


export interface IOrganisationState {
    
    projectList: IProject[];
}

@State<IOrganisationState>({
    name: "project",
    defaults: {
       
        projectList: null
    }
})
@Injectable()
export class ProjectState {

    @Selector()
    static projectList(state: IOrganisationState): IProject[] {
        return state.projectList;
    }

    constructor(
        private http: HttpClient,
        private configProvider: ConfigProvider,
        private store: Store
    ) {

    }

    @Action(SetProjectList)
    SetProjectList(ctx: StateContext<IOrganisationState>): Observable<IProject[]> {
        const organisation: number = this.store.selectSnapshot(OrganisationState.activeOrganisation)
        return this.http.get(
            `${this.configProvider.config.backendUrl}/v1/project/all/${organisation}`,
        ).pipe(
            tap((projectList: IProject[]) => {
                ctx.patchState({
                    projectList
                });
            }),
            catchError((error) => {
                return throwError(error);
            })
        );
    }

    @Action(AddProject)
    AddProject(ctx: StateContext<IOrganisationState>, payload: AddProject): Observable<IProject> {
        try {
            return this.http.post(
                `${this.configProvider.config.backendUrl}/v1/project`,
                {
                    name: payload.name,
                    details: {
                        description: payload.description
                    },
                    organisationId: this.store.selectSnapshot(OrganisationState.activeOrganisation)
                }
            ).pipe(
                tap((data: IProject) => {
                    console.log(data);
                    ctx.patchState({
                        projectList: [...ctx.getState().projectList, data ]
                    });
                    ctx.dispatch(new SendToastAction({ type:"SUCCESS", message: `Added project ${data.name}` }));
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

    @Action(DeleteProject)
    deleteProject(ctx: StateContext<IOrganisationState>, payload: DeleteProject): Observable<IDeleteResponse> {
        try {
            return this.http.delete(
                `${this.configProvider.config.backendUrl}/v1/project/${payload.projectId}`,
            ).pipe(
                tap(() => {
                    const projectList: IProject[] = ctx.getState().projectList.filter(x => x.id !== payload.projectId);
                    ctx.patchState({
                        projectList
                    });
                    ctx.dispatch(new SendToastAction({ type: "SUCCESS", message: `Deleted project ${payload.projectId}`}));
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
