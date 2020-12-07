export class AddTeam{
    static readonly type = "[Organisation] AddTeam";

    constructor(public name: string, public description: string) {}
}
