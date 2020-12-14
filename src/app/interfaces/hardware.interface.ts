import { IOrganisation } from "./organisation.interface";

export interface IHardware {
    id: number;
    name: string;
    details: {
        description: string;
        serialnumber: string;
    }
    organisation?: IOrganisation;
    employeeId: number;
}
