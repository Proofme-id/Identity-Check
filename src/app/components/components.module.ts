import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { TranslateModule } from "@ngx-translate/core";
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
