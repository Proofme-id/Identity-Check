import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { AppStateFacade } from "src/app/state/app/app.facade";
import { Columns, Config, DefaultConfig } from "ngx-easy-table";
import { BaseComponent } from "../base-component/base-component";
import { filter, takeUntil } from "rxjs/operators";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { LabelAddModalComponent } from "../../modals/label-add-modal/labelAddModal.component";
import { DeleteModalComponent } from "src/app/modals/delete-modal/deleteModal.component";
import { ILabel } from "src/app/interfaces/label.interface";
import { LabelStateFacade } from "src/app/state/label/label.facade";
import { LabelUpdateModalComponent } from 'src/app/modals/update-modal/updateModal.component';

@Component({
    templateUrl: "label.page.html",
    styleUrls: ["label.page.scss"]
})

export class LabelPageComponent extends BaseComponent implements OnInit {

    @ViewChild("id") id: ElementRef;
    @ViewChild("title") title: ElementRef;
    @ViewChild("description") description: ElementRef;
    @ViewChild("color") color: ElementRef;

    @ViewChild("titleTpl", { static: true }) titleTpl: TemplateRef<unknown>;
    @ViewChild("idTpl", { static: true }) idTpl: TemplateRef<unknown>;
    @ViewChild("descriptionTpl", {static: true }) descriptionTpl: TemplateRef<unknown>;
    @ViewChild("colorTpl", { static: true }) colorTpl: TemplateRef<unknown>;
    @ViewChild("actionTpl", { static: true }) actionTpl: TemplateRef<unknown>;

    public modalRef: BsModalRef;

    constructor(
        private appStateFacade: AppStateFacade,
        private modalService: BsModalService,
        private labelStateFacade: LabelStateFacade
    ) {
        super();
        this.appStateFacade.setPageTitleLanguageKey("LABEL.title");
    }

    ngOnInit(): void {
        this.labelStateFacade.setLabelList();
        this.labelStateFacade.labelList$.pipe(takeUntil(this.destroy$), filter(x => !!x)).subscribe((labelList) => {
            this.data = labelList;
        });
        
        this.configuration = { ...DefaultConfig };
        this.configuration.searchEnabled = false;
        this.columns = [
            { key: "title", title: "title" },
            { key: "description", title: "Description"},
            { key: "color", title: "Color" },
            { key: "action", title: "Action", cellTemplate: this.actionTpl}
        ];
    }

    public configuration: Config;
    public columns: Columns[];

    public data = []

    delete(label: ILabel): void {
        const initialState = { name: label.title };
        this.modalRef = this.modalService.show(DeleteModalComponent, {initialState, class: "modal-sm modal-dialog-centered", ignoreBackdropClick: true });
        this.modalRef.content.onClose.pipe(filter(x => !!x)).subscribe(() => {
            this.labelStateFacade.deleteLabel(label.id);
        })
    }

    edit(label: ILabel): void {
        // console.log("label ", label);
        const initialState = { label }
        this.modalService.show(LabelUpdateModalComponent, {initialState, class: "modal-lg modal-dialog-centered", ignoreBackdropClick: true });

    }

    add(): void {
        this.modalService.show(LabelAddModalComponent, {class: "modal-lg modal-dialog-centered", ignoreBackdropClick: true });
    }
}
