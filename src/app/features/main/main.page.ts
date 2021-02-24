import { Component, ElementRef, NgZone, ViewChild } from "@angular/core";
import { IValidCredential, ProofmeUtilsProvider, WebRtcProvider } from "@proofmeid/webrtc-web";
import { ZXingScannerComponent } from "@zxing/ngx-scanner";
import { BsModalService } from "ngx-bootstrap/modal";
import { NgxSpinnerService } from "ngx-spinner";
import * as QRCode from "qrcode";
import { filter, skip, take, takeUntil } from "rxjs/operators";
import { IAttributeRequest, ISettings } from "../../interfaces/attributeRequest.interface";
import { ActionSelectModalComponent } from "../../modals/action-select-modal/actionSelectModal.component";
import { AppStateFacade } from "../../state/app/app.facade";
import { BaseComponent } from "../base-component/base-component";

@Component({
	templateUrl: "main.page.html",
	styleUrls: ["main.page.scss"]
})
export class MainPageComponent extends BaseComponent {

	requestedData: IAttributeRequest = null;
	settings: ISettings = { action: null, language: "nl", trustedAuthorities: ["0xa6De718CF5031363B40d2756f496E47abBab1515"]};

	web3Url = "https://api.didux.network/";
	validCredentialObj: IValidCredential;
	blockResult = false;
	credentialObject = null;

	@ViewChild("scannerView")
	scannerView: ZXingScannerComponent;

	@ViewChild("qrCodeCanvas")
	qrCodeCanvas: ElementRef;
	websocketDisconnected = false;

	mediaDeviceSupported = true;


	constructor(
		private webRtcProvider: WebRtcProvider,
		private ngZone: NgZone,
		private spinner: NgxSpinnerService,
		private proofmeUtilsProvider: ProofmeUtilsProvider,
		private modalService: BsModalService,
		private appStateFacade: AppStateFacade
	) {
		super();
		this.spinner.show();

		window.onbeforeunload = () => {
			console.log("WINDOW UNLOAD");
            this.webRtcProvider.remoteDisconnect();
		};
		
		if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
			console.log("This browser does not support the API yet");
			this.mediaDeviceSupported = false;
			this.spinner.hide();
		} else {
			setTimeout(() => {
				this.spinner.hide();
				this.showMenu();
			}, 1000);
		}
	}

	showMenu(): void {
		const initialState = { settings: this.settings };
		const modalRef = this.modalService.show(ActionSelectModalComponent, { initialState, class: "modal-md modal-dialog-centered", ignoreBackdropClick: true });
		modalRef.content.requestedData.pipe(filter(x => !!x)).subscribe(async (requestedData) => {
			this.requestedData = requestedData;
			console.log("RequestedData: ", requestedData)
		})
		modalRef.content.newSettings.pipe(filter(x => !!x)).subscribe(async (settings) => {
			this.settings = settings;
			console.log("Settings: ", settings)
			if (settings.action === "REQUEST") {
				this.setupIdentifyWebRtc();
			}
		})
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
					console.log("REquest data:", this.requestedData);
					const timestamp = new Date();
					this.webRtcProvider.sendData("identify", {
						request: JSON.parse(JSON.stringify(this.requestedData)),
						type: "multiple",
						timestamp
					});
				}
				if (data.action === "identify") {
					console.log("Identify shared credentials:", data.credentialObject);
					console.log("Identify requested credentials:", this.requestedData);
					if (data.credentialObject) {
						const identifyByCredentials = []
						for (const credential of this.requestedData.credentials) {
							identifyByCredentials.push({
								key: credential.key,
								provider: credential.provider
							})
						}

						this.validCredentialObj = await this.proofmeUtilsProvider.validCredentialsTrustedParties(data.credentialObject, this.web3Url, identifyByCredentials,this.settings.trustedAuthorities);
						console.log("validCredentials result:", this.validCredentialObj);
						this.appStateFacade.setShowExternalInstruction(false);
						if (!this.validCredentialObj.valid) {
							console.error(this.validCredentialObj);
						} else {
							this.ngZone.run(() => {
								this.credentialObject = data.credentialObject.credentials;
							});
						}
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

	onCodeResult(resultString: string): void {
		if (!this.blockResult) {
			this.blockResult = true;
			this.spinner.show();
			console.log("onCodeResult:", resultString);
			const uuid = resultString.split(":")[1];
			console.log("uuid:", uuid);
			this.webRtcProvider.setHostUuid(uuid);
			this.webRtcProvider.launchWebsocketClient({
				isHost: false,
				signalingUrl: null
			});
			this.setupWebrtcResponseHandler();
		} else {
			console.log("BLOCKED duplicate scan");
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
				console.log("data.credentialObject:", data.credentialObject);
				this.validCredentialObj = await this.proofmeUtilsProvider.validCredentialsTrustedParties(data.credentialObject, this.web3Url, data.identifyByCredentials, this.settings.trustedAuthorities);
				if (!this.validCredentialObj.valid) {
					console.error(this.validCredentialObj);
				} else {
					this.ngZone.run(() => {
						this.credentialObject = data.credentialObject.credentials;
					});
				}
				this.ngZone.run(() => {
					this.blockResult = false;
					this.spinner.hide();
				});
				console.log("SENDING SHARE SUCCESS!!!");
				this.webRtcProvider.sendData("share-success", {});
			}
		});

		this.webRtcProvider.websocketConnectionClosed$.pipe(skip(1), takeUntil(this.destroy$), filter(x => !!x)).subscribe(() => {
			console.log("Websocket closed!");
		});

		this.webRtcProvider.websocketConnectionOpen$.pipe(skip(1), takeUntil(this.destroy$), filter(x => !!x)).subscribe(() => {
			console.log("Websocket open!");
		});
	}

	async reScan(): Promise<void> {
		await this.webRtcProvider.disconnect();
		this.spinner.show();
		const interval = setInterval(() => {
			if (this.scannerView && this.settings.action === "SCAN") {
				this.scannerView.previewElemRef.nativeElement.onplay = () => {
					this.spinner.hide();
					clearInterval(interval);
				}
			} else {
				this.spinner.hide();
				clearInterval(interval);
			}
		}, 300);
		this.credentialObject = null;
		this.validCredentialObj = null;
		this.setupIdentifyWebRtc();
	}

	async refreshWebsocketDisconnect(): Promise<void> {
		this.setupIdentifyWebRtc();
	}

	objectKeysWithFilter(object: any): string[] {
		return Object.keys(object).filter(x => x !== "PHOTO");
	}

	getFriendlyValue(key: string, value: any) {
		if(key === "OLDER_THAN_18") {
			if(value == true) {
				return "Yes"
			} else {
				return "No"
			}
		} else if(key === "GENDER") {
			if(value == "MALE") {
				return "Male"
			} else {
				return "Female"
			}
		} else {
			return value;
		}
	}

	getExpectedValue(key: string): string {
		const result = this.requestedData.credentials.find(x => x.key === key).expectedValue;
		if (!result || result === "" ) {
			return null
		} else {
			return result
		}
	}
}

