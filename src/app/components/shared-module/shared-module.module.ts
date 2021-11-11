import { NgModule } from "@angular/core";
import { SafeHtmlPipeImage } from "../../pipes/safe-html-pipe-image";
import { SafeUrlPipe } from "../../pipes/safe-link-pipe";
@NgModule({
    imports: [],
    declarations: [SafeUrlPipe, SafeHtmlPipeImage],
    exports: [SafeUrlPipe, SafeHtmlPipeImage]
})
export class SharedModule {}
