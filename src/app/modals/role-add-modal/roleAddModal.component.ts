import { Component, Input, OnInit } from "@angular/core";
import { BsModalService } from "ngx-bootstrap/modal";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { RoleStateFacade } from "src/app/state/role/role.facade";
import { IRole } from "src/app/interfaces/role.interface";

@Component({
    selector: "role-add-modal",
    templateUrl: "./roleAddModal.component.html"
})
export class RoleAddModalComponent implements OnInit {

    public addRoleForm: FormGroup;

    @Input()
    roleList: IRole[] = null;

    constructor(
        private modalService: BsModalService,
        private formBuilder: FormBuilder,
        private roleStateFacade: RoleStateFacade
    ) {
        this.addRoleForm = this.formBuilder.group({
            title: new FormControl("", Validators.required),
            reportsTo: new FormControl(null),
            description: new FormControl("", Validators.required)
        });
    }

    ngOnInit(): void {
        console.log("roleList:", this.roleList);
    }

    add(): void {
        const title: string = this.addRoleForm.get("title").value;
        const reportsTo: string = this.addRoleForm.get("reportsTo").value;
        const description: string = this.addRoleForm.get("description").value;
        this.roleStateFacade.addRole(title, reportsTo, description);
        this.closeModal()
    }

    closeModal(): void {
        this.modalService.hide();
    }
}
