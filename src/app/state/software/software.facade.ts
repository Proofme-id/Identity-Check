import { Injectable } from "@angular/core";
import { Select, Store } from "@ngxs/store";
import { SoftwareState } from "./software.state";
import { SetSoftwareList } from "./actions/set-software-list";
import { DeleteSoftware } from "./actions/delete-software";
import { AddSoftware } from "./actions/add-software";
import { Observable } from "rxjs";
import { ISoftware } from "src/app/interfaces/software.interface";

@Injectable({
    providedIn: "root"
})
export class SoftwareStateFacade {

    @Select(SoftwareState.softwareList)
    softwareList$: Observable<ISoftware[]>;

    constructor(private store: Store) {}

    setSoftwareList(): Observable<void> {
        return this.store.dispatch(new SetSoftwareList());
    }

    addSoftware(name: string, description: string): Observable<void> {
        return this.store.dispatch(new AddSoftware(name, description));
    }

    deleteSoftware(softwareId: number): Observable<void> {
        return this.store.dispatch(new DeleteSoftware(softwareId))
    }
}
