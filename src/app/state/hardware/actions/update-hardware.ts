export class UpdateHardware {
    static readonly type = "[Hardware] UpdateHardware";

    constructor(public id: number, public name: string, public description: string, public employeeId: number) {}
}
