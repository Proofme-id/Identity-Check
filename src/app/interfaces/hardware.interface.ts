import { IOrganisation } from "./organisation.interface";

export interface IHardware {
    id: number;
    name: string;
    description: string;
    organisation?: IOrganisation;
}
