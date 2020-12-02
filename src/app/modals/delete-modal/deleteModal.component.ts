import { Component, Input } from "@angular/core";
import { BsModalService } from "ngx-bootstrap/modal";
import { Subject } from "rxjs";

@Component({
    selector: "delete-modal",
    templateUrl: "./deleteModal.component.html"
})
export class DeleteModalComponent {

    public onClose: Subject<boolean>;

    @Input()
    name: string = null;

    constructor(private modalService: BsModalService) {}

    public ngOnInit(): void {
        this.onClose = new Subject();
    }

    closeModal(): void {
        this.onClose.next(false);
        this.modalService.hide();
    }

    delete(): void {
        this.onClose.next(true);
        this.modalService.hide();
    }

}
