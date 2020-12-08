import { IOrganisation } from "./organisation.interface";

export interface IRole {
    id: number;
    title: string;
    reportsTo: number;
    reportsToName?: string;
    description: string;
    organisation?: IOrganisation;
}
