import { NgModule } from "@angular/core";
import { MainPageComponent } from "./main.page";
import { RouterModule, Routes } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";
import { CommonModule } from "@angular/common";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { ComponentsModule } from "src/app/components/components.module";
import { NgxSelectModule } from "ngx-select-ex";
import { BsModalService, ModalModule } from "ngx-bootstrap/modal";
import { SharedModule } from "../../components/shared-module/shared-module.module";
import { ZXingScannerModule } from "@zxing/ngx-scanner"
import { NgxSpinnerModule } from "ngx-spinner";
import { SafeHtmlPipeImage } from "src/pipes/safe-html-pipe-image";

const routes: Routes = [
    {
        path: "",
        component: MainPageComponent
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
        MainPageComponent,
        SafeHtmlPipeImage
    ],
    providers: [
        BsModalService,
        SafeHtmlPipeImage
    ]
})
export class MainPageModule {

}
