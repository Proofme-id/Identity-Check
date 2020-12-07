import { IOrganisation } from "./organisation.interface";

export interface IProject {
    id: number;
    name: string;
    description: string;
    organisation?: IOrganisation;
}
