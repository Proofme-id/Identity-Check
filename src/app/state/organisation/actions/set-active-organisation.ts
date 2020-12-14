import { ICustomClaims } from "../../../interfaces/customClaims.interface";

export class SetActiveOrganisation {
    static readonly type = "[Organisation] SetActiveOrganisation";

    constructor(public customClaims: ICustomClaims[]) {}
}
