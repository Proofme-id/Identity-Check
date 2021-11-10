import { NgModule } from "@angular/core";
import { NgxsModule } from "@ngxs/store";
import { BouwplaatsState } from "./bouwplaats.state";
import { BouwplaatsStateFacade } from "./bouwplaats.facade";

@NgModule({
    imports: [
        NgxsModule.forFeature([BouwplaatsState])
    ],
    providers: [
        BouwplaatsStateFacade
    ]
})
export class BouwplaatsStateModule {
}
