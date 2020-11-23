import { ICustomClaims } from "./customClaims.interface";

export interface IUserClaims {
    username: string;
    email: string;
    custom_claims: ICustomClaims[];
}
