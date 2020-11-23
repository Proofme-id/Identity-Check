import { Component, ElementRef, NgZone, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { filter, skip, takeUntil } from "rxjs/operators";
import * as QRCode from "qrcode";
import { ConfigProvider } from "src/app/providers/config/configProvider";
import { BaseComponent } from "../base-component/base-component";
import { UserStateFacade } from "src/app/state/user/user.facade";
import { AppStateFacade } from "src/app/state/app/app.facade";
import { ToastrService } from "ngx-toastr";
import { WebRtcProvider } from "@proofmeid/webrtc-web";
import { BsModalService } from "ngx-bootstrap/modal";
import { RecoveryModalComponent } from "src/app/modals/recoveryModal.component";
import { DeviceDetectorService } from "ngx-device-detector";
import { IEnroll } from "../../interfaces/enroll.interface";

@Component({
    templateUrl: "enroll-organisation.page.html",
    styleUrls: ["enroll-organisation.page.scss"]
})
export class EnrollOrganisationPageComponent extends BaseComponent implements OnInit {
    enrollForm: FormGroup;
    showForm: boolean;
    websocketDisconnected = false;
    mobileLoginUrl: string;
    postEnrollment = false;
    enrollData: IEnroll;

    @ViewChild("qrCodeCanvas")
    qrCodeCanvas: ElementRef;

    showMobileLogin = false;

    constructor(
        private configProvider: ConfigProvider,
        private webRtcProvider: WebRtcProvider,
        private userStateFacade: UserStateFacade,
        private router: Router,
        private ngZone: NgZone,
        private appStateFacade: AppStateFacade,
        private formBuilder: FormBuilder,
        private toastr: ToastrService,
        private activatedRoute: ActivatedRoute,
        private modalService: BsModalService,
        private deviceService: DeviceDetectorService
    ) {
        super();

        this.enrollForm = this.formBuilder.group({
            username: new FormControl("", Validators.required),
            companyName: new FormControl("", Validators.required),
            termsAccepted: new FormControl(false, Validators.requiredTrue),
            privacyAccepted: new FormControl(false, Validators.requiredTrue),
            newsLetter: new FormControl(false)
        });
        this.showForm = true;

        if (this.deviceService.isMobile() || this.deviceService.isTablet()) {
            this.showMobileLogin = true;
        }
    }

    async ngOnInit(): Promise<void> {
        await this.configProvider.getConfig();
        this.appStateFacade.setAuthWsUrl();
        this.appStateFacade.authWsUrl$.pipe(takeUntil(this.destroy$)).subscribe((signalingUrl) => {
            if (signalingUrl) {
                this.setupWebRtc(signalingUrl);
            }
        });

        this.userStateFacade.userLoginError$.pipe(skip(1), takeUntil(this.destroy$)).subscribe((error) => {
            if (error) {
                this.toastr.error("Login failed");
            }
        });
        // this.userStateFacade.accessToken$.pipe(skip(1), takeUntil(this.destroy$)).subscribe((token) => {
        //     if (token) {
        //         this.ngZone.run(() => {
        //             this.createCompany();
        //         });
        //     }
        // });

        this.appStateFacade.backendUrlDown$.pipe(skip(1), takeUntil(this.destroy$)).subscribe((down) => {
            if (down) {
                this.toastr.error("Portal backend unreachable.");
            }
        });
    }

    async setupWebRtc(signalingUrl: string): Promise<void> {
        const config = await this.configProvider.getConfig();
        this.webRtcProvider.setConfig({
            signalingUrl,
            isHost: true
        });

        this.webRtcProvider.uuid$.pipe(skip(1), takeUntil(this.destroy$), filter(x => !!x)).subscribe(uuid => {
            const canvas = this.qrCodeCanvas.nativeElement as HTMLCanvasElement;
            this.websocketDisconnected = false;
            QRCode.toCanvas(canvas, `p2p:${uuid}:${encodeURIComponent(signalingUrl)}`, {
                width: 210
            });
            this.ngZone.run(() => {
                this.mobileLoginUrl = `diduxio://didux.io/p2p?uuid=${uuid}&wsUrl=${signalingUrl}`;
                console.log("this.mobileLoginUrl:", this.mobileLoginUrl);
            });
        });
        this.webRtcProvider.websocketConnectionClosed$.pipe(skip(1), takeUntil(this.destroy$), filter(x => !!x)).subscribe(() => {
            this.websocketDisconnected = true;
        });
        this.webRtcProvider.receivedActions$.pipe(skip(1), takeUntil(this.destroy$), filter(x => !!x)).subscribe((data) => {
            console.log("Received:", data);
            // When the client is connected
            if (data.action === "p2pConnected") {
                if (data.p2pConnected) {
                    // Login with mobile
                    this.userStateFacade.setShowExternalInstruction(true);
                    this.webRtcProvider.sendData("login", { url: config.backendUrl });
                } else {
                    this.webRtcProvider.launchWebsocketClient();
                }
            }
            if (data.token) {
                this.ngZone.run(() => {
                    this.userStateFacade.setShowExternalInstruction(false);
                    // Set the token
                    this.userStateFacade.setAccessToken(data.token);
                    this.createCompany();
                });
            }
            if (data.identify) {
                // Identify with mobile
                const timestamp = new Date();
                const credentials = {
                    credentials: [
                        { key: "EMAIL", provider: "EMAIL", name: "Email" },
                    ],
                    by: config.appName,
                    description: config.appDescription
                };
                this.webRtcProvider.sendData("identify", { request: credentials, type: "email", timestamp, url: config.backendUrl, login: true });
            }
            if (data.recover) {
                this.modalService.show(RecoveryModalComponent);
            }
        });
        this.webRtcProvider.launchWebsocketClient();
    }

    refreshWebsocketDisconnect(): void {
        this.webRtcProvider.launchWebsocketClient();
    }

    enroll(): void {
        this.enrollData = {
            username: this.enrollForm.get("username").value,
            companyName: this.enrollForm.get("companyName").value,
            termsAccepted: this.enrollForm.get("termsAccepted").value,
            privacyAccepted: this.enrollForm.get("privacyAccepted").value,
            newsLetter: this.enrollForm.get("newsLetter").value
        }
        console.log(this.enrollData);
        this.showForm = false;
    }

    createCompany(): void {
        // this.router.navigate(["registrate-finish"]);
        this.postEnrollment = true;
        this.userStateFacade.finishEnroll(this.enrollData);
        // this.router.navigate(["dashboard"]);

    }
}
