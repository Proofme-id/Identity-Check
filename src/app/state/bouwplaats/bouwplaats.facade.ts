import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Select, Store } from "@ngxs/store";
import { BouwplaatsState } from "./bouwplaats.state";
import { ICredentialObject } from "@proofmeid/webrtc-web";
import { AddToLoggedPeopleAction } from "./actions/add-to-logged-people.action";
import { RemoveLoggedPersonOnIndexAction } from "./actions/remove-logged-person-on-index.action";
import { DeleteAllLoggedPeopleAction } from "./actions/delete-all-logged-people.action";
import { RemovedLoggedPeopleAfterTimeAction } from "./actions/remove-logged-people-after-time.action";
import { DurationInputArg2 } from "moment";

@Injectable()
export class BouwplaatsStateFacade {

    @Select(BouwplaatsState.loggedPeople)
    loggedPeople$: Observable<{ date: Date, credentialObject: ICredentialObject }[]>;

    constructor(
        private store: Store
    ) {}

    addToLoggedPeople(credentialObject: ICredentialObject): Observable<void> {
        return this.store.dispatch(new AddToLoggedPeopleAction(credentialObject));
    }

    removeLoggedPersonOnIndex(index: number): Observable<void> {
        return this.store.dispatch(new RemoveLoggedPersonOnIndexAction(index));
    }

    deleteAllLoggedPeople(): Observable<void> {
        return this.store.dispatch(new DeleteAllLoggedPeopleAction());
    }

    removedLoggedPeopleAfterTime(type: DurationInputArg2, amount: number): Observable<void> {
        return this.store.dispatch(new RemovedLoggedPeopleAfterTimeAction(type, amount));
    }
}
