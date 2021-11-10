import { Component, ElementRef, NgZone, ViewChild } from "@angular/core";
import { IRequestedCredentials, IRequestedCredentialsCheckResult, IValidatedCredentials, ProofmeUtilsProvider, WebRtcProvider, ICredentialObject } from "@proofmeid/webrtc-web";
import { NgxSpinnerService } from "ngx-spinner";
import * as QRCode from "qrcode";
import { filter, skip, take, takeUntil } from "rxjs/operators";
import { BouwplaatsStateFacade } from "src/app/state/bouwplaats/bouwplaats.facade";
import { ISettings } from "../../interfaces/attributeRequest.interface";
import { AppStateFacade } from "../../state/app/app.facade";
import { BaseComponent } from "../base-component/base-component";

@Component({
	templateUrl: "bouwplaats.page.html",
	styleUrls: ["bouwplaats.page.scss"]
})
export class BouwplaatsPageComponent extends BaseComponent {
	@ViewChild("qrCodeCanvas") qrCodeCanvas: ElementRef;
	objectKeys = Object.keys;

	requestedData: IRequestedCredentials = null;
	settings: ISettings = { action: null, language: "nl", trustedAuthorities: ["0xa6De718CF5031363B40d2756f496E47abBab1515"] };
	web3Url = "https://api.didux.network/";
	validCredentialObj: IValidatedCredentials | IRequestedCredentialsCheckResult;
	blockResult = false;
	credentialObject: ICredentialObject = null;
	websocketDisconnected = false;
	mediaDeviceSupported = true;
	showLoggedPeople = false;
	showExternalInstruction$ = this.appStateFacade.showExternalInstruction$;
	loggedPeople$ = this.bouwplaatsStateFacade.loggedPeople$;
	// IMPORTANT!!
	allowDemoAttributes = true;

