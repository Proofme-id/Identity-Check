import { Injectable } from "@angular/core";
import { Select, Store } from "@ngxs/store";
import { LabelState } from "./label.state";
import { SetLabelList } from "./actions/set-label-list";
import { DeleteLabel } from "./actions/delete-label";
import { AddLabel } from "./actions/add-label";
import { Observable } from "rxjs";
import { ILabel } from "src/app/interfaces/label.interface";
import { UpdateLabel } from "./actions/update-label";



@Injectable({
    providedIn: "root"
})
export class LabelStateFacade {

    @Select(LabelState.labelList)
    labelList$: Observable<ILabel[]>;

    constructor(private store: Store) {}

    setLabelList(): Observable<void> {
        return this.store.dispatch(new SetLabelList());
    }

    addLabel(name: string, description: string, color: string): Observable<void> {
        return this.store.dispatch(new AddLabel(name, description,color));
    }

    deleteLabel(labelId: number): Observable<void> {
        return this.store.dispatch(new DeleteLabel(labelId))
    }

    updateLabel(name: string, description: string, color: string, labelId: number): Observable<void> {
        return this.store.dispatch(new UpdateLabel(name, description,color, labelId))
    }
}
