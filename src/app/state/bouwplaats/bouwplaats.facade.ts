import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Select, Store } from "@ngxs/store";
import { BouwplaatsState } from "./bouwplaats.state";
import { ICredentialObject } from "@proofmeid/webrtc-web";
import { AddToLoggedPeopleAction } from "./actions/add-to-logged-people.action";

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
}
