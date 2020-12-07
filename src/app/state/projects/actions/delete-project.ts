export class DeleteProject {
    static readonly type = "[Organisation] DeleteProject";

    constructor(public projectId: number) {}
}
