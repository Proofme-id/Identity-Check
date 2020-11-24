import { NgModule } from "@angular/core";
import { EmployeesPageComponent } from "./employees.page";
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
        component: EmployeesPageComponent
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
        EmployeesPageComponent,
    ],
    providers: [

    ]
})
export class EmployeesPageModule {

}
