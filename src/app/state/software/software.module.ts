import { NgModule } from "@angular/core";
import { NgxsModule } from "@ngxs/store";
import { SoftwareStateFacade } from "./software.facade";
import { SoftwareState } from "./software.state";


@NgModule({
    imports: [
        NgxsModule.forFeature([SoftwareState])
    ],
    providers: [
        SoftwareStateFacade,
    ]
})
export class SoftwareStateModule {

}
