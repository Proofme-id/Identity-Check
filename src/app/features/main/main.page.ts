import { AfterViewInit, Component, NgZone, ViewChild } from "@angular/core";
import { IValidCredential, ProofmeUtilsProvider, WebRtcProvider } from "@proofmeid/webrtc-web";
import { ZXingScannerComponent } from "@zxing/ngx-scanner";
import { NgxSpinnerService } from "ngx-spinner";
import { filter, skip, takeUntil } from "rxjs/operators";
import { BaseComponent } from "../base-component/base-component";

@Component({
	templateUrl: "main.page.html",
	styleUrls: ["main.page.scss"]
})
export class MainPageComponent extends BaseComponent implements AfterViewInit {

	web3Url = "https://api.didux.network/";
	validCredentialObj: IValidCredential = null;
	blockResult = false;
	credentialObject = null;
	sharedType: string;

	@ViewChild("scannerView")
	scannerView: ZXingScannerComponent;

	mediaDeviceSupported = true;

	constructor(
		private webRtcProvider: WebRtcProvider,
		private ngZone: NgZone,
		private spinner: NgxSpinnerService,
		private proofmeUtilsProvider: ProofmeUtilsProvider
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
		}
	}

	ngAfterViewInit(): void {
		if (this.mediaDeviceSupported) {
			this.scannerView.previewElemRef.nativeElement.onplay = () => {
				this.spinner.hide();
			}
		}
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
				// signalingUrl: "ws://10.1.17.46:4005"
				// signalingUrl: "ws://192.168.0.125:4005"
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
				this.validCredentialObj = await this.proofmeUtilsProvider.validCredentials(data.credentialObject, this.web3Url);
				if (!this.validCredentialObj.valid) {
					console.error(this.validCredentialObj);
				} else {
					this.ngZone.run(() => {
						this.credentialObject = data.credentialObject.credentials;
						this.sharedType = data.sharedType;
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

	reScan(): void {
		this.webRtcProvider.remoteDisconnect();
		this.spinner.show();
		setInterval(() => {
			if (this.scannerView) {
				this.scannerView.previewElemRef.nativeElement.onplay = () => {
					this.spinner.hide();
				}
			}
		}, 50);
		this.credentialObject = null;
		this.validCredentialObj = null;
	}

    convertTwoDigitDate(twoDigitYearDate: string): Date {
		const year = twoDigitYearDate.substring(0, 2);
		const month = twoDigitYearDate.substring(2, 4);
		const day = twoDigitYearDate.substring(4, 6);

		let fullYear = null;
		if (parseInt(year, 10) >= 40) {
			fullYear = "19" + year;
		} else {
			fullYear = "20" + year;
		}
		return new Date(`${fullYear}-${month}-${day}`);
	}
}
