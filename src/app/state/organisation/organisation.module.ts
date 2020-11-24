import { NgModule } from "@angular/core";
import { NgxsModule } from "@ngxs/store";
import { OrganisationStateFacade } from "./organisation.facade";
import { OrganisationState } from "./organisation.state";

@NgModule({
    imports: [
        NgxsModule.forFeature([OrganisationState])
    ],
    providers: [
        OrganisationStateFacade,
    ]
})
export class OrganisationStateModule {

}
