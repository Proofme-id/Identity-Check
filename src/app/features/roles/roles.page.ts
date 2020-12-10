import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { AppStateFacade } from "src/app/state/app/app.facade";
import { Columns, Config, DefaultConfig } from "ngx-easy-table";
import { BaseComponent } from "../base-component/base-component";
import { filter, takeUntil } from "rxjs/operators";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { DeleteModalComponent } from "src/app/modals/delete-modal/deleteModal.component";
import { IRole } from "src/app/interfaces/role.interface";
import { RoleStateFacade } from "src/app/state/role/role.facade";
import { RoleModalComponent } from "src/app/modals/role-modal/roleModal.component";

@Component({
    templateUrl: "roles.page.html",
    styleUrls: ["roles.page.scss"]
})

export class RolesPageComponent extends BaseComponent implements OnInit {

    @ViewChild("id") id: ElementRef;
    @ViewChild("title") title: ElementRef;
    @ViewChild("reportsTo") reportsTo: ElementRef;
    @ViewChild("description") description: ElementRef;

    @ViewChild("titleTpl", { static: true }) titleTpl: TemplateRef<unknown>;
    @ViewChild("reportsToTpl", { static: true }) reportsToTpl: TemplateRef<unknown>;
    @ViewChild("idTpl", { static: true }) idTpl: TemplateRef<unknown>;
    @ViewChild("descriptionTpl", { static: true }) descriptionTpl: TemplateRef<unknown>;
    @ViewChild("actionTpl", { static: true }) actionTpl: TemplateRef<unknown>;

    public modalRef: BsModalRef;

    constructor(
        private appStateFacade: AppStateFacade,
        private roleStateFacade: RoleStateFacade,
        private modalService: BsModalService
    ) {
        super();
        this.appStateFacade.setPageTitleLanguageKey("ROLES.title");
    }

    ngOnInit(): void {
        this.roleStateFacade.setRoleList();
        this.roleStateFacade.roleList$.pipe(takeUntil(this.destroy$), filter(x => !!x)).subscribe((roleList) => {
            this.data = roleList;
        });

        this.configuration = { ...DefaultConfig };
        this.configuration.searchEnabled = false;
        this.columns = [
            { key: "title", title: "Role" },
            { key: "reportsToName", title: "ReportsTo" },
            { key: "details.description", title: "Description" },
            { key: "action", title: "Actions", cellTemplate: this.actionTpl }
        ];
    }

    public configuration: Config;
    public columns: Columns[];

    public data = []

    delete(role: IRole): void {
        const initialState = { name: role.title };
        this.modalRef = this.modalService.show(DeleteModalComponent, { initialState, class: "modal-sm modal-dialog-centered", ignoreBackdropClick: true });
        this.modalRef.content.onClose.pipe(filter(x => !!x)).subscribe(() => {
            this.roleStateFacade.deleteRole(role.id);
        })
    }

    update(role: IRole): void {
        console.log("this.data:", this.data);
        const initialState = { role, roleList: this.data };
        this.modalService.show(RoleModalComponent, { initialState, class: "modal-lg modal-dialog-centered", ignoreBackdropClick: true });
    }

    add(): void {
        console.log("this.data:", this.data);
        const initialState = { roleList: this.data };
        this.modalService.show(RoleModalComponent, { initialState, class: "modal-lg modal-dialog-centered", ignoreBackdropClick: true });
    }
}
