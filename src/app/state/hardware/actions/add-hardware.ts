export class AddHardware {
    static readonly type = "[Hardware] AddHardware";

    constructor(public name: string, public description: string, public serialnumber: string, public employeeId: number) {}
}
