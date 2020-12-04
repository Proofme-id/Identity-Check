import { IOrganisation } from "./organisation.interface";

export interface IEmployee {
    id: number;
    name: string;
    userPower: number;
    active: boolean;
    userPowerName: string;
    organisationId: number;
    organisation?: IOrganisation;
}
