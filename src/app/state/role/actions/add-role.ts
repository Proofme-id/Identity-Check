export class AddRole {
    static readonly type = "[Organisation] AddRole";

    constructor(public title: string, public reportsTo: string, public description: string) {}
}
