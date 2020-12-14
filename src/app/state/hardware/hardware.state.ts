import { Action, Selector, State, StateContext, Store } from "@ngxs/store";
import { HttpClient } from "@angular/common/http";
import { ConfigProvider } from "src/app/providers/config/configProvider";
import { tap } from "rxjs/operators";
import { catchError } from "rxjs/internal/operators/catchError";
import { Observable, throwError } from "rxjs";
import { Injectable } from "@angular/core";
import { SendToastAction } from "../app/actions/toastMessage";
import { IDeleteResponse } from "../../interfaces/delete-response.interface";
import { IHardware } from "src/app/interfaces/hardware.interface";
import { SetHardwareList } from "./actions/set-hardware-list";
import { DeleteHardware } from "./actions/delete-hardware";
import { AddHardware } from "./actions/add-hardware";
import { OrganisationState } from "../organisation/organisation.state";
import { UpdateHardware } from "./actions/update-hardware";

export interface IHardwareState {
    hardwareList: IHardware[];
}

@State<IHardwareState>({
    name: "hardware",
    defaults: {
        hardwareList: null
    }
})
@Injectable()
export class HardwareState {

    @Selector()
    static hardwareList(state: IHardwareState): IHardware[] {
        return state.hardwareList;
    }

    constructor(
        private http: HttpClient,
        private configProvider: ConfigProvider,
        private store: Store
    ) {

    }

    @Action(SetHardwareList)
    setHardwareList(ctx: StateContext<IHardwareState>): Observable<IHardware[]> {
        const organisation: number = this.store.selectSnapshot(OrganisationState.activeOrganisation)
        return this.http.get(
            `${this.configProvider.config.backendUrl}/v1/hardware/all/${organisation}`,
        ).pipe(
            tap((hardwareList: IHardware[]) => {
                ctx.patchState({
                    hardwareList
                });
            }),
            catchError((error) => {
                return throwError(error);
            })
        );
    }

    @Action(AddHardware)
    addHardware(ctx: StateContext<IHardwareState>, payload: AddHardware): Observable<IHardware> {
        try {
            return this.http.post(
                `${this.configProvider.config.backendUrl}/v1/hardware`,
                {
                    name: payload.name,
                    employeeId: payload.employeeId,
                    details: {
                        description: payload.description,
                        serialnumber: payload.serialnumber
                    },
                    organisationId: this.store.selectSnapshot(OrganisationState.activeOrganisation)
                }
            ).pipe(
                tap((data: IHardware) => {
                    console.log(data);
                    ctx.patchState({
                        hardwareList: [...ctx.getState().hardwareList, data ]
                    });
                    ctx.dispatch(new SendToastAction({ type:"SUCCESS", message: `Added hardware ${data.name}` }));
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

    @Action(DeleteHardware)
    deleteHardware(ctx: StateContext<IHardwareState>, payload: DeleteHardware): Observable<IDeleteResponse> {
        try {
            return this.http.delete(
                `${this.configProvider.config.backendUrl}/v1/hardware/${payload.hardwareId}`,
            ).pipe(
                tap(() => {
                    const hardwareList: IHardware[] = ctx.getState().hardwareList.filter(x => x.id !== payload.hardwareId);
                    ctx.patchState({
                        hardwareList
                    });
                    ctx.dispatch(new SendToastAction({ type: "SUCCESS", message: `Deleted hardware ${payload.hardwareId}`}));
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

    @Action(UpdateHardware)
    updateHardware(ctx: StateContext<IHardwareState>, payload: UpdateHardware): Observable<IHardware> {
        return this.http.patch(
            `${this.configProvider.config.backendUrl}/v1/hardware/${payload.id}`,
            {
                name: payload.name,
                employeeId: payload.employeeId,
                details: {
                    description: payload.description
                }
            }
        ).pipe(
            tap((data: IHardware) => {
                const index = ctx.getState().hardwareList.findIndex(x => x.id === payload.id);
                ctx.patchState({
                    hardwareList: Object.assign(
                        [...ctx.getState().hardwareList],
                        {
                            [index]: {
                                ...data
                            }
                        }
                    )
                });
                ctx.dispatch(new SendToastAction({ type: "SUCCESS", message: `Updated software ${data.name}` }));
            }),
            catchError((error) => {
                console.log("error:", error)
                if (error.error.error && error.error.error === "DUPLICATE") {
                    ctx.dispatch(new SendToastAction({ type: "ERROR", message: error.error.error }));
                } else {
                    ctx.dispatch(new SendToastAction({ type: "ERROR", message: "Something went wrong" }));
                }
                return throwError(error);
            })
        );
    }
}
