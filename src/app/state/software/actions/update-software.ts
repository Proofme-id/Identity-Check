export class UpdateSoftware {
    static readonly type = "[Software] UpdateSoftware";

    constructor(public id: number, public name: string, public description: string, public employeeId: number) {}
}
