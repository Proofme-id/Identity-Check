export class AddProject{
    static readonly type = "[Project] AddProject";

    constructor(public name: string, public description: string) {}
}
