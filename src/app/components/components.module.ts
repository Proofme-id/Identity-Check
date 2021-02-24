import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { RouterModule } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
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
        InstructionOverlayComponent,
    ],
    exports: [
        InstructionOverlayComponent,
    ],
    providers: [

    ]
})
export class ComponentsModule {}
