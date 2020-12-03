import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { TranslateService } from "@ngx-translate/core";
import { IBuildNumber } from "./interfaces/build-number.interface";
import { ConfigProvider } from "./providers/config/configProvider";
import { AppStateFacade } from "./state/app/app.facade";
import { OrganisationStateFacade } from "./state/organisation/organisation.facade";
import { OrganisationSelectModalComponent } from "./modals/organisation-select-modal/organisationSelectModal.component";
import { BsModalService } from "ngx-bootstrap/modal";
import { BaseComponent } from "./features/base-component/base-component";
import { filter, takeUntil } from "rxjs/operators";
import { ToastrService } from "ngx-toastr";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.scss"]
})
export class AppComponent extends BaseComponent implements OnInit  {
    showOrganisationSelector$ = this.organisationStateFacade.showOrganisationSelector$;
    message$ = this.appStateFacade.message$;

    constructor(
        private translateService: TranslateService,
        private http: HttpClient,
        private appStateFacade: AppStateFacade,
        private configProvider: ConfigProvider,
        private titleService: Title,
        private organisationStateFacade: OrganisationStateFacade,
        private modalService: BsModalService,
        private toastr: ToastrService
    ) {
        super();
        this.translateService.setDefaultLang("en");
        this.translateService.use("en");
        this.setBuildNumber();
    }

    async ngOnInit(): Promise<void> {
        await this.configProvider.getConfig();
        this.titleService.setTitle(this.configProvider.config.appName);
        this.showOrganisationSelector$.pipe(takeUntil(this.destroy$), filter(x => !!x)).subscribe(() => {
            this.modalService.show(OrganisationSelectModalComponent, { class: "modal-md modal-dialog-centered", ignoreBackdropClick: true });
        })

        this.message$.pipe(takeUntil(this.destroy$)).subscribe((message) => {
            if (message) {
                if (message.type === "SUCCESS") {
                    this.toastr.success(message.message);
                } else if (message.type === "WARNING") {
                    this.toastr.warning(message.message);
                } else if (message.type === "ERROR") {
                    this.toastr.error(message.message);
                }else {
                    this.toastr.info(message.message);
                }
            }
        })
    }

    setBuildNumber(): void {
        this.http.get("assets/buildNumber.json").subscribe((buildNumber: IBuildNumber) => {
            this.appStateFacade.setBuildNumber(buildNumber.buildNumber);
        });
    }
}
