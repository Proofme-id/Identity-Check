import { Component } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { BaseComponent } from "./features/base-component/base-component";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.scss"]
})
export class AppComponent extends BaseComponent {

    constructor(
        private translateService: TranslateService
    ) {
        super();
        this.translateService.setDefaultLang("en");
        this.translateService.use("en");
    }
}
