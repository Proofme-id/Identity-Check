import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { AppStateFacade } from "src/app/state/app/app.facade";
import { Columns, Config, DefaultConfig } from "ngx-easy-table";
import { BaseComponent } from "../base-component/base-component";
import { filter, takeUntil } from "rxjs/operators";
import { OrganisationStateFacade } from "../../state/organisation/organisation.facade";
import { ToastrService } from "ngx-toastr";
import { DeleteModalComponent } from "../../modals/delete-modal/deleteModal.component"
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { EmployeeInviteModalComponent } from "../../modals/employee-invite-modal/employeeInviteModal.component";

@Component({
    templateUrl: "employees.page.html",
    styleUrls: ["employees.page.scss"]
})
export class EmployeesPageComponent extends BaseComponent implements OnInit {

    @ViewChild("email") email: ElementRef;
    @ViewChild("name") name: ElementRef;
    @ViewChild("adminTpl", { static: true }) adminTpl: TemplateRef<unknown>;
    @ViewChild("activeTpl", { static: true }) activeTpl: TemplateRef<unknown>;
    @ViewChild("actionTpl", { static: true }) actionTpl: TemplateRef<unknown>;

    public modalRef: BsModalRef;

    constructor(
        private appStateFacade: AppStateFacade,
        private organisationStateFacade: OrganisationStateFacade,
        private toastr: ToastrService,
        private modalService: BsModalService
    ) {
        super();
        this.appStateFacade.setPageTitleLanguageKey("EMPLOYEE.title");
    }

    ngOnInit(): void {
        this.organisationStateFacade.setEmployeesList();
        this.organisationStateFacade.employeesList$.pipe(takeUntil(this.destroy$), filter(x => !!x)).subscribe((employeesList) => {
            this.data = employeesList;
            console.log("employeesList:", employeesList);
        });

        this.configuration = { ...DefaultConfig };
        this.configuration.searchEnabled = false;
        this.columns = [
            { key: "id", title: "ID" },
            { key: "name", title: "Name" },
            { key: "email", title: "Email" },
            { key: "userPower", title: "Admin", cellTemplate: this.adminTpl },
            { key: "active", title: "Active", cellTemplate: this.activeTpl },
            { key: "action", title: "Actions", cellTemplate: this.actionTpl }
        ];
    }

    public configuration: Config;
    public columns: Columns[];

    public data = []

    delete(name: string, id: number): void {
        const initialState = { name };
        this.modalRef = this.modalService.show(DeleteModalComponent, {initialState, class: 'modal-sm modal-dialog-centered', ignoreBackdropClick: true });
        this.modalRef.content.onClose.subscribe((result) => {
            console.log("Delete record: ", result);
            console.log("Name: ", name);
            console.log("Id: ", id);
            // Todo: Add action!
        })
    }

    view(name: string, id: number): void {
        console.log("Preview ", name);
    }

    invite(): void {
        this.modalService.show(EmployeeInviteModalComponent, {class: 'modal-lg modal-dialog-centered', ignoreBackdropClick: true });
    }
}
