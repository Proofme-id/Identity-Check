export class DeleteProject {
    static readonly type = "[Project] DeleteProject";

    constructor(public projectId: number) {}
}
