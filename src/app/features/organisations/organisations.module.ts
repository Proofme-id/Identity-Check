import { NgModule } from "@angular/core";
import { OrganisationsPageComponent } from "./organisations.page";
import { Routes, RouterModule } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { TableModule } from "ngx-easy-table";

const routes: Routes = [
    {
        path: "",
        component: OrganisationsPageComponent
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
        TranslateModule,
        ReactiveFormsModule,
        CommonModule,
        FormsModule,
        FontAwesomeModule,
        NgbModule,
        TableModule
    ],
    declarations: [
        OrganisationsPageComponent,
    ],
    providers: [

    ]
})
export class OrganisationsPageModule {

}
