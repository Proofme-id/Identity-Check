import { BuildNumberComponent } from "./build-number/build-number.component";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { RouterModule } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { MainHeaderComponent } from "./main-header/main-header.component";
import { FooterComponent } from "./footer/footer.component";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { LanguageProvider } from "../providers/language/languageProvider";
import { InstructionOverlayComponent } from "./instruction-overlay/instruction-overlay.component";


@NgModule({
    imports: [
        TranslateModule,
        RouterModule,
        CommonModule,
        FontAwesomeModule,
        NgbModule
    ],
    declarations: [
        BuildNumberComponent,
        MainHeaderComponent,
        FooterComponent,
        InstructionOverlayComponent
    ],
    exports: [
        BuildNumberComponent,
        MainHeaderComponent,
        FooterComponent,
        InstructionOverlayComponent
    ],
    providers: [
        LanguageProvider
    ]
})
export class ComponentsModule {}
