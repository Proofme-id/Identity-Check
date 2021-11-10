import { Action, Selector, State, StateContext } from "@ngxs/store";
import { AddToLoggedPeopleAction } from "./actions/add-to-logged-people.action";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ICredentialObject } from "@proofmeid/webrtc-web";

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
}
