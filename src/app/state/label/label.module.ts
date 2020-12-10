import { NgModule } from "@angular/core";
import { NgxsModule } from "@ngxs/store";
import { LabelStateFacade } from "./label.facade";
import { LabelState } from "./label.state";


@NgModule({
    imports: [
        NgxsModule.forFeature([LabelState])
    ],
    providers: [
       LabelStateFacade,
    ]
})
export class LabelStateModule {

}
