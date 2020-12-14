import { Component, Input, OnInit } from "@angular/core";
import { BsModalService } from "ngx-bootstrap/modal";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { RoleStateFacade } from "src/app/state/role/role.facade";
import { IRole } from "src/app/interfaces/role.interface";

@Component({
    selector: "role-modal",
    templateUrl: "./roleModal.component.html"
})
export class RoleModalComponent implements OnInit {

    public RoleForm: FormGroup;

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
        this.RoleForm = this.formBuilder.group({
            title: new FormControl(this.role ? this.role.title : null, Validators.required),
            reportsTo: new FormControl( this.role ? this.role.reportsTo : null),
            description: new FormControl(this.role ? this.role.details.description : null, Validators.required)
        });
    }

    update(): void {
        const title: string = this.RoleForm.get("title").value;
        let reportsTo = this.RoleForm.get("reportsTo").value;
        if (reportsTo) {
            reportsTo = parseInt(reportsTo, 10);
        }
        console.log("reportsTo", reportsTo);
        console.log("typeof", typeof reportsTo);
        const description: string = this.RoleForm.get("description").value;
        this.roleStateFacade.updateRole(this.role.id, title, reportsTo, description);
        this.closeModal()
    }

    add(): void {
        const title: string = this.RoleForm.get("title").value;
        const reportsTo: number = this.RoleForm.get("reportsTo").value;
        const description: string = this.RoleForm.get("description").value;
        this.roleStateFacade.addRole(title, reportsTo, description);
        this.closeModal()
    }

    closeModal(): void {
        this.modalService.hide();
    }
}
