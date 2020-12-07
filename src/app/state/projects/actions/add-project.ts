export class AddProject{
    static readonly type = "[Organisation] AddProject";

    constructor(public name: string, public description: string) {}
}
