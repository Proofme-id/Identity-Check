export class DeleteEmployee {
    static readonly type = "[Organisation] DeleteEmployee";

    constructor(public employeeId: number) {}
}
