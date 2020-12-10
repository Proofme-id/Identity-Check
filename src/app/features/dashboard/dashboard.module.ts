import { NgModule } from "@angular/core";
import { DashboardPageComponent } from "./dashboard.page";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { TranslateModule } from "@ngx-translate/core";
import { Routes, RouterModule } from "@angular/router";
import { LogoutComponent } from "./components/logout/logout.component";
import { ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { COMPONENTS } from "./components";
import { ComponentsModule } from "src/app/components/components.module";
import { IsAdminGuard } from "src/app/guards/is-admin.guard";
import { IsOrganisationAdminGuard } from "../../guards/is-organisation-admin.guard";

const routes: Routes = [
    {
        path: "",
        component: DashboardPageComponent,
        children: [
            {
                path: "",
                redirectTo: "overview",
                pathMatch: "full"
            },
            {
                path: "logout",
                component: LogoutComponent
            },
            {
                path: "users",
                loadChildren: "../users/users.module#UsersPageModule",
                canActivate: [IsAdminGuard]
            },
            {
                path: "employees",
                loadChildren: "../employees/employees.module#EmployeesPageModule",
                canActivate: [IsOrganisationAdminGuard]
            },
            {
                path: "organisations",
                loadChildren: "../organisations/organisations.module#OrganisationsPageModule",
                canActivate: [IsAdminGuard]
            },
            {
                path: "suppliers",
                loadChildren: "../suppliers/suppliers.module#SuppliersPageModule",
                canActivate: [IsOrganisationAdminGuard]
            },
            {
                path: "hardware",
                loadChildren: "../hardware/hardware.module#HardwarePageModule",
                canActivate: [IsOrganisationAdminGuard]
            },
            {
                path: "label",
                loadChildren: "../label/label.module#LabelPageModule",
                canActivate: [IsOrganisationAdminGuard]
            },
            {
                path: "projects",
                loadChildren: "../projects/projects.module#ProjectsPageModule",
                canActivate: [IsOrganisationAdminGuard]
            },
            {
                path: "teams",
                loadChildren: "../teams/teams.module#TeamsPageModule",
                canActivate: [IsOrganisationAdminGuard]
            },
            {
                path: "overview",
                loadChildren: "../overview/overview.module#OverviewPageModule"
            },
            {
                path: "profile",
                loadChildren: "../profile/profile.module#ProfilePageModule"
            },
        ]
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
        FontAwesomeModule,
        ReactiveFormsModule,
        CommonModule,
        ComponentsModule,
        TranslateModule
    ],
    declarations: [
        ...COMPONENTS,
        DashboardPageComponent
    ]
})
export class DashboardPageModule {

}
