import { IOrganisation } from "./organisation.interface";

export interface IEmployee {
    id: number;
    username: string;
    userPower: number;
    active: boolean;
    userPowerName: string;
    organisationId: number;
    organisation?: IOrganisation;
}
