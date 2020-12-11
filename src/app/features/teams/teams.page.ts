import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { AppStateFacade } from "src/app/state/app/app.facade";
import { Columns, Config, DefaultConfig } from "ngx-easy-table";
import { BaseComponent } from "../base-component/base-component";
import { filter, takeUntil } from "rxjs/operators";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { TeamAddModalComponent } from "../../modals/team-add-modal/teamAddModal.component";
import { DeleteModalComponent } from "src/app/modals/delete-modal/deleteModal.component";
import { TeamStateFacade } from "src/app/state/teams/team.facade";
import { ITeam } from "src/app/interfaces/team.interface";


@Component({
    templateUrl: "teams.page.html",
    styleUrls: ["teams.page.scss"]
})

export class TeamsPageComponent extends BaseComponent implements OnInit {

    @ViewChild("id") id: ElementRef;
    @ViewChild("name") name: ElementRef;
    @ViewChild("description") description: ElementRef;
    @ViewChild("actionTpl", { static: true }) actionTpl: TemplateRef<unknown>;

    public modalRef: BsModalRef;

    constructor(
        private appStateFacade: AppStateFacade,
        private modalService: BsModalService,
        private teamStateFacade: TeamStateFacade
    ) {
        super();
        this.appStateFacade.setPageTitleLanguageKey("TEAMS.title");
    }

    ngOnInit(): void {
        this.teamStateFacade.setTeamList();
        this.teamStateFacade.teamList$.pipe(takeUntil(this.destroy$), filter(x => !!x)).subscribe((teamList) => {
            this.data = teamList;
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

    delete(team: ITeam): void {
        const initialState = { name: team.name };
        this.modalRef = this.modalService.show(DeleteModalComponent, {initialState, class: "modal-sm modal-dialog-centered", ignoreBackdropClick: true });
        this.modalRef.content.onClose.pipe(filter(x => !!x)).subscribe(() => {
            this.teamStateFacade.deleteTeam(team.id);
        })
    }

    view(team: ITeam): void {
        console.log("team ", team);
    }

    add(): void {
        this.modalService.show(TeamAddModalComponent, {class: "modal-lg modal-dialog-centered", ignoreBackdropClick: true });
    }
}
