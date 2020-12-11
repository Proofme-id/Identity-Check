export class AddRole {
    static readonly type = "[Role] AddRole";

    constructor(public title: string, public reportsTo: number, public description: string) {}
}
