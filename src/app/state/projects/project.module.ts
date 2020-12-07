import { NgModule } from "@angular/core";
import { NgxsModule } from "@ngxs/store";
import { ProjectStateFacade } from "./project.facade";
import { ProjectState } from "./project.state";


@NgModule({
    imports: [
        NgxsModule.forFeature([ProjectState])
    ],
    providers: [
        ProjectStateFacade,
    ]
})
export class ProjectStateModule {

}
