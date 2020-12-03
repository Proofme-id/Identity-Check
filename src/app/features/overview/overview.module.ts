import { NgModule } from "@angular/core";
import { OverviewPageComponent } from "./overview.page";
import { Routes, RouterModule } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { ComponentsModule } from "../../components/components.module";
import { TableModule } from "ngx-easy-table";

const routes: Routes = [
    {
        path: "",
        component: OverviewPageComponent
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
        ComponentsModule,
        TableModule
    ],
    declarations: [
        OverviewPageComponent,
    ],
    providers: [

    ]
})
export class OverviewPageModule {

}
