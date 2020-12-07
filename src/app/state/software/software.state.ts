import { Action, Selector, State, StateContext, Store } from "@ngxs/store";
import { HttpClient } from "@angular/common/http";
import { ConfigProvider } from "src/app/providers/config/configProvider";
import { tap } from "rxjs/operators";
import { catchError } from "rxjs/internal/operators/catchError";
import { Observable, throwError } from "rxjs";
import { Injectable } from "@angular/core";
import { SendToastAction } from "../app/actions/toastMessage";
import { IDeleteResponse } from "../../interfaces/delete-response.interface";
import { OrganisationState } from "../organisation/organisation.state";
import { ISoftware } from "src/app/interfaces/software.interface";
import { SetSoftwareList } from "./actions/set-software-list";
import { AddSoftware } from "./actions/add-software";
import { DeleteSoftware } from "./actions/delete-software";

export interface ISoftwareState {
    softwareList: ISoftware[];
}

@State<ISoftwareState>({
    name: "software",
    defaults: {
        softwareList: null
    }
})
@Injectable()
export class SoftwareState {

    @Selector()
    static softwareList(state: ISoftwareState): ISoftware[] {
        return state.softwareList;
    }

    constructor(
        private http: HttpClient,
        private configProvider: ConfigProvider,
        private store: Store
    ) {

    }

    @Action(SetSoftwareList)
    setsoftwareList(ctx: StateContext<ISoftwareState>): Observable<ISoftware[]> {
        const organisation: number = this.store.selectSnapshot(OrganisationState.activeOrganisation)
        return this.http.get(
            `${this.configProvider.config.backendUrl}/v1/software/all/${organisation}`,
        ).pipe(
            tap((softwareList: ISoftware[]) => {
                ctx.patchState({
                    softwareList
                });
            }),
            catchError((error) => {
                return throwError(error);
            })
        );
    }

    @Action(AddSoftware)
    addSoftware(ctx: StateContext<ISoftwareState>, payload: AddSoftware): Observable<ISoftware> {
        try {
            return this.http.post(
                `${this.configProvider.config.backendUrl}/v1/software`,
                {
                    name: payload.name,
                    details: {
                        description: payload.description
                    },
                    organisationId: this.store.selectSnapshot(OrganisationState.activeOrganisation)
                }
            ).pipe(
                tap((data: ISoftware) => {
                    console.log(data);
                    ctx.patchState({
                        softwareList: [...ctx.getState().softwareList, data ]
                    });
                    ctx.dispatch(new SendToastAction({ type:"SUCCESS", message: `Added software ${data.name}` }));
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

    @Action(DeleteSoftware)
    deleteSoftware(ctx: StateContext<ISoftwareState>, payload: DeleteSoftware): Observable<IDeleteResponse> {
        try {
            return this.http.delete(
                `${this.configProvider.config.backendUrl}/v1/software/${payload.softwareId}`,
            ).pipe(
                tap(() => {
                    const softwareList: ISoftware[] = ctx.getState().softwareList.filter(x => x.id !== payload.softwareId);
                    ctx.patchState({
                        softwareList
                    });
                    ctx.dispatch(new SendToastAction({ type: "SUCCESS", message: `Deleted software ${payload.softwareId}`}));
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
