import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { TranslateModule } from "@ngx-translate/core";
import { ZXingScannerModule } from "@zxing/ngx-scanner"
import { BsModalService, ModalModule } from "ngx-bootstrap/modal";
import { NgxSelectModule } from "ngx-select-ex";
import { NgxSpinnerModule } from "ngx-spinner";
import { ComponentsModule } from "src/app/components/components.module";
import { SharedModule } from "../../components/shared-module/shared-module.module";
import { BouwplaatsPageComponent } from "./bouwplaats.page";

const routes: Routes = [
    {
        path: "",
        component: BouwplaatsPageComponent
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
        NgxSelectModule,
        ModalModule.forRoot(),
        SharedModule,
        ZXingScannerModule,
        NgxSpinnerModule
    ],
    declarations: [
        BouwplaatsPageComponent,
    ],
    providers: [
        BsModalService,
    ]
})
export class BouwplaatsPageModule {

}
