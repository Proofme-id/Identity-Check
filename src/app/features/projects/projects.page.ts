import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { AppStateFacade } from "src/app/state/app/app.facade";
import { Columns, Config, DefaultConfig } from "ngx-easy-table";
import { BaseComponent } from "../base-component/base-component";
import { filter, takeUntil } from "rxjs/operators";
import { OrganisationStateFacade } from "../../state/organisation/organisation.facade";
import { ToastrService } from "ngx-toastr";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { ProjectAddModalComponent } from "../../modals/project-add-modal/projectAddModal.component";
import { DeleteModalComponent } from "src/app/modals/delete-modal/deleteModal.component";
import { ProjectStateFacade } from "src/app/state/projects/project.facade";
import { IProject } from "src/app/interfaces/project.interface";


@Component({
    templateUrl: "projects.page.html",
    styleUrls: ["projects.page.scss"]
})

export class ProjectsPageComponent extends BaseComponent implements OnInit {

    @ViewChild("id") id: ElementRef;
    @ViewChild("name") name: ElementRef;
    @ViewChild("description") description: ElementRef;
    @ViewChild("actionTpl", { static: true }) actionTpl: TemplateRef<unknown>;

    public modalRef: BsModalRef;

    constructor(
        private appStateFacade: AppStateFacade,
        private organisationStateFacade: OrganisationStateFacade,
        private toastr: ToastrService,
        private modalService: BsModalService,
        private projectStateFacade: ProjectStateFacade
    ) {
        super();
        this.appStateFacade.setPageTitleLanguageKey("PROJECTS.title");
    }

    ngOnInit(): void {
        this.projectStateFacade.setProjectList();
        this.projectStateFacade.projectList$.pipe(takeUntil(this.destroy$), filter(x => !!x)).subscribe((projectList) => {
            this.data = projectList;
        });
        
        this.configuration = { ...DefaultConfig };
        this.configuration.searchEnabled = false;
        this.columns = [
            { key: "name", title: "Name" },
            { key: "details.description", title: "Description"},
            { key: "action", title: "Actions", cellTemplate: this.actionTpl }
        ];
    }

    public configuration: Config;
    public columns: Columns[];

    public data = []

    delete(project: IProject): void {
        const initialState = { name: project.name };
        this.modalRef = this.modalService.show(DeleteModalComponent, {initialState, class: "modal-sm modal-dialog-centered", ignoreBackdropClick: true });
        this.modalRef.content.onClose.pipe(filter(x => !!x)).subscribe(() => {
            this.projectStateFacade.deleteProject(project.id);
        })
    }

    view(project: IProject): void {
        console.log("project ", project);
    }

    add(): void {
        this.modalService.show(ProjectAddModalComponent, {class: "modal-lg modal-dialog-centered", ignoreBackdropClick: true });
    }
}
