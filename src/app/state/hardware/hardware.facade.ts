import { Injectable } from "@angular/core";
import { Select, Store } from "@ngxs/store";
import { HardwareState } from "./hardware.state";
import { SetHardwareList } from "./actions/set-hardware-list";
import { DeleteHardware } from "./actions/delete-hardware";
import { AddHardware } from "./actions/add-hardware";
import { Observable } from "rxjs";
import { IHardware } from "src/app/interfaces/hardware.interface";
import { UpdateHardware } from "./actions/update-hardware";



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

    addHardware(name: string, description: string, serialnumber: string, employeeId: number): Observable<void> {
        return this.store.dispatch(new AddHardware(name, description, serialnumber, employeeId));
    }

    deleteHardware(hardwareId: number): Observable<void> {
        return this.store.dispatch(new DeleteHardware(hardwareId))
    }

    updateHardware(id: number, name: string, description: string, employeeId: number): Observable<void> {
        return this.store.dispatch(new UpdateHardware(id, name, description, employeeId));
    }
}
