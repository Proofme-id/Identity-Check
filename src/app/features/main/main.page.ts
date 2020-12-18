import { AfterViewInit, Component, NgZone, ViewChild } from "@angular/core";
import { WebRtcProvider, ProofmeUtilsProvider } from "@proofmeid/webrtc-web";
import { filter, skip, takeUntil } from "rxjs/operators";
import { BaseComponent } from "../base-component/base-component";
import { NgxSpinnerService } from "ngx-spinner";
import { ZXingScannerComponent } from "@zxing/ngx-scanner";
import { IValidCredential } from "src/app/interfaces/valid-credential.interface";
import Web3 from "web3";
import { claimHolderAbi } from "../../smartcontracts/claimHolderAbi";
import { ICheckedDid } from "src/app/interfaces/checkedDid.interface";

@Component({
	templateUrl: "main.page.html",
	styleUrls: ["main.page.scss"]
})
export class MainPageComponent extends BaseComponent implements AfterViewInit {

	web3Url = "https://api.didux.network/";
	validCredentialObj: IValidCredential = null;
	blockResult = false;
	shared = null;
	sharedType: string;

	@ViewChild("scannerView")
	scannerView: ZXingScannerComponent;

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
	}

	ngAfterViewInit(): void {
		this.scannerView.previewElemRef.nativeElement.onplay = () => {
			this.spinner.hide();
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
			this.webRtcProvider.setConfig({
				isHost: false,
				signalingUrl: null
			});
			this.webRtcProvider.launchWebsocketClient();
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
				console.log("data.shared:", data.shared);
				const checkedDid: ICheckedDid[] = [];
				for (const sharedItem of data.shared) {
					this.validCredentialObj = await this.proofmeUtilsProvider.validCredential(sharedItem, this.web3Url, checkedDid);
					console.log("this.validCredentialObj:", this.validCredentialObj);
					if (!this.validCredentialObj.valid) {
						break;
					}
				}
				if (!this.validCredentialObj.valid) {
					console.error(this.validCredentialObj);
				} else {
					this.ngZone.run(() => {
						this.shared = data.shared;
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
		this.shared = null;
		this.validCredentialObj = null;
	}

	credentialIsPassportImage(type: string): boolean {
        return type === "PassportImage";
    }

    valueIsTrueBoolean(value: string | boolean): boolean {
        return value === true;
    }

    valueIsFalseBoolean(value: string | boolean): boolean {
        return value === false;
    }

	isTwoDigitDateCredential(type: string): boolean {
		if (type === "DocumentExpiryDateCredential" || type === "DateOfBirthCredential") {
			return true;
		}
		return false;
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
