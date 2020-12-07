import { IOrganisation } from "./organisation.interface";

export interface ISupplier {
    id: number;
    name: string;
    description: string;
    organisation?: IOrganisation;
}
