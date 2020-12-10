import { Action, Selector, State, StateContext, Store } from "@ngxs/store";
import { HttpClient } from "@angular/common/http";
import { ConfigProvider } from "src/app/providers/config/configProvider";
import { tap } from "rxjs/operators";
import { catchError } from "rxjs/internal/operators/catchError";
import { Observable, throwError } from "rxjs";
import { Injectable } from "@angular/core";
import { SendToastAction } from "../app/actions/toastMessage";
import { IDeleteResponse } from "../../interfaces/delete-response.interface";
import { ILabel } from "src/app/interfaces/label.interface";
import { SetLabelList } from "./actions/set-label-list";
import { DeleteLabel } from "./actions/delete-label";
import { AddLabel } from "./actions/add-label";
import { OrganisationState } from "../organisation/organisation.state";
import { UpdateLabel } from "./actions/update-label";


export interface ILabelState {
    labelList: ILabel[];
}

@State<ILabelState>({
    name: "label",
    defaults: {
        labelList: null
    }
})
@Injectable()
export class LabelState {

    @Selector()
    static labelList(state: ILabelState): ILabel[] {
        return state.labelList;
    }

    constructor(
        private http: HttpClient,
        private configProvider: ConfigProvider,
        private store: Store
    ) {

    }

    @Action(SetLabelList)
    setLabelList(ctx: StateContext<ILabelState>): Observable<ILabel[]> {
        const organisation: number = this.store.selectSnapshot(OrganisationState.activeOrganisation)
        return this.http.get(
            `${this.configProvider.config.backendUrl}/v1/label/all/${organisation}`,
        ).pipe(
            tap((labelList: ILabel[]) => {
                ctx.patchState({
                    labelList
                });
            }),
            catchError((error) => {
                return throwError(error);
            })
        );
    }

    @Action(AddLabel)
    addLabel(ctx: StateContext<ILabelState>, payload: AddLabel): Observable<ILabel> {
        try {
            return this.http.post(
                `${this.configProvider.config.backendUrl}/v1/label`,
                {
                    title: payload.title,
                    description: payload.description,
                    color: payload.color,
                    organisationId: this.store.selectSnapshot(OrganisationState.activeOrganisation)
                }
            ).pipe(
                tap((data: ILabel) => {
                    console.log(data);
                    ctx.patchState({
                        labelList: [...ctx.getState().labelList, data ]
                    });
                    ctx.dispatch(new SendToastAction({ type:"SUCCESS", message: `Added label ${data.title}` }));
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

    @Action(DeleteLabel)
    deleteLabel(ctx: StateContext<ILabelState>, payload: DeleteLabel): Observable<IDeleteResponse> {
        try {
            return this.http.delete(
                `${this.configProvider.config.backendUrl}/v1/label/${payload.labelId}`,
            ).pipe(
                tap(() => {
                    const labelList: ILabel[] = ctx.getState().labelList.filter(x => x.id !== payload.labelId);
                    ctx.patchState({
                        labelList
                    });
                    ctx.dispatch(new SendToastAction({ type: "SUCCESS", message: `Deleted label ${payload.labelId}`}));
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

    @Action(UpdateLabel)
    updateLabel(ctx: StateContext<ILabelState>, payload: UpdateLabel): Observable<ILabel> {
        try {
            return this.http.patch(
                `${this.configProvider.config.backendUrl}/v1/label/${payload.labelId}`,
                {
                    title: payload.title,
                    description: payload.description,
                    color: payload.color,
                    organisationId: this.store.selectSnapshot(OrganisationState.activeOrganisation)
                }
            ).pipe(
                tap((data: ILabel) => {
                    const index = ctx.getState().labelList.findIndex(x => x.id === payload.labelId);
                    console.log(data);
                    ctx.patchState({
                        labelList: Object.assign(
                            [...ctx.getState().labelList],
                            {
                                [index]: {
                                    ...data
                                }
                            }
                        )
                    });
                    ctx.dispatch(new SendToastAction({ type:"SUCCESS", message: `Updated label ${data.title}` }));
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
}

