import { Component, Input, OnInit } from "@angular/core";
import { BsModalService } from "ngx-bootstrap/modal";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { RoleStateFacade } from "src/app/state/role/role.facade";
import { IRole } from "src/app/interfaces/role.interface";


@Component({
    selector: "role-update-modal",
    templateUrl: "./roleUpdateModal.component.html"
})
export class RoleUpdateModalComponent implements OnInit {

    public updateRoleForm: FormGroup;

    @Input()
    role: IRole = null;

    @Input()
    roleList: IRole[] = null;

    constructor(
        private modalService: BsModalService,
        private formBuilder: FormBuilder,
        private roleStateFacade: RoleStateFacade
    ) {

    }

    ngOnInit(): void {
        console.log("Update role:", this.role);
        this.updateRoleForm = this.formBuilder.group({
            title: new FormControl(this.role.title, Validators.required),
            reportsTo: new FormControl(this.role.reportsTo),
            description: new FormControl(this.role.details.description, Validators.required)
        });
    }

    update(): void {
        const title: string = this.updateRoleForm.get("title").value;
        let reportsTo = this.updateRoleForm.get("reportsTo").value;
        if (reportsTo) {
            reportsTo = parseInt(reportsTo, 10);
        }
        console.log("reportsTo", reportsTo);
        console.log("typeof", typeof reportsTo);
        const description: string = this.updateRoleForm.get("description").value;
        this.roleStateFacade.updateRole(this.role.id, title, reportsTo, description);
        this.closeModal()
    }

    closeModal(): void {
        this.modalService.hide();
    }
}
