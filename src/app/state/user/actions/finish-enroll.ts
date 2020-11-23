import { IEnroll } from "../../../interfaces/enroll.interface";

export class FinishEnrollAction {
    static readonly type = "[User] FinishEnrollAction";

    constructor(public enroll: IEnroll) {}
}
