import { Component } from "@angular/core";
import { BsModalService } from "ngx-bootstrap/modal";

@Component({
    selector: "app-recovery-modal",
    templateUrl: "./recoveryModal.component.html"
})
export class RecoveryModalComponent {

    constructor(private modalService: BsModalService) {}

    closeModal(): void {
        this.modalService.hide();
    }
}
