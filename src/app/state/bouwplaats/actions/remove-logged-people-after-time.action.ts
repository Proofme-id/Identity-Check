import { DurationInputArg2 } from "moment";

export class RemovedLoggedPeopleAfterTimeAction {
    static readonly type = "[Bouwplaats] RemovedLoggedPeopleAfterTimeAction";

    constructor(public type: DurationInputArg2, public amount: number) {}
}
