import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { UserStateFacade } from "src/app/state/user/user.facade";
import { WebRtcProvider } from "@proofmeid/webrtc-web";

@Component({
    selector: "app-logout",
    templateUrl: "logout.component.html"
})
export class LogoutComponent implements OnInit {

    constructor(private route: Router,
                private webRtcProvider: WebRtcProvider,
                private userStateFacade: UserStateFacade) {}

    ngOnInit(): void {
        localStorage.clear();
        this.webRtcProvider.remoteDisconnect();
        this.userStateFacade.logout();
        this.route.navigate(["/login"]);
    }
}
