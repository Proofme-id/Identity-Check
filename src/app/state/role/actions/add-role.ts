export class AddRole {
    static readonly type = "[Role] AddRole";

    constructor(public title: string, public reportsTo: string, public description: string) {}
}
