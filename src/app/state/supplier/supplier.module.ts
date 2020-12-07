import { NgModule } from "@angular/core";
import { NgxsModule } from "@ngxs/store";
import { SupplierStateFacade } from "./supplier.facade";
import { Supplierstate } from "./supplier.state";


@NgModule({
    imports: [
        NgxsModule.forFeature([Supplierstate])
    ],
    providers: [
        SupplierStateFacade,
    ]
})
export class SupplierStateModule {

}
