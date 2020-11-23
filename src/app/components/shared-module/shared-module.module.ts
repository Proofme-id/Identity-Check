import { NgModule } from "@angular/core";
import { SafeUrlPipe } from "../../pipes/safe-link-pipe";
@NgModule({
    imports: [],
    declarations: [SafeUrlPipe],
    exports: [SafeUrlPipe]
})
export class SharedModule {}
