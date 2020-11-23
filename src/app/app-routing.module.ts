import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { HasJwtTokenDefinedGuard } from "./guards/has-jwt-token-defined.guard";

const routes: Routes = [
    {
        path: "",
        redirectTo: "/",
        pathMatch: "full",
    },
    {
        path: "",
        loadChildren: "./features/main/main.module#MainPageModule"
    },
    {
        path: "login",
        loadChildren: "./features/login/login.module#LoginPageModule"
    },
    {
        path: "enroll",
        loadChildren: "./features/enroll-organisation/enroll-organisation.module#EnrollOrganisationPageModule"
    },
    {
        path: "terms",
        loadChildren: "./features/terms/terms.module#TermsPageModule"
    },
    {
        path: "privacy",
        loadChildren: "./features/privacy/privacy.module#PrivacyPageModule"
    },
    {
        path: "faq",
        loadChildren: "./features/test_faq/faq.module#FaqPageModule"
    },
    {
        path: "dashboard",
        loadChildren: "./features/dashboard/dashboard.module#DashboardPageModule",
        canActivate: [HasJwtTokenDefinedGuard]
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: "top" })],
    exports: [RouterModule]
})
export class AppRoutingModule { }
