import { Injectable } from "@angular/core";
import { Select, Store } from "@ngxs/store";
import { Observable } from "rxjs";
import { ISupplier } from "src/app/interfaces/supplier.interface";
import { SetSupplierList } from "./actions/set-supplier-list";
import { AddSupplier } from "./actions/add-supplier";
import { DeleteSupplier } from "./actions/delete-supplier";
import { Supplierstate } from "./supplier.state";



@Injectable({
    providedIn: "root"
})
export class SupplierStateFacade {

    @Select(Supplierstate.supplierList)
    supplierList$: Observable<ISupplier[]>;

    constructor(private store: Store) {}

   
    setSupplierList(): Observable<void> {
        return this.store.dispatch(new SetSupplierList());
    }

    addSupplier(name: string, description: string): Observable<void> {
        return this.store.dispatch(new AddSupplier(name, description));
    }

    deleteSupplier(supplierId: number): Observable<void> {
        return this.store.dispatch(new DeleteSupplier(supplierId))
    }
}
