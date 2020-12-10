import { IOrganisation } from "./organisation.interface";

export interface ILabel {
    id: number;
    title: string;
    description: string;
    organisation?: IOrganisation;
    color: string;
}
