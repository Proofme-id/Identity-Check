import { IOrganisation } from "./organisation.interface";

export interface IRole {
    details: {
        description: string;
    };
    id: number;
    title: string;
    reportsTo: number;
    reportsToName?: string;
    organisation?: IOrganisation;
}
