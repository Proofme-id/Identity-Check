export class UpdateRole {
    static readonly type = "[Role] UpdateRole";

    constructor(public id: number, public title: string, public reportsTo: number, public description: string) {}
}
