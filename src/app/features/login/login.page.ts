import { Component, OnInit, ViewChild, ElementRef, NgZone, TemplateRef, AfterViewInit} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { filter, skip, takeUntil } from 'rxjs/operators';
import * as QRCode from 'qrcode';
import { ConfigProvider } from 'src/app/providers/config/configProvider';
import { BaseComponent } from '../base-component/base-component';
import { UserStateFacade } from 'src/app/state/user/user.facade';
import { AppStateFacade } from 'src/app/state/app/app.facade';
import { ToastrService } from 'ngx-toastr';
import { WebRtcProvider } from '@proofmeid/webrtc-web';
import { BsModalService } from 'ngx-bootstrap/modal';
import { RecoveryModalComponent } from 'src/app/modals/recoveryModal.component';

@Component({
    templateUrl: 'login.page.html',
    styleUrls: ['login.page.scss']
})
export class LoginPageComponent extends BaseComponent implements OnInit {
    loginForm: FormGroup;
    websocketDisconnected = false;
    mobileLoginUrl: string;
    emailEnabled$ = this.appStateFacade.emailEnabled$;
    webRtcEnabled$ = this.appStateFacade.webRtcEnabled$;
    backendUrlDown$ = this.appStateFacade.backendUrlDown$;

    @ViewChild('qrCodeCanvas', null)
    qrCodeCanvas: ElementRef;

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
        private modalService: BsModalService
    ) {
        super();

        this.loginForm = this.formBuilder.group({
            email: new FormControl('', Validators.required),
            password: new FormControl('', Validators.required)
        });

        // These are for the email callback
        this.activatedRoute.queryParams.subscribe((params: Params) => {
            if (params.emailVerified && params.emailVerified === 'true') {
                this.toastr.success('Email verification success! Please login');
            } else if (params.emailVerified && params.emailVerified === 'false') {
                this.toastr.error('Email verification failed!');
            } else if (params.emailRecoveryExpired && params.emailRecoveryExpired === 'true') {
                this.toastr.error('Account recovery expired!');
            } else if (params.emailRecovered && params.emailRecovered === 'true') {
                this.toastr.success('Account recovery success!');
            } else if (params.emailRecovered && params.emailRecovered === 'false') {
                this.toastr.error('Account recovery failed!');
            } else if (params.emailRecoverCancelled && params.emailRecoverCancelled === 'true') {
                this.toastr.success('Account recovery cancelled successfully!');
            } else if (params.emailRecoverCancelled && params.emailRecoverCancelled === 'false') {
                this.toastr.error('Account recovery cancel failed!');
            }
        });
    }

    async ngOnInit() {
        await this.configProvider.getConfig();
        this.appStateFacade.setAuthWsUrl();
        this.appStateFacade.authWsUrl$.pipe(takeUntil(this.destroy$)).subscribe((signalingUrl) => {
            if (signalingUrl) {
                this.setupWebRtc(signalingUrl);
            }
        });

        this.userStateFacade.userLoginError$.pipe(skip(1), takeUntil(this.destroy$)).subscribe((error) => {
            if (error) {
                this.toastr.error('Login failed');
            }
        });
        this.userStateFacade.accessToken$.pipe(skip(1), takeUntil(this.destroy$)).subscribe((token) => {
            if (token) {
                this.ngZone.run(() => {
                    this.router.navigate(['registrate-finish']);
                });
            }
        });

        this.appStateFacade.backendUrlDown$.pipe(skip(1), takeUntil(this.destroy$)).subscribe((down) => {
            if (down) {
                this.toastr.error('Portal backend unreachable.');
            }
        });
    }

    async setupWebRtc(signalingUrl: string) {
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
            this.mobileLoginUrl = `diduxio://didux.io/p2p?uuid=${uuid}&wsUrl=${signalingUrl}`;
        });
        this.webRtcProvider.websocketConnectionClosed$.pipe(skip(1), takeUntil(this.destroy$), filter(x => !!x)).subscribe((closed) => {
            this.websocketDisconnected = true;
        });
        this.webRtcProvider.receivedActions$.pipe(skip(1), takeUntil(this.destroy$), filter(x => !!x)).subscribe((data) => {
            console.log('Received:', data);
            // When the client is connected
            if (data.action === 'p2pConnected' && data.p2pConnected) {
                // Login with mobile
                this.webRtcProvider.sendData('login', { url: config.backendUrl });
            }
            if (data.token) {
                // Set the token
                this.userStateFacade.setAccessToken(data.token);
            }
            if (data.identify) {
                // Identify with mobile
                const timestamp = new Date();
                const credentials = {
                    credentials: [
                        { key: 'EMAIL', provider: 'EMAIL', name: 'Email' },
                    ],
                    by: config.appName,
                    description: config.appDescription
                };
                this.webRtcProvider.sendData('identify', { request: credentials, type: 'email', timestamp, url: config.backendUrl, login: true });
            }
            if (data.recover) {
                this.modalService.show(RecoveryModalComponent);
            }
        });
        this.webRtcProvider.launchWebsocketClient();
    }

    refreshWebsocketDisconnect() {
        this.webRtcProvider.launchWebsocketClient();
    }

    login() {
        const email = this.loginForm.get('email').value;
        const password = this.loginForm.get('password').value;
        this.userStateFacade.userLogin(email, password);
    }
}