	constructor(
		private webRtcProvider: WebRtcProvider,
		private ngZone: NgZone,
		private spinner: NgxSpinnerService,
		private proofmeUtilsProvider: ProofmeUtilsProvider,
		private appStateFacade: AppStateFacade,
		private bouwplaatsStateFacade: BouwplaatsStateFacade
	) {
		super();

		window.onbeforeunload = () => {
			console.log("WINDOW UNLOAD");
			this.webRtcProvider.remoteDisconnect();
		};

		if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
			console.log("This browser does not support the API yet");
			this.mediaDeviceSupported = false;
		} else {
			this.setupIdentifyWebRtc();
		}
	}

	setupIdentifyWebRtc(): void {
		this.appStateFacade.setAuthWsUrl();
		this.appStateFacade.authWsUrl$.pipe(takeUntil(this.destroy$), filter(x => !!x), take(1)).subscribe(async (signalingUrl) => {
			console.log("connecting to:", signalingUrl);
			this.webRtcProvider.launchWebsocketClient({
				signalingUrl,
				isHost: true
			});
			this.webRtcProvider.uuid$.pipe(skip(1), takeUntil(this.destroy$), filter(x => !!x)).subscribe(uuid => {
				console.log("uuid:", uuid);
				const canvas = this.qrCodeCanvas.nativeElement as HTMLCanvasElement;
				this.websocketDisconnected = false;
				setTimeout(() => {
					QRCode.toCanvas(canvas, `p2p:${uuid}:${encodeURIComponent(signalingUrl)}`, {
						width: 210
					});
				}, 200);
			});
			this.webRtcProvider.websocketConnectionClosed$.pipe(skip(1), takeUntil(this.destroy$), filter(x => !!x)).subscribe(() => {
				console.log("User disconnect");
				this.websocketDisconnected = true;
			});
			this.webRtcProvider.receivedActions$.pipe(skip(1), takeUntil(this.destroy$), filter(x => !!x)).subscribe(async (data) => {
				console.log("webRtcProvider Received:", data);
				// When the client is connected
				if (data.action === "p2pConnected" && data.p2pConnected === true) {
					// Login with mobile
					this.appStateFacade.setShowExternalInstruction(true);
					this.requestedData = {
						by: "Proofme.ID",
						description: "For entering the bouwplaats",
						credentials: [
							{
								key: "PHOTO",
								provider: "EPASS",
								required: true
							},
							{
								key: "FIRST_NAME",
								provider: "EPASS",
								required: true
							},
							{
								key: "LAST_NAME",
								provider: "EPASS",
								required: true
							},
							{
								key: "BIRTH_DATE",
								provider: "EPASS",
								required: true
							}
						],
						minimumRequired: {
							data: ["PHOTO", "FIRST_NAME", "LAST_NAME", "BIRTH_DATE"],
							amount: 4
						}
					}
					console.log("Request data:", this.requestedData);
					const timestamp = new Date();
					this.webRtcProvider.sendData("identify", {
						request: this.requestedData,
						timestamp
					});
				}
				if (data.action === "identify") {
					console.log("Identify shared credentials:", data.credentialObject);
					console.log("Identify requested credentials:", this.requestedData);
					if (!this.allowDemoAttributes && data.credentialObject) {
						await this.validateIdentifyData(data);
					} else if (this.allowDemoAttributes) {
						this.appStateFacade.setShowExternalInstruction(false);
						this.setCredentialObject(data.credentialObject);
					} else {
						console.log("No credentials provided. Probably clicked cancel on the mobile app");
					}
				}
				if (data.action === "disconnect") {
					this.appStateFacade.setShowExternalInstruction(false);
					this.websocketDisconnected = true;
				}
			});
		});
	}

	async validateIdentifyData(data: { credentialObject: ICredentialObject }): Promise<void> {
		console.log("this.requestedData:", this.requestedData);
		this.validCredentialObj = await this.proofmeUtilsProvider.validCredentialsTrustedParties(data.credentialObject, this.web3Url, this.requestedData, this.settings.trustedAuthorities, true);
		console.log("validCredentials result:", this.validCredentialObj);
		this.appStateFacade.setShowExternalInstruction(false);
		if (!(this.validCredentialObj as IValidatedCredentials).valid) {
			console.error(this.validCredentialObj);
		} else {
			this.setCredentialObject(data.credentialObject);
			console.log("this.credentialObject:", this.credentialObject);
		}
	}

	setupWebrtcResponseHandler(): void {
		this.webRtcProvider.receivedActions$.pipe(skip(1)).subscribe(async (data) => {
			console.log("Received:", data);
			// When the client is connected
			if (data.action === "p2pConnected" && data.p2pConnected) {
				console.log("P2P Connected!");
			}
			if (data.action === "shared") {
				await this.validateSharedData(data);
			}
		});

		this.webRtcProvider.websocketConnectionClosed$.pipe(skip(1), takeUntil(this.destroy$), filter(x => !!x)).subscribe(() => {
			console.log("Websocket closed!");
		});

		this.webRtcProvider.websocketConnectionOpen$.pipe(skip(1), takeUntil(this.destroy$), filter(x => !!x)).subscribe(() => {
			console.log("Websocket open!");
		});
	}

	async validateSharedData(data: { credentialObject: ICredentialObject, identifyByCredentials: IRequestedCredentials }): Promise<void> {
		console.log("data.credentialObject shared:", data.credentialObject);
		this.validCredentialObj = await this.proofmeUtilsProvider.validCredentialsTrustedParties(data.credentialObject, this.web3Url, data.identifyByCredentials, this.settings.trustedAuthorities, true);
		if (!(this.validCredentialObj as IValidatedCredentials).valid) {
			console.error(this.validCredentialObj);
		} else {
			this.setCredentialObject(data.credentialObject);
		}
		this.ngZone.run(() => {
			this.blockResult = false;
			this.spinner.hide();
		});
		console.log("SENDING SHARE SUCCESS!!!");
		this.webRtcProvider.sendData("share-success", {});
	}

	setCredentialObject(credentialObject: ICredentialObject): void {
		this.ngZone.run(() => {
			this.credentialObject = credentialObject;
		});
	}

	async reScan(): Promise<void> {
		this.webRtcProvider.disconnect();
		this.credentialObject = null;
		this.validCredentialObj = null;
		this.setupIdentifyWebRtc();
	}

	async refreshWebsocketDisconnect(): Promise<void> {
		this.setupIdentifyWebRtc();
	}

	reset(approved: boolean): void {
		if(approved) {
			this.bouwplaatsStateFacade.addToLoggedPeople(this.credentialObject);
		}
		this.credentialObject = null;
		this.reScan();
	}

	toggleLoggedPeople(): void {
		this.showLoggedPeople = !this.showLoggedPeople;
		this.credentialObject = null;
	}
}

