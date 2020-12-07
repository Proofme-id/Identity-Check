export class DeleteTeam {
    static readonly type = "[Organisation] DeleteTeam";

    constructor(public teamId: number) {}
}
