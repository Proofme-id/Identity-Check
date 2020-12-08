import { IOrganisation } from "./organisation.interface";

export interface IRole {
    id: number;
    title: string;
    reportsTo: string;
    description: string;
    organisation?: IOrganisation;
}
