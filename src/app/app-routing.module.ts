import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

console.log("HALLO:", window.location);

const routes: Routes = [
    {
        path: "",
        redirectTo: window.location.hostname === "bouwplaats.proofme.id" ? "bouwplaats" :"main",
        pathMatch: "full",
    },
    {
        path: "main",
        loadChildren: "./features/main/main.module#MainPageModule"
    },
    {
        path: "bouwplaats",
        loadChildren: "./features/bouwplaats/bouwplaats.module#BouwplaatsPageModule"
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: "top" })],
    exports: [RouterModule]
})
export class AppRoutingModule { }
