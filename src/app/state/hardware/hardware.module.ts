import { NgModule } from "@angular/core";
import { NgxsModule } from "@ngxs/store";
import { HardwareStateFacade } from "./hardware.facade";
import { HardwareState } from "./hardware.state";


@NgModule({
    imports: [
        NgxsModule.forFeature([HardwareState])
    ],
    providers: [
       HardwareStateFacade,
    ]
})
export class HardwareStateModule {

}
