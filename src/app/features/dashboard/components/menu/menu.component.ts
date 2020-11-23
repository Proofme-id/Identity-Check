import { Component } from "@angular/core";
import { UserStateFacade } from "src/app/state/user/user.facade";

@Component({
    selector: "app-menu",
    templateUrl: "menu.component.html",
    styleUrls: ["menu.component.scss"],
})
export class MenuComponent {

    isAdmin$ = this.userStateFacade.isAdmin$;

    constructor(
        private userStateFacade: UserStateFacade
    ) {

    }
}
