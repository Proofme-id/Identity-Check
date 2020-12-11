import { NgModule } from "@angular/core";
import { NgxsModule } from "@ngxs/store";
import { RoleStateFacade } from "./role.facade";
import { RoleState } from "./role.state";


@NgModule({
    imports: [
        NgxsModule.forFeature([RoleState])
    ],
    providers: [
        RoleStateFacade,
    ]
})
export class RoleStateModule {

}
