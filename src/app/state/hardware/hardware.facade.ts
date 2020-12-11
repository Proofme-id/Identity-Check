import { Injectable } from "@angular/core";
import { Select, Store } from "@ngxs/store";
import { HardwareState } from "./hardware.state";
import { SetHardwareList } from "./actions/set-hardware-list";
import { DeleteHardware } from "./actions/delete-hardware";
import { AddHardware } from "./actions/add-hardware";
import { Observable } from "rxjs";
import { IHardware } from "src/app/interfaces/hardware.interface";



@Injectable({
    providedIn: "root"
})
export class HardwareStateFacade {

    @Select(HardwareState.hardwareList)
    hardwareList$: Observable<IHardware[]>;

    constructor(private store: Store) {}

    setHardwareList(): Observable<void> {
        return this.store.dispatch(new SetHardwareList());
    }

    addHardware(name: string, description: string, serialnumber: string): Observable<void> {
        return this.store.dispatch(new AddHardware(name, description, serialnumber));
    }

    deleteHardware(hardwareId: number): Observable<void> {
        return this.store.dispatch(new DeleteHardware(hardwareId))
    }
}
