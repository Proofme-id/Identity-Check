import { IOrganisation } from "./organisation.interface";

export interface ITeam {
    id: number;
    name: string;
    description: string;
    organisation?: IOrganisation;
}
