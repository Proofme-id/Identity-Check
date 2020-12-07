import { Action, Selector, State, StateContext, Store } from "@ngxs/store";
import { HttpClient } from "@angular/common/http";
import { ConfigProvider } from "src/app/providers/config/configProvider";
import { tap } from "rxjs/operators";
import { catchError } from "rxjs/internal/operators/catchError";
import { Observable, throwError } from "rxjs";
import { Injectable } from "@angular/core";
import { ISupplier } from "../../interfaces/supplier.interface";
import { SetSupplierList } from "./actions/set-supplier-list";
import { AddSupplier } from "./actions/add-supplier";
import { DeleteSupplier } from "./actions/delete-supplier";
import { SendToastAction } from "../app/actions/toastMessage";
import { IDeleteResponse } from "src/app/interfaces/delete-response.interface";
import { OrganisationState } from "../organisation/organisation.state";



export interface ISupplierstate {
    supplierList: ISupplier[];
}

@State<ISupplierstate>({
    name: "supplier",
    defaults: {
        supplierList: null,
    }
})
@Injectable()
export class Supplierstate {

    
    @Selector()
    static supplierList(state: ISupplierstate): ISupplier[] {
        return state.supplierList;
    }


    constructor(
        private http: HttpClient,
        private configProvider: ConfigProvider,
        private store: Store
    ) {

    }

    @Action(SetSupplierList)
    setSupplierList(ctx: StateContext<ISupplierstate>): Observable<ISupplier[]> {
        const organisation = this.store.selectSnapshot(OrganisationState.activeOrganisation)
        return this.http.get(
            `${this.configProvider.config.backendUrl}/v1/supplier/all/${organisation}`,
        ).pipe(
            tap((supplierList: ISupplier[]) => {
                ctx.patchState({
                    supplierList
                });
            }),
            catchError((error) => {
                return throwError(error);
            })
        );
    }
    
    @Action(AddSupplier)
    addSupplier(ctx: StateContext<ISupplierstate>, payload: AddSupplier): Observable<ISupplier> {
        try {
            return this.http.post(
                `${this.configProvider.config.backendUrl}/v1/supplier`,
                {
                    name: payload.name,
                    details: {
                        description: payload.description
                    },
                    organisationId: this.store.selectSnapshot(OrganisationState.activeOrganisation)
                }
            ).pipe(
                tap((data: ISupplier) => {
                    console.log(data);
                    ctx.patchState({
                        supplierList: [...ctx.getState().supplierList, data ]
                    });
                    ctx.dispatch(new SendToastAction({ type:"SUCCESS", message: `Added supplier ${data.name}` }));
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

    @Action(DeleteSupplier)
    deleteSupplier(ctx: StateContext<ISupplierstate>, payload: DeleteSupplier): Observable<IDeleteResponse> {
        try {
            return this.http.delete(
                `${this.configProvider.config.backendUrl}/v1/supplier/${payload.supplierId}`,
            ).pipe(
                tap(() => {
                    const supplierList: ISupplier[] = ctx.getState().supplierList.filter(x => x.id !== payload.supplierId);
                    ctx.patchState({
                        supplierList
                    });
                    ctx.dispatch(new SendToastAction({ type: "SUCCESS", message: `Deleted supplier ${payload.supplierId}`}));
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
