export class AddSoftware{
    static readonly type = "[Software] AddSoftware";

    constructor(public name: string, public description: string, public employeeId: number) {}
}
