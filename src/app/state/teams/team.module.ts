import { NgModule } from "@angular/core";
import { NgxsModule } from "@ngxs/store";
import { TeamStateFacade } from "./team.facade";
import { TeamState } from "./team.state";


@NgModule({
    imports: [
        NgxsModule.forFeature([TeamState])
    ],
    providers: [
        TeamStateFacade,
    ]
})
export class TeamStateModule {

}
