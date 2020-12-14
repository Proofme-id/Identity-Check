import { IHardware } from "./hardware.interface";
import { ISoftware } from "./software.interface";

export interface IUserProfile {
    software: ISoftware[];
    hardware: IHardware[];
}