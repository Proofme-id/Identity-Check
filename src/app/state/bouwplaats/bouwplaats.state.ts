import { Action, Selector, State, StateContext } from "@ngxs/store";
import { AddToLoggedPeopleAction } from "./actions/add-to-logged-people.action";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ICredentialObject } from "@proofmeid/webrtc-web";
import { RemoveLoggedPersonOnIndexAction } from "./actions/remove-logged-person-on-index.action";
import { DeleteAllLoggedPeopleAction } from "./actions/delete-all-logged-people.action";
import { RemovedLoggedPeopleAfterTimeAction } from "./actions/remove-logged-people-after-time.action";
import moment from "moment";

export interface IBouwplaatsState {
    loggedPeople: { date: Date, credentialObject: ICredentialObject }[];
}

@State<IBouwplaatsState>({
    name: "bouwplaats",
    defaults: {
        loggedPeople: []
    }
})
@Injectable()
export class BouwplaatsState {

    @Selector()
    static loggedPeople(state: IBouwplaatsState): { date: Date, credentialObject: ICredentialObject }[] {
        try {
            return JSON.parse(JSON.stringify(state.loggedPeople)).reverse();
        } catch (error) {
            console.error("error:", error);
        }
    }

    constructor(
        private http: HttpClient,
    ) {}

    @Action(AddToLoggedPeopleAction)
    setPageTitleLanguageKey(ctx: StateContext<IBouwplaatsState>, payload: AddToLoggedPeopleAction): void {
        const state = ctx.getState();
        ctx.patchState({
            loggedPeople: [
                ...state.loggedPeople, 
                { credentialObject: payload.credentialObject, date: new Date()}
            ]
        });
    }

    @Action(RemoveLoggedPersonOnIndexAction)
    removeEntryOnIndex(ctx: StateContext<IBouwplaatsState>, payload: RemoveLoggedPersonOnIndexAction): void {
        console.log("BouwplaatsState - removeEntryOnIndex:", payload.index);
        // Just copy it so we can just splice it
        const copyLoggedPeople = JSON.parse(JSON.stringify(ctx.getState().loggedPeople));
        // Splice it
        copyLoggedPeople.reverse().splice(payload.index, 1);
        ctx.patchState({
            // Set the new array
            loggedPeople: copyLoggedPeople.reverse()
        });
    }

    @Action(DeleteAllLoggedPeopleAction)
    deleteAllLoggedPeople(ctx: StateContext<IBouwplaatsState>): void {
        ctx.patchState({
            loggedPeople: []
        });
    }

    @Action(RemovedLoggedPeopleAfterTimeAction)
    removedLoggedPeopleAfterTime(ctx: StateContext<IBouwplaatsState>, payload: RemovedLoggedPeopleAfterTimeAction): void {
        const copyLoggedPeople = JSON.parse(JSON.stringify(ctx.getState().loggedPeople));
        for (const person of copyLoggedPeople) {
            const personMomentDate = moment(person.date);
            if (personMomentDate.isBefore(moment().subtract(payload.amount, payload.type))) {
                person.delete = true;
            } else {
                person.delete = false;
            }
        }
        const filteredLoggedPeople = copyLoggedPeople.filter(x => !x.delete);
        ctx.patchState({
            loggedPeople: filteredLoggedPeople
        });
    }
}
