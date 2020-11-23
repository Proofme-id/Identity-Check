import { IUserClaims } from "./userClaims.interface";

export interface IJWTDecoded {
    iat: number;
    aud: string;
    exp: number;
    publicKey: string;
    did: string;
    userId: number;
    userPower: number;
    user_claims: IUserClaims;
}
